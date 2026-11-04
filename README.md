# Sagnic Bhattacharyya – Portfolio
Plain HTML, CSS and vanilla JS. No build step, no API keys.

## Run locally
1. Open this folder in VS Code.
2. Right-click `index.html` → **Open with Live Server** (or run `python -m http.server`).

## Add your own files (I could not download these for you)
- `assets/images/profile.jpg` – copy the original from your sagnic-portfolio repo. Until you do, the site loads the identical file from your live portfolio.
- `assets/images/*.png` – copy `campus_companion.png`, `developer_career_os.png`, `image_05164b.png`, `image_0512a9.png` from the same repo (same remote fallback applies).
- `assets/resume/Sagnic_Bhattacharyya_Resume.pdf` – **required**; the resume buttons 404 until you add it.
- Certificate: add the image, then set `certImage` in `config.js`.

## Edit content
Everything lives in `config.js`. Featured repos listed there are hidden from the GitHub archive.

## Deploy
Push the folder to a GitHub repo, then Settings → Pages → deploy from `main`.
