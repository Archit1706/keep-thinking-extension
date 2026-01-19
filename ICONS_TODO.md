# Icons Required

The extension needs three icon files in `public/icons/`:

- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Quick Solution

For development testing, create simple placeholder icons:

### Using online tool:
1. Go to https://favicon.io/favicon-generator/
2. Generate icons with:
   - Text: "🧩" (puzzle emoji) or "BW"
   - Background: #4CAF50 (green)
   - Font: Any readable font
3. Download and extract to `public/icons/`

### Using ImageMagick (if installed):
```bash
cd public/icons
convert -size 16x16 xc:#4CAF50 -pointsize 12 -fill white -gravity center -annotate +0+0 "🧩" icon16.png
convert -size 48x48 xc:#4CAF50 -pointsize 32 -fill white -gravity center -annotate +0+0 "🧩" icon48.png
convert -size 128x128 xc:#4CAF50 -pointsize 96 -fill white -gravity center -annotate +0+0 "🧩" icon128.png
```

### Using any image editor:
1. Create a square canvas (16x16, 48x48, 128x128)
2. Fill with green background (#4CAF50)
3. Add a puzzle piece icon or brain icon in white
4. Save as PNG with the correct names

## Recommended Design

- **Concept**: Brain icon with puzzle piece overlay
- **Color scheme**:
  - Primary: #4CAF50 (green)
  - Accent: White or #FFFFFF
- **Style**: Flat, modern, simple (works well at small sizes)
- **Must be**: Clear and recognizable at 16x16 pixels

The extension will work without icons but Chrome will show warnings.
