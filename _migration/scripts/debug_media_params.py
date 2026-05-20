import requests

WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
SITE_URL   = "https://springgreen-sparrow-647332.hostingersite.com"

def check_media_params():
    print("Checking media with query params...")
    url = f"{SITE_URL}/wp-json/wp/v2/media"
    params = {
        "consumer_key": WOO_KEY,
        "consumer_secret": WOO_SECRET,
        "per_page": 5
    }
    r = requests.get(url, params=params)
    if r.ok:
        print("Success!")
        for m in r.json():
            print(f"ID={m['id']} | URL={m['source_url']}")
    else:
        print(f"Error: {r.status_code} - {r.text}")

if __name__ == "__main__":
    check_media_params()
