# Chrome Browser Extension

The **BeforeYouSign Chrome Extension** brings contract analysis directly into web browsers. When reading online terms of service, employment agreements in Google Docs, or SaaS signup forms, it highlights predatory clauses in-page—functioning like "Grammarly for Contracts."

---

## 1. Extension Architecture (Manifest V3)

The extension lives in `browser-extension/` and adheres to Google Chrome's Manifest V3 standards:

```
browser-extension/
├── manifest.json       # Manifest V3 configuration & permission grants
├── background.js       # Service worker handling context menus and API communication
├── content.js          # In-page script that parses text and injects highlights
├── content.css         # Styling for wavy underlines, badges, and tooltip popovers
├── icons/              # Extension icons (16px, 48px, 128px)
├── options/            # Settings page for selecting API base URL
└── popup/              # Popup window showing overall page risk gauge
```

---

## 2. In-Page Highlighting Mechanism

When an analysis is triggered (via popup, keyboard shortcut, or context menu):

1. **DOM Text Extraction:** `content.js` scans page blocks (`<p>`, `<li>`, `<div>`, `<span>`) for legal clauses and paragraph units.
2. **Analysis Query:** The extracted text is sent via `background.js` to the BeforeYouSign API (`/api/analyze` or `/api/detect-clauses`).
3. **Wavy Underlines:** For flagged clauses, `content.js` wraps the target text in custom highlight elements with color-coded wavy underlines:
   - 🔴 **Red (`.bys-risk-critical`):** Extreme risk (unilateral termination, unlimited liability).
   - 🟠 **Orange (`.bys-risk-high`):** High risk (strict non-compete, perpetual license).
   - 🟡 **Yellow (`.bys-risk-medium`):** Medium risk (short notice periods, vague terms).
   - 🟢 **Green (`.bys-risk-low`):** Bilateral and balanced protections.
4. **Interactive Hover Cards:** Hovering over an underlined clause reveals a tooltip containing:
   - Plain-English explanation of why the clause is problematic.
   - Recommended counter-wording or negotiation questions to ask.

---

## 3. Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Shift + B` (Windows/Linux) / `Cmd + Shift + B` (Mac) | Analyze the current visible page or selected text |
| `Ctrl + Shift + H` (Windows/Linux) / `Cmd + Shift + H` (Mac) | Toggle in-page highlights on/off without re-running analysis |
| Right-click context menu | "Analyze contract with BeforeYouSign" |

---

## 4. How to Install & Test (Developer Mode)

### Step 1: Generate Icon Assets (if not already present)
In your terminal:
```bash
cd browser-extension
node scripts/generate-icons.js
```

### Step 2: Load into Google Chrome
1. Open Google Chrome.
2. In the URL address bar, navigate to: `chrome://extensions`
3. Toggle on **Developer mode** in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the `browser-extension` directory inside the project root:
   `c:\Programming\Personal Coding\Projects\BFU\browser-extension`
6. The **⚖️ BeforeYouSign** icon will appear in your Chrome toolbar.

### Step 3: Configure Endpoint
By default, the extension targets:
- `http://localhost:3000` (for local development)
- `https://beforeyousign.vercel.app` (for production)

To switch between local and production, right-click the extension icon, choose **Options**, and update the API base URL.
