let currentSettings = null;

// Debounced apply helper to avoid thrashing on frequent mutations
let _debounceApplyTimeout = null;
function debouncedApply(settings, wait = 120) {
  if (!settings) return;
  if (_debounceApplyTimeout) clearTimeout(_debounceApplyTimeout);
  _debounceApplyTimeout = setTimeout(() => applySubtitleStyles(settings), wait);
}

// Helper to detect platform from hostname
function detectPlatform(hostname) {
  if (!hostname) return 'not supported';
  const host = hostname.toLowerCase();
  if (host.includes('netflix.com')) return 'netflix';
  if (host.includes('disneyplus.com')) return 'disney';
  if (host.includes('hbomax.com')) return 'hbomax';
  if (host.includes('hulu.com')) return 'hulu';
  if (host.includes('primevideo.com')) return 'prime';
  if (host.includes('wetv.vip')) return 'wetv';
  return 'not supported';
}

// Helper to produce a responsive font-size clamp
function getFontSizeClamp(fontSize) {
  const cqw = (fontSize / 56) * 3.4;

  return `clamp(4px, ${cqw}cqw, ${fontSize}px)`;
}

// Convert a hex color and opacity (0..1) to hex with alpha appended
function hexWithOpacity(hexColor, opacity) {
  if (hexColor == null) return hexColor;
  const op = Number(opacity) || 0;
  const clamped = Math.max(0, Math.min(1, op));
  const alpha = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
  if (hexColor.startsWith('#')) {
    return `${hexColor}${alpha}`;
  }
  return `#${hexColor}${alpha}`;
}

// Apply common text styles
function applyTextStyles(element, settings) {
  if (!element || !settings) return;

  element.style.fontFamily = settings.fontFamily;
  element.style.fontSize = getFontSizeClamp(settings.fontSize);
  element.style.color = settings.textColor;
  element.style.fontWeight = settings.fontWeight;
  element.style.textShadow = settings.textShadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none';
}

// Apply background styles to container
function applyBackgroundStyles(container, settings) {
  if (!container || !settings) return;
  container.style.backgroundColor = hexWithOpacity(
    settings.backgroundColor,
    settings.backgroundOpacity,
  );
  container.style.padding = '8px 16px';
  container.style.borderRadius = '4px';
}

