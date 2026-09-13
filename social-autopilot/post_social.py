"""
Publica en la Pagina de Facebook y en Instagram Business de MakeMyWeb via Graph API.
Uso:
    python post_social.py --text "Texto del post" --image-url "https://..." [--facebook-only | --instagram-only]
Credenciales en .env (mismo directorio): FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN, IG_BUSINESS_ACCOUNT_ID
"""
import argparse
import json
import os
import time
import urllib.parse
import urllib.request

GRAPH_VERSION = "v26.0"
GRAPH_BASE = f"https://graph.facebook.com/{GRAPH_VERSION}"


def load_env():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    values = {}
    with open(env_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            values[key.strip()] = value.strip()
    return values


def graph_post(path, params):
    url = f"{GRAPH_BASE}/{path}"
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Graph API error {e.code}: {e.read().decode()}") from e


def graph_get(path, params):
    url = f"{GRAPH_BASE}/{path}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Graph API error {e.code}: {e.read().decode()}") from e


def post_to_facebook(env, text, image_url=None):
    page_id = env["FB_PAGE_ID"]
    token = env["FB_PAGE_ACCESS_TOKEN"]
    if image_url:
        result = graph_post(f"{page_id}/photos", {
            "url": image_url,
            "caption": text,
            "access_token": token,
        })
    else:
        result = graph_post(f"{page_id}/feed", {
            "message": text,
            "access_token": token,
        })
    return result


def post_to_instagram(env, caption, image_url):
    ig_id = env["IG_BUSINESS_ACCOUNT_ID"]
    token = env["FB_PAGE_ACCESS_TOKEN"]
    if not image_url:
        raise ValueError("Instagram requiere una image_url publica")

    container = graph_post(f"{ig_id}/media", {
        "image_url": image_url,
        "caption": caption,
        "access_token": token,
    })
    creation_id = container["id"]

    for _ in range(10):
        status = graph_get(creation_id, {"fields": "status_code", "access_token": token})
        if status.get("status_code") == "FINISHED":
            break
        time.sleep(2)

    result = graph_post(f"{ig_id}/media_publish", {
        "creation_id": creation_id,
        "access_token": token,
    })
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True, help="Texto/caption del post")
    parser.add_argument("--image-url", help="URL publica de la imagen (obligatoria para Instagram)")
    parser.add_argument("--facebook-only", action="store_true")
    parser.add_argument("--instagram-only", action="store_true")
    args = parser.parse_args()

    env = load_env()

    if not args.instagram_only:
        fb_result = post_to_facebook(env, args.text, args.image_url)
        print("Facebook:", fb_result)

    if not args.facebook_only:
        if not args.image_url:
            print("Instagram: omitido (no hay image_url)")
        else:
            ig_result = post_to_instagram(env, args.text, args.image_url)
            print("Instagram:", ig_result)


if __name__ == "__main__":
    main()
