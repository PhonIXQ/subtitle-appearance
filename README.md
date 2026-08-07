# Subtitle Appearance

A browser extension for Microsoft Edge, Chrome, and Safari that allows you to customize subtitle appearance on popular streaming platforms including Netflix, Disney+, HBO Max, Hulu, Prime Video, WeTV, and Viu.

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

Prebuilt Chrome/Edge downloads are available on the [Releases page](https://github.com/PhonIXQ/subtitle-appearance/releases) — download the zip, unzip it, and load the folder as described below. Safari requires building locally via Xcode (see the Safari section under Development Mode).

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

### Safari (macOS, local/unsigned)

Safari extensions run inside a wrapper macOS app. This project's Safari wrapper lives in `safari/Subtitle Appearance/Subtitle Appearance.xcodeproj` and is generated via Xcode's Safari Web Extension Converter — see [Development](#development) below for the one-command build.

1. Build and open the Xcode project:
   ```bash
   npm run build:safari
   ```
2. In Xcode, select the "Subtitle Appearance" scheme and press Run (⌘R) — this installs and enables the wrapper app.
3. In Safari, go to Settings → Advanced and enable "Show features for web developers".
4. Go to Settings → Developer and enable "Allow Unsigned Extensions" (this resets each time Safari relaunches, since the app isn't notarized).
5. Go to Settings → Extensions and enable "Subtitle Appearance".

## Development

```bash
# Install dependencies
npm install

# Run development build with watch mode
npm run dev

# Build for production
npm run build

# Build and open the Safari Xcode project
npm run build:safari
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