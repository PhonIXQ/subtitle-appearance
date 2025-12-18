# Subtitle Appearance

A Microsoft Edge browser extension that allows you to customize subtitle appearance on popular streaming platforms including Netflix, Disney+, HBO Max, Hulu, and Prime Video.

## Features

- 🎨 Customize font family, size, color, and weight
- 🌈 Adjust background color and opacity
- ✨ Toggle text shadow for better readability
- 👀 Live preview of subtitle styles
- 💾 Persistent settings across sessions
- 🎬 Support for multiple streaming platforms

## Supported Platforms

- Netflix
- Disney+
- HBO Max
- Hulu
- Amazon Prime Video

## Installation

### Development Mode

1. Clone the repository:
```bash
git clone https://github.com/PhonIXQ/subtitle-appearance.git
cd subtitle-appearance
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Edge:
   - Open Edge and go to `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

```bash
# Install dependencies
npm install

# Run development build with watch mode
npm run dev

# Build for production
npm run build
```

## Tech Stack

- ⚡ Vite - Build tool
- ⚛️ React - UI framework
- 🎨 Tailwind CSS - Styling
- 🔧 Chrome Extension Manifest V3

## Usage

1. Click the extension icon in your browser toolbar
2. Adjust subtitle appearance settings using the controls
3. Preview your changes in real-time
4. Click "Save Settings" to apply
5. Navigate to any supported streaming platform and enjoy customized subtitles!

## Project Structure

```
subtitle-appearance/
├── public/
│   ├── icons/          # Extension icons
│   └── manifest.json   # Extension manifest
├── src/
│   ├── components/     # React components
│   ├── content/        # Content scripts
│   ├── popup/          # Extension popup
│   ├── background/     # Background service worker
│   └── utils/          # Utility functions
├── dist/               # Build output
└── vite.config.js      # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

PhonIXQ

## Roadmap

- [ ] Add preset themes
- [ ] Import/export settings
- [ ] Support for more streaming platforms
- [ ] Advanced positioning controls
- [ ] Subtitle outline customization