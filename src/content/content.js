// Content script to inject custom subtitle styles

let currentSettings = null;

// Detect current platform
function detectPlatform() {
  const hostname = window.location.hostname;
  if (hostname.includes("netflix.com")) return "netflix";
  if (hostname.includes("disneyplus.com")) return "disney";
  if (hostname.includes("hbomax.com")) return "hbomax";
  if (hostname.includes("hulu.com")) return "hulu";
  if (hostname.includes("primevideo.com")) return "prime";
  return null;
}

// Apply common text styles
function applyTextStyles(element, settings) {
  if (!element || !settings) return;

  element.style.fontFamily = settings.fontFamily;
  element.style.fontSize = `clamp(4px, 3.4cqw, 56px)`;
  element.style.color = settings.textColor;
  element.style.fontWeight = settings.fontWeight;
  element.style.textShadow = settings.textShadow ? "2px 2px 4px rgba(0,0,0,0.8)" : "none";
}

// Apply background styles to container
function applyBackgroundStyles(container, settings) {
  if (!container || !settings) return;

  const opacity = Math.round(settings.backgroundOpacity * 255)
    .toString(16)
    .padStart(2, "0");
  container.style.backgroundColor = `${settings.backgroundColor}${opacity}`;
  container.style.padding = "8px 16px";
  container.style.borderRadius = "4px";
}

// Platform-specific styling functions
const platformStylers = {
  netflix: settings => {
    try {
      const playerView = document.querySelector(".watch-video--player-view");
      if (playerView) {
        playerView.style.containerType = "inline-size";
        settings.fontSize = `clamp(4px, 3.4cqw, 56px)`;
      }
      const container = document.querySelector(".player-timedtext-text-container");
      if (container) {
        // Adjust bottom offset
        const bottomOffset = container;
        if (bottomOffset && bottomOffset.style.bottom !== "8%") {
          bottomOffset.style.bottom = "8%";
        }
        // Find all spans within the subtitle container
        const subtitles = container.querySelectorAll("span span");
        const currentFontSize = subtitles[0].style.fontSize;
        if (currentFontSize !== settings.fontSize) {
          subtitles.forEach(subtitle => {
            applyTextStyles(subtitle, settings);
            applyBackgroundStyles(subtitle, settings);
          });
        }
      }
    } catch (e) {
      console.error("Error in Netflix styling: ", e);
    }
  },

  disney: settings => {
    try {
      const container = document.querySelector('[data-testid="player-space-container"]');
      // console.log(container);
      if (container) {
        const video = container.querySelector("video");
        if (video) {
          video.style.containerType = "inline-size";
        }
        // if (container.style.cursor === "default") {
        const textContainer = document.querySelector(".shaka-text-container");
        if (!textContainer) return;

        const positionFixed = textContainer && textContainer.parentElement;
        if (positionFixed) {
          const computedStyle = window.getComputedStyle(positionFixed);
          if (computedStyle && computedStyle.height !== "100%") {
            positionFixed.style.height = "100%";
          }
        }
        // Adjust bottom offset
        const bottomOffset = textContainer && textContainer.querySelector("div");
        if (bottomOffset) {
          const styleAttr = bottomOffset.getAttribute("style") || "";

          if (!styleAttr.includes("bottom: 8%")) {
            if (/bottom\s*:\s*\d+%/.test(styleAttr)) {
              const newStyle = styleAttr.replace(/bottom\s*:\s*\d+%/g, "bottom: 8%");
              bottomOffset.setAttribute("style", newStyle);
            } else {
              const trimmed = styleAttr.trim().replace(/;+\s*$/, "");
              bottomOffset.setAttribute("style", (trimmed ? trimmed + ";" : "") + " bottom: 8%;");
            }
          }
        }
        // Find span within the subtitle container
        // }
        const subtitles = textContainer.querySelector("span");
        if (subtitles !== null) {
          console.log(settings.fontSize);
          const fontSize = `clamp(4px, 3.4cqw, 56px)`;
          const color = settings.textColor || "#fff";
          const fontFamily = settings.fontFamily || "inherit";
          // subtitles.style.setProperty("font-size", `${fontSize}px`, "important");
          // subtitles.style.setProperty("color", color, "important");
          subtitles.style.setProperty(
            "background-color",
            `${settings.backgroundColor}${Math.round(settings.backgroundOpacity * 255)
              .toString(16)
              .padStart(2, "0")}`
          );
          // applyBackgroundStyles(subtitles, settings);
          // if (settings.fontFamily) {
          //   subtitles.style.setProperty("font-family", settings.fontFamily, "important");
          // }
          // Set font-size on parent div
          let parent = subtitles.parentElement;
          while (parent && parent !== document.body) {
            // parent.style.setProperty("font-size", `${fontSize}px`, "important");
            if (parent.classList.contains("shaka-text-container")) break;
            parent = parent.parentElement;
          }
          // Only update/inject style if values changed
          const styleId = "subtitle-appearance-disney";
          let style = document.getElementById(styleId);
          const cssContent = `
            .shaka-text-container span[style] {
              font-size: ${fontSize};
              color: ${color};
              font-family: ${fontFamily};
              text-shadow: ${settings.textShadow ? "2px 2px 4px rgba(0,0,0,0.8)" : "none"};
            }
            .shaka-text-container upgraded {
              bottom: 8%;
            }
          `;
          if (!style) {
            style = document.createElement("style");
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
      console.error("Error in Disney styling: ", e);
    }
  },

  hbomax: settings => {
    const subtitles = document.querySelectorAll(".vjs-text-track-display .subtitle-text");
    subtitles.forEach(element => {
      applyTextStyles(element, settings);
      const container = element.closest(".vjs-text-track-display");
      applyBackgroundStyles(container, settings);
    });
  },

  hulu: settings => {
    const captions = document.querySelectorAll(".caption-text");
    captions.forEach(element => {
      applyTextStyles(element, settings);
      const container = element.closest(".caption-text-box");
      applyBackgroundStyles(container, settings);
    });
  },

  prime: settings => {
    const captions = document.querySelectorAll(".atvwebplayersdk-captions-text, .f35bt6a");
    captions.forEach(element => {
      applyTextStyles(element, settings);
      // Prime Video may need different container logic
      applyBackgroundStyles(element, settings);
    });
  },
};

// Apply styles to subtitle elements
function applySubtitleStyles(settings) {
  const platform = detectPlatform();
  if (!platform || !platformStylers[platform]) return;

  platformStylers[platform](settings);
  currentSettings = settings;
}

// Observer to watch for dynamically added subtitles
function observeSubtitles() {
  const observer = new MutationObserver(() => {
    if (currentSettings) {
      applySubtitleStyles(currentSettings);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  });
}

// Load settings from storage on page load
chrome.storage.sync.get("subtitleSettings", result => {
  if (result.subtitleSettings) {
    applySubtitleStyles(result.subtitleSettings);
  }
});

// Listen for settings updates from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_SUBTITLE_STYLES") {
    applySubtitleStyles(message.settings);
  }
});

// Start observing for subtitle changes
observeSubtitles();

console.log("Subtitle Appearance extension loaded");
