import React from 'react';

function StyleControls({ settings, onSettingChange }) {
  const fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia'];
  const fontSizes = ['16', '18', '20', '24', '28', '32', '36', '40'];

  return (
    <div className="space-y-4 mt-4">
      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Family
        </label>
        <select
          value={settings.fontFamily}
          onChange={(e) => onSettingChange('fontFamily', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size: {settings.fontSize}px
        </label>
        <input
          type="range"
          min="16"
          max="60"
          value={settings.fontSize}
          onChange={(e) => onSettingChange('fontSize', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) => onSettingChange('textColor', e.target.value)}
            className="h-10 w-20 rounded cursor-pointer"
          />
          <input
            type="text"
            value={settings.textColor}
            onChange={(e) => onSettingChange('textColor', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
            className="h-10 w-20 rounded cursor-pointer"
          />
          <input
            type="text"
            value={settings.backgroundColor}
            onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Background Opacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Opacity: {Math.round(settings.backgroundOpacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.backgroundOpacity}
          onChange={(e) => onSettingChange('backgroundOpacity', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Text Shadow */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="textShadow"
          checked={settings.textShadow}
          onChange={(e) => onSettingChange('textShadow', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="textShadow" className="ml-2 text-sm font-medium text-gray-700">
          Enable Text Shadow
        </label>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Weight
        </label>
        <select
          value={settings.fontWeight}
          onChange={(e) => onSettingChange('fontWeight', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="600">Semi-Bold</option>
          <option value="300">Light</option>
        </select>
      </div>
    </div>
  );
}

export default StyleControls;