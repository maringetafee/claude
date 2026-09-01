"""Thin wrapper around the Meta Graph API for publishing to Instagram + Facebook."""
import json
import time
import urllib.parse
import urllib.request

GRAPH_VERSION = "v21.0"
GRAPH_BASE = f"https://graph.facebook.com/{GRAPH_VERSION}"

VIDEO_EXTENSIONS = {".mp4", ".mov"}


def _post(path: str, params: dict) -> dict:
    url = f"{GRAPH_BASE}/{path}"
    data = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _get(path: str, params: dict) -> dict:
    url = f"{GRAPH_BASE}/{path}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def is_video(filename: str) -> bool:
    return any(filename.lower().endswith(ext) for ext in VIDEO_EXTENSIONS)


def publish_instagram(ig_user_id: str, access_token: str, media_url: str, caption: str, video: bool) -> str:
    if video:
        container = _post(f"{ig_user_id}/media", {
            "video_url": media_url,
            "caption": caption,
            "media_type": "REELS",
            "access_token": access_token,
        })
        creation_id = container["id"]
        for _ in range(30):
            status = _get(creation_id, {"fields": "status_code", "access_token": access_token})
            if status.get("status_code") == "FINISHED":
                break
            if status.get("status_code") == "ERROR":
                raise RuntimeError(f"Instagram video processing failed: {status}")
            time.sleep(10)
        else:
            raise RuntimeError("Timed out waiting for Instagram video to finish processing")
    else:
        container = _post(f"{ig_user_id}/media", {
            "image_url": media_url,
            "caption": caption,
            "access_token": access_token,
        })
        creation_id = container["id"]

    published = _post(f"{ig_user_id}/media_publish", {
        "creation_id": creation_id,
        "access_token": access_token,
    })
    return published["id"]


def publish_facebook(page_id: str, access_token: str, media_url: str, caption: str, video: bool) -> str:
    if video:
        result = _post(f"{page_id}/videos", {
            "file_url": media_url,
            "description": caption,
            "access_token": access_token,
        })
    else:
        result = _post(f"{page_id}/photos", {
            "url": media_url,
            "caption": caption,
            "access_token": access_token,
        })
    return result["id"]
