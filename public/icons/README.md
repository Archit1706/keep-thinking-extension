# Extension Icons

This directory should contain three icon files:
- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Creating Icons

You can create icons using one of these methods:

### Option 1: Using ImageMagick

```bash
# Install ImageMagick first
# macOS: brew install imagemagick
# Ubuntu/Debian: sudo apt-get install imagemagick

# Create icons from a source image
convert source.png -resize 16x16 icon16.png
convert source.png -resize 48x48 icon48.png
convert source.png -resize 128x128 icon128.png
```

### Option 2: Using Online Tools

- [Favicon.io](https://favicon.io/) - Generate icon sets from text, images, or emojis
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Comprehensive icon generator

### Option 3: Design Software

Use any graphic design software (Figma, Sketch, Adobe Illustrator) to create:
- A brain icon with a puzzle piece
- Color scheme: Primary green (#4CAF50) with accents
- Simple, recognizable design that works at small sizes

## Temporary Placeholder

For development, you can create simple colored squares:

```bash
# Create simple placeholder icons (requires ImageMagick)
convert -size 16x16 xc:#4CAF50 icon16.png
convert -size 48x48 xc:#4CAF50 icon48.png
convert -size 128x128 xc:#4CAF50 icon128.png
```
