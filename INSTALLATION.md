# Installation Guide

## Quick Start

### 1. Load the Extension in Chrome

The extension is already built and ready to use! Follow these steps:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Navigate to and select the `dist` folder from this project
5. The BrainWait extension should now appear in your extensions list!

### 2. Generate Proper Icons (Optional but Recommended)

Currently, the extension uses empty placeholder icons. To add proper icons:

**Option A - Use an online tool:**
1. Visit https://favicon.io/favicon-generator/
2. Configure:
   - Text: "🧩" (puzzle emoji) or "BW"
   - Background: #4CAF50 (green)
   - Choose any readable font
3. Generate and download
4. Extract the downloaded files
5. Copy `icon-16.png`, `icon-48.png`, and `icon-128.png` to `dist/icons/`
6. Rename them to `icon16.png`, `icon48.png`, and `icon128.png`

**Option B - Create your own:**
- Create three square PNG images (16x16, 48x48, 128x128 pixels)
- Use a brain or puzzle piece design with green (#4CAF50) background
- Save them to `dist/icons/` with names: `icon16.png`, `icon48.png`, `icon128.png`

After adding icons, click the **Refresh** button on the extension card in `chrome://extensions/`

### 3. Test the Extension

1. Navigate to one of the supported AI platforms:
   - ChatGPT: https://chat.openai.com or https://chatgpt.com
   - Claude: https://claude.ai
   - Gemini: https://gemini.google.com
   - DeepSeek: https://chat.deepseek.com
   - Perplexity: https://www.perplexity.ai

2. Ask the AI a question that will take a few seconds to answer

3. After 2.5 seconds of "thinking", the Side Panel should open automatically with a puzzle!

4. Click the extension icon in the toolbar to see your statistics

## Development

If you want to make changes to the extension:

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

After making changes, rebuild the extension and click **Refresh** in `chrome://extensions/`

## Configuration

Click the extension icon → Settings (gear icon) to configure:

- **Auto-activation**: Toggle automatic puzzle display
- **Trigger delay**: Adjust wait time before showing puzzles (1-10 seconds)
- **Puzzle types**: Enable/disable specific puzzle categories
- **Difficulty**: Choose manual level or adaptive mode
- **Notifications**: Control streak notifications
- **Appearance**: Light, dark, or system theme

## Troubleshooting

### Extension doesn't activate
- Check that you're on a supported AI platform
- Ensure auto-activation is enabled in settings
- Try increasing the trigger delay in settings
- Check the browser console for errors (F12)

### Puzzles not loading
- Refresh the extension in `chrome://extensions/`
- Check that at least one puzzle type is enabled in settings
- Clear browser cache and reload the page

### Side panel won't open
- Make sure you're using Chrome 114 or later (Side Panel API requirement)
- Try manually opening the side panel by clicking the extension icon → "Start a Puzzle"

## Privacy

BrainWait is completely private:
- All data is stored locally in your browser
- No information is sent to external servers
- No analytics or tracking of any kind
- Puzzles are generated entirely in your browser

## Uninstallation

To remove the extension:
1. Go to `chrome://extensions/`
2. Find BrainWait in the list
3. Click **Remove**
4. All local data (progress, settings) will be deleted

## Support

If you encounter issues:
1. Check the [README.md](README.md) for common solutions
2. Review the browser console for error messages (F12 → Console tab)
3. Open an issue on the GitHub repository with:
   - Chrome version
   - Error messages
   - Steps to reproduce the issue

---

**Enjoy keeping your brain active during AI wait times! 🧩**