// Platform-specific styling functions
const platformStylers = {
  netflix: (settings) => {
    try {
      const playerView = document.querySelector('.watch-video--player-view');
      if (playerView) {
        playerView.style.containerType = 'inline-size';
      }
      const container = document.querySelector('.player-timedtext-text-container');
      if (container) {
        // Adjust bottom offset
        const bottomOffset = container;
        if (bottomOffset && bottomOffset.style.bottom !== '8%') {
          bottomOffset.style.bottom = '8%';
        }
        // Find all spans within the subtitle container and apply styles if present
        const subtitles = container.querySelectorAll('span span');
        if (subtitles && subtitles.length > 0) {
          subtitles.forEach((subtitle) => {
            applyTextStyles(subtitle, settings);
            applyBackgroundStyles(subtitle, settings);
          });
        }
      }
    } catch (e) {
      console.error('Error in Netflix styling: ', e);
    }
  },

  disney: (settings) => {
    try {
      const container = document.querySelector('[data-testid="player-space-container"]');
      if (container) {
        const video = container.querySelector('video');
        if (video) {
          video.style.containerType = 'inline-size';
        }
        const textContainer = document.querySelector('.shaka-text-container');
        if (!textContainer) return;

        const positionFixed = textContainer && textContainer.parentElement;
        if (positionFixed) {
          const computedStyle = window.getComputedStyle(positionFixed);
          if (computedStyle && computedStyle.height !== '100%') {
            positionFixed.style.height = '100%';
          }
        }
        // Adjust bottom offset
        const bottomOffset = textContainer && textContainer.querySelector('div');
        if (bottomOffset) {
          const styleAttr = bottomOffset.getAttribute('style') || '';

          if (!styleAttr.includes('bottom: 8%')) {
            if (/bottom\s*:\s*\d+%/.test(styleAttr)) {
              const newStyle = styleAttr.replace(/bottom\s*:\s*\d+%/g, 'bottom: 8%');
              bottomOffset.setAttribute('style', newStyle);
            } else {
              const trimmed = styleAttr.trim().replace(/;+\s*$/, '');
              bottomOffset.setAttribute('style', (trimmed ? trimmed + ';' : '') + ' bottom: 8%;');
            }
          }
        }
        // Find span within the subtitle container
        const subtitles = textContainer.querySelector('span');
        if (subtitles !== null) {
          const fontSize = getFontSizeClamp(settings.fontSize);
          const color = settings.textColor || '#fff';
          const fontFamily = settings.fontFamily || 'inherit';
          subtitles.style.setProperty(
            'background-color',
            hexWithOpacity(settings.backgroundColor, settings.backgroundOpacity),
          );
          // applyBackgroundStyles(subtitles, settings);
          // if (settings.fontFamily) {
          //   subtitles.style.setProperty("font-family", settings.fontFamily, "important");
          // }
          // Set font-size on parent div
          let parent = subtitles.parentElement;
          while (parent && parent !== document.body) {
            // parent.style.setProperty("font-size", `${fontSize}px`, "important");
            if (parent.classList.contains('shaka-text-container')) break;
            parent = parent.parentElement;
          }
          // Only update/inject style if values changed
          const styleId = 'subtitle-appearance-disney';
          let style = document.getElementById(styleId);
          const cssContent = `
            .shaka-text-container span[style] {
              font-size: ${fontSize};
              color: ${color};
              font-family: ${fontFamily};
              text-shadow: ${settings.textShadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none'};
            }
            .shaka-text-container upgraded {
              bottom: 8%;
            }
          `;
          if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.textContent = cssContent;
            document.head.appendChild(style);
          } else if (style.textContent !== cssContent) {
            style.textContent = cssContent;
          }
          // Optionally log for debugging
          console.log(subtitles);
        }
        // subtitles.style.fontSize = settings.fontSize;

        // if (subtitles) {
        // }
        // if (subtitles && subtitles.length > 0) {
        //   const fontSize = subtitles[0].style.fontSize;
        //   if (!fontSize) return;
        //   if (fontSize !== settings.fontSize) {
        //     subtitles.forEach(subtitle => {
        //       applyTextStyles(subtitle, settings);
        //       applyBackgroundStyles(subtitle, settings);
        //     });
        //   }
        // }
        // const currentFontSize = subtitles[0].style.fontSize;
        // console.log(currentFontSize);
        // if (currentFontSize !== settings.fontSize) {
        //   subtitles.forEach(subtitle => {
        //     currentFontSize.style.fontSize = "10px";
        //     applyTextStyles(subtitle, settings);
        //     // applyBackgroundStyles(subtitle, settings);
        //   });
        // }
      }
    } catch (e) {
      console.error('Error in Disney styling: ', e);
    }
  },

  hbomax: (settings) => {
    const subtitles = document.querySelectorAll('.vjs-text-track-display .subtitle-text');
    subtitles.forEach((element) => {
      applyTextStyles(element, settings);
      const container = element.closest('.vjs-text-track-display');
      applyBackgroundStyles(container, settings);
    });
  },

  hulu: (settings) => {
    const captions = document.querySelectorAll('.caption-text');
    captions.forEach((element) => {
      applyTextStyles(element, settings);
      const container = element.closest('.caption-text-box');
      applyBackgroundStyles(container, settings);
    });
  },

  prime: (settings) => {
    const captions = document.querySelectorAll('.atvwebplayersdk-captions-text, .f35bt6a');
    captions.forEach((element) => {
      applyTextStyles(element, settings);
      // Prime Video may need different container logic
      applyBackgroundStyles(element, settings);
    });
  },

  wetv: (settings) => {
    try {
      const playerView = document.querySelector('#player-wrapper');
      if (playerView) {
        playerView.style.containerType = 'inline-size';
        playerView.style.margin = '0 auto';

        // Hide the page header when the WeTV fullscreen class is present
        const isFullscreen = playerView.classList.contains('wetv-player__page-fullscreen');
        const header = document.querySelector('header');
        if (isFullscreen) {
          if (header) header.style.display = 'none';
        } else if (header && header.style.display === 'none') {
          header.style.display = '';
        }

        const video = playerView.querySelector('video');
        // Defensive: video may not be present yet or metadata not loaded
        if (video) {
          const rect = video.getBoundingClientRect();
          let realWidth;
          let realHeight;

          // Use video metadata if available; otherwise fall back to rect dimensions
          const videoRatio = video.videoWidth / video.videoHeight;
          const containerRatio = rect.width / rect.height;

          if (videoRatio > containerRatio) {
            realWidth = rect.width;
            realHeight = rect.width / videoRatio;
          } else {
            realHeight = rect.height;
            realWidth = rect.height * videoRatio;
          }

          if (realWidth && !Number.isNaN(realWidth)) {
            playerView.style.width = realWidth + 'px';
          }
        }
        
        const container = document.querySelector('#player-wrapper .text-track');
        if (container) {
          // Adjust bottom offset and center horizontally relative to the real video area
          const bottomOffset = container;
          if (bottomOffset) {
            // Find the internal player wrapper (the element that defines the real video area)
            const internal =
              document.querySelector('#internal-player-wrapper') || (playerView && playerView);

            const applyPosition = () => {
              if (!internal || !bottomOffset) return;
              const rect = internal.getBoundingClientRect();
              if (rect) {
                // Set bottom offset to 8% of video height (in px) so it's anchored visually at ~8%
                const bottomPx = Math.round(rect.height * 0.08);

                bottomOffset.style.left = '50%';
                bottomOffset.style.bottom = `${bottomPx}px`;
                bottomOffset.style.transform = 'translateX(-50%)';
                bottomOffset.style.alignContent = 'end';
              }
            };

            applyPosition();
          }
          const span = container.querySelector('span');
          if (span) {
            const width = playerView.getBoundingClientRect().width;
            const value = Math.min(56, Math.max(4, width * 0.034 * (settings.fontSize / 56)));

            span.style.lineHeight = `${value * 1.4}px`;
            span.style.width = 'max-content';

            applyTextStyles(span, settings);
            applyBackgroundStyles(span, settings);
          }
        }
      }
    } catch (e) {
      console.error('Error in WeTV styling: ', e);
    }
  },
};

