# BeforeYouSign — Chrome Extension

Grammarly for contracts. Automatically highlights risky clauses on any web page with wavy colored underlines, hover tooltips, and a popup risk panel.

## Features

- 🔴 **Grammarly-style underlines** — colored wavy underlines on risky passages (red = critical, orange = high, yellow = medium, green = low)
- 💬 **Hover tooltips** — plain-language explanation, concerns, and improvement suggestions on hover
- 📊 **Popup risk panel** — animated SVG gauge + sorted issue list when you click the extension icon
- 🔔 **Page badge** — floating indicator showing risk count after analysis
- ⌨️ **Keyboard shortcuts** — `Ctrl+Shift+B` to re-analyze, `Ctrl+Shift+H` to toggle highlights
- 🖱️ **Right-click** menu → "Analyze contract with BeforeYouSign"

## How to Install (Developer Mode)

> **Prerequisite:** The BeforeYouSign Next.js app must be running at `http://localhost:3000`

1. Start the app:
   ```bash
   cd <project-root>
   npm run dev
   ```

2. Open Chrome → address bar → `chrome://extensions`

3. Enable **Developer mode** (top-right toggle)

4. Click **Load unpacked**

5. Select this folder: `<project-root>/browser-extension/`

6. The **⚖ BeforeYouSign** extension icon appears in your toolbar

## Generating Icons

The `icons/` folder needs PNG files (16×16, 48×48, 128×128). Run:

```bash
node scripts/generate-icons.js
```

Or manually create any PNG with the scale tool of your choice and place them as:
- `icons/icon16.png`
- `icons/icon48.png`  
- `icons/icon128.png`

## File Structure

```
browser-extension/
  manifest.json         ← Extension manifest (MV3)
  background.js         ← Service worker (state, badge, context menu)
  content.js            ← Injected into every page (highlights + tooltips)
  content.css           ← Styles for tooltips and highlights  
  popup/
    popup.html          ← Extension popup UI
    popup.js            ← Popup logic (gauge, issue list)
    popup.css           ← Popup styles
  options/
    options.html        ← Settings page
    options.js          ← Settings save/load
  icons/
    icon16.png
    icon48.png
    icon128.png
```

## Settings

Click the **⚙ gear icon** in the popup to open Settings:

| Setting | Default | Description |
|---------|---------|-------------|
| App URL | `localhost:3000` | Change to your deployed URL |
| Auto-analyze | On | Scan pages automatically |
| Show badge | On | Bottom-right floating risk indicator |
| Highlights | On | Colored underlines on risky clauses |

## How it Works

1. Content script loads on every page after 1.5s
2. Checks if the page looks like a contract (≥3 legal keywords)
3. Extracts text from `<main>`, `<article>`, `.document`, etc.
4. Calls `POST /api/detect-clauses` on your local BeforeYouSign app
5. Wraps matching text nodes in colored `<span>` elements
6. Attaches hover tooltip events
7. Updates extension badge with risk count
8. Sends data to background worker for popup access
