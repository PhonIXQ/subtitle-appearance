import React, { useState, useEffect } from 'react';
import StyleControls from '../components/StyleControls';
import SubtitlePreview from '../components/SubtitlePreview';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/storage';
import detectPlatform from '../utils/platform';

function Popup() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [hostname, setHostname] = useState('');
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  useEffect(() => {
    // Get the active tab's hostname and determine platform
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs.length) return;
      try {
        const url = tabs[0].url || '';
        const host = url ? new URL(url).hostname : '';
        setHostname(host);
        const detected = detectPlatform(host);
        setPlatform(detected);
      } catch (e) {
        setHostname('');
        setPlatform('not supported');
      }
    });
  }, []);

  function renderContent() {
    if (platform === 'not supported') {
      return (
        <div className="text-sm text-gray-600 mb-3">
          <div>Host: {hostname || 'unknown'}</div>
          <div>
            Status:{' '}
            <span
              className={`${platform === 'not supported' ? 'text-red-600' : 'text-green-600'} capitalize`}
            >
              {platform}
            </span>
          </div>
        </div>
      );
    }

    return (
      <>
        <SubtitlePreview settings={settings} />

        <StyleControls settings={settings} onSettingChange={handleSettingChange} />

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
      </>
    );
  }

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
        if (!tabs.length) return;
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_SUBTITLE_STYLES',
          settings,
        });
      });
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = async () => {
    await saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'UPDATE_SUBTITLE_STYLES',
        settings: DEFAULT_SETTINGS,
      });
    });
  };

  return (
    <div className="w-96 p-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Subtitle Appearance</h1>

      {renderContent()}
    </div>
  );
}

export default Popup;
