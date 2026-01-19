# BrainWait - Puzzles for AI Idle Time

Keep your brain active while AI chatbots generate responses. BrainWait is a Chrome extension that intelligently displays engaging puzzles during ChatGPT, Claude, Gemini, and other AI chatbot wait times.

## Features

- 🧩 **5 Puzzle Types**: Riddles, Quick Math, Word Anagrams, Word Ladders, and Pattern Recognition
- 🎯 **Adaptive Difficulty**: Automatically adjusts to maintain optimal challenge (70% success rate)
- 🔥 **Streak Tracking**: Daily puzzle streaks and comprehensive statistics
- ⚙️ **Customizable**: Control puzzle types, activation delay, and difficulty settings
- 🎨 **Side Panel UI**: Non-intrusive puzzle display that doesn't interfere with your chat
- 🌓 **Dark Mode**: Automatic theme switching based on system preferences

## Supported Platforms

- ChatGPT (chat.openai.com, chatgpt.com)
- Claude (claude.ai)
- Google Gemini (gemini.google.com)
- DeepSeek (chat.deepseek.com)
- Perplexity (perplexity.ai)

## Installation

### Development Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/brainwait-extension.git
   cd brainwait-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project

### Creating Icons

The extension requires icons in three sizes (16px, 48px, 128px). You can create them using:

```bash
# Install ImageMagick (if not already installed)
# macOS: brew install imagemagick
# Ubuntu/Debian: sudo apt-get install imagemagick

# Create icons (replace input.png with your source image)
convert input.png -resize 16x16 public/icons/icon16.png
convert input.png -resize 48x48 public/icons/icon48.png
convert input.png -resize 128x128 public/icons/icon128.png
```

Or use an online tool like [favicon.io](https://favicon.io/) to generate icon sets.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── background/          # Service worker
│   └── service-worker.ts
├── content/            # Content scripts for platform detection
│   └── content-detector.ts
├── sidepanel/          # Main puzzle UI
│   ├── App.tsx
│   ├── components/
│   └── styles.css
├── popup/              # Extension popup
│   ├── Popup.tsx
│   └── popup.css
├── puzzles/            # Puzzle generators
│   ├── riddles.ts
│   ├── quickMath.ts
│   ├── wordAnagram.ts
│   ├── wordLadder.ts
│   └── patterns.ts
├── lib/                # Utilities
│   ├── storage.ts
│   └── adaptiveDifficulty.ts
└── types/              # TypeScript definitions
    └── index.ts
```

## How It Works

1. **Detection**: Content scripts monitor AI chat platforms for "thinking" states using MutationObservers
2. **Trigger Delay**: 2.5-second delay prevents activation on quick responses
3. **Side Panel**: Opens automatically with a puzzle when AI is still processing
4. **Adaptive Difficulty**: Tracks your performance and adjusts puzzle difficulty to maintain ~70% success rate
5. **Progress Tracking**: Saves your statistics, streaks, and puzzle preferences

## Configuration

Access settings through the extension popup or side panel. Available options:

- **Auto-activation**: Toggle automatic puzzle display
- **Trigger delay**: Adjust wait time before puzzles appear (1-10 seconds)
- **Puzzle types**: Enable/disable specific puzzle categories
- **Difficulty**: Choose manual difficulty or adaptive mode
- **Notifications**: Control streak and achievement notifications

## Privacy

BrainWait processes all data locally. No information is sent to external servers:

- Puzzle generation happens entirely in your browser
- Statistics are stored using Chrome's local storage API
- No analytics or tracking of any kind

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] More puzzle types (mini Sudoku, logic puzzles)
- [ ] Cloud sync for cross-device progress
- [ ] Daily challenges and leaderboards
- [ ] Custom puzzle creation
- [ ] Additional AI platform support

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Research on cognitive benefits: Columbia/Duke studies on language-based puzzles
- Chrome Extension API documentation
- Open source puzzle databases

## Support

If you encounter issues:
1. Check the Chrome DevTools console for errors
2. Try disabling/re-enabling the extension
3. Open an issue on GitHub with details about your setup

---

**Note**: This extension requires Chrome version 114+ for Side Panel API support.
