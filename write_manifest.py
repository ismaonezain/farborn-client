import json

# Paste your full accountAssociation values here
header = input("Paste header: ").strip()
payload = input("Paste payload: ").strip()
signature = input("Paste signature: ").strip()

manifest = {
    "accountAssociation": {
        "header": header,
        "payload": payload,
        "signature": signature
    },
    "frame": {
        "version": "2",
        "name": "Farborn",
        "iconUrl": "https://farborn-client.vercel.app/icon.png",
        "homeUrl": "https://farborn-client.vercel.app",
        "buttonTitle": "Play Farborn",
        "splashImageUrl": "https://farborn-client.vercel.app/icon.png",
        "splashBackgroundColor": "#0a0a2a"
    }
}

with open(r"C:\Users\ismaonezain\farborn-client\public\.well-known\farcaster.json", "w") as f:
    json.dump(manifest, f, indent=2)

print("Done! Manifest written.")
