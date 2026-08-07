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
  if (host.includes('viu.com')) return 'viu';
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

// Toggle theatre mode by modifying existing classes' inline styles (no new class creation)
function toggleTheatreMode(target) {
  const bodyTarget = target || document.body;
  // Determine current state by checking a marker on body
  const active = document.body.getAttribute('data-subtitle-theatre-active') === 'true';

  const applyStyles = () => {
    // Hide header elements and any .Box-root elements, remove top padding
    // document.querySelectorAll('header, .Box-root').forEach((el) => {
    //   if (!el.hasAttribute('data-prev-styles')) {
    //     const prev = { display: el.style.display || '', paddingTop: el.style.paddingTop || '' };
    //     el.setAttribute('data-prev-styles', JSON.stringify(prev));
    //   }
    //   el.style.display = 'none';
    //   el.style.paddingTop = '0px';
    // });

    // Container-root => padding-left/right 0
    // document.querySelectorAll('.Container-root').forEach((el) => {
    //   if (!el.hasAttribute('data-prev-styles')) {
    //     const prev = { paddingLeft: el.style.paddingLeft || '', paddingRight: el.style.paddingRight || '' };
    //     el.setAttribute('data-prev-styles', JSON.stringify(prev));
    //   }
    //   el.style.paddingLeft = '0px';
    //   el.style.paddingRight = '0px';
    // });

    // Grid container => margin: 0 auto
    // document.querySelectorAll('.Grid-root.Grid-container').forEach((el) => {
    //   if (!el.hasAttribute('data-prev-styles')) {
    //     const prev = { margin: el.style.margin || '' };
    //     el.setAttribute('data-prev-styles', JSON.stringify(prev));
    //   }
    //   el.style.margin = '0 auto';
    // });

    // Grid item => flex: 1
    // document.querySelectorAll('.Grid-root.Grid-item').forEach((el) => {
    //   if (!el.hasAttribute('data-prev-styles')) {
    //     const prev = { flex: el.style.flex || '' };
    //     el.setAttribute('data-prev-styles', JSON.stringify(prev));
    //   }
    //   el.style.flex = '1 1 auto';
    // });

    // Optionally constrain the player wrapper width
    // if (bodyTarget && bodyTarget.style) {
    //   if (!bodyTarget.hasAttribute('data-prev-styles')) {
    //     const prev = { maxWidth: bodyTarget.style.maxWidth || '', margin: bodyTarget.style.margin || '' };
    //     bodyTarget.setAttribute('data-prev-styles', JSON.stringify(prev));
    //   }
    //   bodyTarget.style.maxWidth = '1200px';
    //   bodyTarget.style.margin = '0 auto';
    // }

    document.body.setAttribute('data-subtitle-theatre-active', 'true');
    return true;
  };

  const restoreStyles = () => {
    // Restore header and any .Box-root elements
    document.querySelectorAll('header, .Box-root').forEach((el) => {
      try {
        const prev = el.getAttribute('data-prev-styles');
        if (prev) {
          const parsed = JSON.parse(prev);
          el.style.display = parsed.display || '';
          el.style.paddingTop = parsed.paddingTop || '';
          el.removeAttribute('data-prev-styles');
        }
      } catch (e) {}
    });

    // Restore containers
    document.querySelectorAll('.Container-root').forEach((el) => {
      try {
        const prev = el.getAttribute('data-prev-styles');
        if (prev) {
          const parsed = JSON.parse(prev);
          el.style.paddingLeft = parsed.paddingLeft || '';
          el.style.paddingRight = parsed.paddingRight || '';
          el.removeAttribute('data-prev-styles');
        }
      } catch (e) {}
    });

    // Restore grid containers
    document.querySelectorAll('.Grid-root.Grid-container').forEach((el) => {
      try {
        const prev = el.getAttribute('data-prev-styles');
        if (prev) {
          const parsed = JSON.parse(prev);
          el.style.margin = parsed.margin || '';
          el.removeAttribute('data-prev-styles');
        }
      } catch (e) {}
    });

    // Restore grid items
    document.querySelectorAll('.Grid-root.Grid-item').forEach((el) => {
      try {
        const prev = el.getAttribute('data-prev-styles');
        if (prev) {
          const parsed = JSON.parse(prev);
          el.style.flex = parsed.flex || '';
          el.removeAttribute('data-prev-styles');
        }
      } catch (e) {}
    });

    // Restore body/player wrapper
    if (bodyTarget && bodyTarget.style) {
      try {
        const prev = bodyTarget.getAttribute('data-prev-styles');
        if (prev) {
          const parsed = JSON.parse(prev);
          bodyTarget.style.maxWidth = parsed.maxWidth || '';
          bodyTarget.style.margin = parsed.margin || '';
          bodyTarget.removeAttribute('data-prev-styles');
        }
      } catch (e) {}
    }

    document.body.setAttribute('data-subtitle-theatre-active', 'false');
    return false;
  };

  return active ? restoreStyles() : applyStyles();
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

  viu: (settings) => {
    try {
      const playerWrapper = document.querySelector('bitmovinplayer-video-null');
      if (playerWrapper) {
        playerWrapper.style.containerType = 'inline-size';
      }

      // Common subtitle selectors observed on various players — be defensive
      const selectors = [
        '.subtitle',
        '.captions',
        '.caption-text',
        '.player-subtitle',
        '.viu-subtitles',
        '.vui-subtitle',
      ];
      const found = new Set();
      selectors.forEach((sel) => {
        const nodes = document.querySelectorAll(sel);
        if (nodes && nodes.length) nodes.forEach((n) => found.add(n));
      });

      if (found.size === 0) {
        // Fallback: look for any element with role="caption" or data-track
        document.querySelectorAll('[role="caption"], [data-track]').forEach((n) => found.add(n));
      }

      found.forEach((el) => {
        try {
          applyTextStyles(el, settings);
          const container = el.closest('.subtitle-container') || el.parentElement;
          applyBackgroundStyles(container, settings);
        } catch (inner) {
          // ignore per-element errors
        }
      });

      // Copy a control button into the bmpui container if present — wait for controls if they're added later
      try {
        const attemptInject = () => {
          const controls =
            document.querySelector('[aria-label="Video player controls"]') ||
            document.querySelector(
              '.bmpui-ui-container.bmpui-controlbar-top, .bmpui-ui-container.bmpui-controlbar-top-right',
            );
          // Prefer the dedicated full-screen / theatre toggle when present
          const button =
            controls &&
            (controls.querySelector('#full_screen_btn') ||
              controls.querySelector('button, [role="button"]'));
          const targetWrapper =
            document.querySelector(
              '.bmpui-ui-container.bmpui-controlbar-top-right .bmpui-container-wrapper',
            ) ||
            document.querySelector(
              '.bmpui-ui-container.bmpui-controlbar-top .bmpui-container-wrapper',
            ) ||
            document.querySelector('.bmpui-container-wrapper');
          if (button && targetWrapper) {
            // Avoid adding duplicates
            if (!targetWrapper.querySelector('[data-copied-by-subtitle-appearance]')) {
              const cloned = button.cloneNode(true);
              cloned.setAttribute('data-copied-by-subtitle-appearance', 'true');
              // If this is the full-screen button, mark it and forward clicks to the original to toggle theatre mode
              if (button.id === 'full_screen_btn') {
                cloned.setAttribute('data-theatre-button', 'true');
                if (!cloned.title) cloned.title = 'Theatre mode';
                // Update aria-label to reflect theatre behavior and remove fullscreen onclick if present
                cloned.setAttribute('aria-label', 'Theatre mode');
                cloned.removeAttribute('onclick');
                try {
                  cloned.addEventListener('click', () => {
                    try {
                      const on = toggleTheatreMode(playerWrapper || document.body);
                      cloned.setAttribute('aria-pressed', on ? 'true' : 'false');
                    } catch (e) {
                      // ignore
                    }
                  });
                } catch (e) {
                  // ignore
                }
              }
              cloned.removeAttribute('id');
              targetWrapper.appendChild(cloned);
            }
            return true;
          }
          return false;
        };

        if (!attemptInject()) {
          const observer = new MutationObserver((mutations, obs) => {
            try {
              if (attemptInject()) {
                obs.disconnect();
              }
            } catch (e) {
              // ignore
            }
          });
          observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
          });
          // Safety: stop observing after 10s to avoid leaks
          setTimeout(() => {
            try {
              observer.disconnect();
            } catch (e) {}
          }, 10000);
        }
      } catch (copyErr) {
        // non-fatal
      }
    } catch (e) {
      console.error('Error in Viu styling: ', e);
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