// Apply styles to subtitle elements
function applySubtitleStyles(settings) {
  const platform = detectPlatform(window.location.hostname);
  if (!platform || !platformStylers[platform]) return;

  platformStylers[platform](settings);
  currentSettings = settings;
}

// Observer to watch for dynamically added subtitles
function observeSubtitles() {
  const observer = new MutationObserver((mutations) => {
    if (!currentSettings) return;
    let shouldApply = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        shouldApply = true;
        break;
      }
      if (mutation.type === 'attributes') {
        // Ignore inline `style` changes we make ourselves to avoid a feedback loop
        if (mutation.attributeName && mutation.attributeName.toLowerCase() === 'style') continue;
        // React to other attribute changes (class, data-*, etc.)
        shouldApply = true;
        break;
      }
    }
    if (shouldApply) applySubtitleStyles(currentSettings);
  });

  // Observe DOM changes but filter attributes to avoid reacting to our own style updates
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-testid', 'role', 'aria-hidden'],
  });
}

// Load settings from storage on page load
chrome.storage.sync.get('subtitleSettings', (result) => {
  if (result && result.subtitleSettings) {
    applySubtitleStyles(result.subtitleSettings);
  }
});

// Listen for settings updates from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_SUBTITLE_STYLES') {
    applySubtitleStyles(message.settings);
  }
});

// Start observing for subtitle changes
observeSubtitles();
