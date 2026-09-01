"""
Orchestrator: picks the next unpublished file from content/queue/, generates a
caption with Claude, publishes it to Instagram and Facebook, then moves the
file to content/posted/ and logs the result.

Env vars required (set as GitHub Actions secrets):
  ANTHROPIC_API_KEY      - Claude API key (falls back to a generic caption if missing)
  IG_USER_ID             - Instagram Business Account ID
  FB_PAGE_ID             - Facebook Page ID
  FB_PAGE_ACCESS_TOKEN   - Page access token with instagram_content_publish,
                            pages_manage_posts, pages_read_engagement
  GITHUB_REPOSITORY      - auto-set by GitHub Actions ("owner/repo")
  BUSINESS_NICHE         - optional, overrides the default niche description
  DRY_RUN                - "true" to skip real publishing (prints instead)
"""
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import caption as caption_mod
import graph_api

ROOT = Path(__file__).resolve().parents[1]
QUEUE_DIR = ROOT / "content" / "queue"
POSTED_DIR = ROOT / "content" / "posted"
LOG_FILE = ROOT / "content" / "posted.json"

MEDIA_EXTENSIONS = {".jpg", ".jpeg", ".png", ".mp4", ".mov"}


def load_log() -> list:
    if LOG_FILE.exists():
        return json.loads(LOG_FILE.read_text(encoding="utf-8"))
    return []


def save_log(entries: list) -> None:
    LOG_FILE.write_text(json.dumps(entries, indent=2, ensure_ascii=False), encoding="utf-8")


def pick_next_file() -> Path | None:
    candidates = sorted(
        p for p in QUEUE_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in MEDIA_EXTENSIONS
    )
    return candidates[0] if candidates else None


def read_sidecar_context(media_path: Path) -> str | None:
    sidecar = media_path.with_suffix(".txt")
    if sidecar.exists():
        return sidecar.read_text(encoding="utf-8").strip()
    return None


def build_raw_url(filename: str) -> str:
    repo = os.environ["GITHUB_REPOSITORY"]
    branch = os.environ.get("GITHUB_REF_NAME", "main")
    return f"https://raw.githubusercontent.com/{repo}/{branch}/social-automation/content/queue/{filename}"


def main() -> int:
    dry_run = os.environ.get("DRY_RUN", "").lower() == "true"

    media_path = pick_next_file()
    if media_path is None:
        print("No hay contenido pendiente en content/queue/. Nada que publicar.")
        return 0

    filename = media_path.name
    video = graph_api.is_video(filename)
    niche = os.environ.get("BUSINESS_NICHE", caption_mod.DEFAULT_NICHE)
    extra_context = read_sidecar_context(media_path)

    print(f"Publicando: {filename} (video={video})")
    text = caption_mod.generate_caption(niche, extra_context, filename)
    print(f"Caption generada:\n{text}\n")

    if dry_run:
        print("[DRY_RUN] No se publica de verdad. Simulacion completada.")
        return 0

    media_url = build_raw_url(filename)
    ig_user_id = os.environ["IG_USER_ID"]
    fb_page_id = os.environ["FB_PAGE_ID"]
    access_token = os.environ["FB_PAGE_ACCESS_TOKEN"]

    ig_post_id = graph_api.publish_instagram(ig_user_id, access_token, media_url, text, video)
    print(f"Publicado en Instagram: {ig_post_id}")

    fb_post_id = graph_api.publish_facebook(fb_page_id, access_token, media_url, text, video)
    print(f"Publicado en Facebook: {fb_post_id}")

    POSTED_DIR.mkdir(parents=True, exist_ok=True)
    media_path.rename(POSTED_DIR / filename)
    sidecar = media_path.with_suffix(".txt")
    if sidecar.exists():
        sidecar.rename(POSTED_DIR / sidecar.name)

    log = load_log()
    log.append({
        "file": filename,
        "caption": text,
        "instagram_post_id": ig_post_id,
        "facebook_post_id": fb_post_id,
        "published_at": datetime.now(timezone.utc).isoformat(),
    })
    save_log(log)

    print("Listo.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
