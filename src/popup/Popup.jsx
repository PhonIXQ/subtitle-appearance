import React, { useState, useEffect } from 'react';
import StyleControls from '../components/StyleControls';
import SubtitlePreview from '../components/SubtitlePreview';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/storage';

function Popup() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    const success = await saveSettings(settings);
    if (success) {
      setSaved(true);
      // Send message to content script to update styles
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_SUBTITLE_STYLES',
          settings,
        });
      });
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <div className="w-96 p-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Subtitle Appearance
      </h1>

      <SubtitlePreview settings={settings} />

      <StyleControls
        settings={settings}
        onSettingChange={handleSettingChange}
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Popup;