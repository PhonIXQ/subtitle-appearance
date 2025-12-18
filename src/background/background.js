// Background service worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('Subtitle Appearance extension installed');
});

// Handle extension icon click if needed
chrome.action.onClicked.addListener((tab) => {
  // Optional: Add custom behavior when extension icon is clicked
});