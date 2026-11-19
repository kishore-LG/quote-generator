# Daily Inspiration — Random Quote Generator

A responsive, offline-friendly quote generator built with **HTML, CSS and vanilla JavaScript**.

## Features

- Random quote shown automatically on launch
- 109 locally stored quotes across Motivation, Success, Education, Happiness, Friendship and Life
- Category filter (including an all-quotes view)
- New Quote avoids showing the same quote twice in a row
- Smooth quote transition
- Copy and native share (with clipboard fallback where supported)
- Favorites saved in browser `localStorage`
- Light/dark theme saved in browser `localStorage`
- Responsive layout for phones, tablets and desktops
- No API key, backend, database, build step or internet connection required

## Project structure

```text
daily-inspiration/
├── index.html
├── assets/
│   ├── app.js
│   ├── quotes.js
│   └── styles.css
└── README.md
```

## Run locally

**Option 1 — simplest:** open `index.html` in a modern browser.

**Option 2 — local development server (recommended):**

Python 3:
```bash
python -m http.server 8000
```
Then open <http://localhost:8000>.

No `requirements.txt` is needed because this project does not use Python or Flask.

## Data and privacy

Quotes are stored in `assets/quotes.js`. Favorites and theme preference are stored only in the current browser's local storage. They are not synced between devices and are not uploaded to a server. Clearing browser site data will clear saved favorites and theme preference.

## Upload to GitHub

1. Create a new empty repository on <https://github.com/new>, for example `daily-inspiration`.
2. Extract this ZIP file.
3. Open a terminal in the extracted `daily-inspiration` folder.
4. Run:

```bash
git init
git add .
git commit -m "Initial commit: Daily Inspiration quote generator"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/daily-inspiration.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Deploy online

### GitHub Pages
1. Open your GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site. Your public URL will appear in the Pages settings.

### Netlify (alternative)
1. Sign in at <https://www.netlify.com/>.
2. Choose **Add new site → Import an existing project**.
3. Connect GitHub and select this repository.
4. Leave the build command empty and set the publish directory to `/` (or the repository root).
5. Deploy.

Because this is a static frontend, you do not need Flask, SQLite, environment variables or a server process.

## Customizing quotes

Edit `assets/quotes.js`. Each quote has this shape:

```js
{
  "text": "Your quote goes here.",
  "author": "Author name",
  "category": "Motivation"
}
```

Keep the category consistent with the category options in `index.html`, or add a new option there.

## Browser support notes

- Clipboard access is best supported on HTTPS sites and localhost. A fallback is included for local files.
- Native share appears on browsers/devices that support the Web Share API. Otherwise the app copies the quote when clipboard access is available.
- Favorites and theme are device/browser-specific because they use local storage.
