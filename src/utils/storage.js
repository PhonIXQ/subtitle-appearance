// Default subtitle settings
export const DEFAULT_SETTINGS = {
  fontFamily: 'Arial',
  fontSize: '50',
  textColor: '#FFFFFF',
  backgroundColor: '#000000',
  backgroundOpacity: '0.75',
  textShadow: true,
  fontWeight: 'normal',
  textAlign: 'center',
  position: 'bottom',
  positionOffset: '0',
  positionFixed: false,
};

// Save settings to browser storage
export const saveSettings = async (settings) => {
  try {
    await chrome.storage.sync.set({ subtitleSettings: settings });
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Load settings from browser storage
export const loadSettings = async () => {
  try {
    const result = await chrome.storage.sync.get('subtitleSettings');
    return result.subtitleSettings || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};