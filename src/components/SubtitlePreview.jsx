import React from 'react';

function SubtitlePreview({ settings }) {
  const previewStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `clamp(14px, 3.4vw, 56px)`,
    // fontSize: `${settings.fontSize}px`,
    color: settings.textColor,
    backgroundColor: `${settings.backgroundColor}${Math.round(settings.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
    textShadow: settings.textShadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
    fontWeight: settings.fontWeight,
    textAlign: settings.textAlign,
    padding: '8px 16px',
    borderRadius: '4px',
    display: 'inline-block',
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-4">
      <div className="text-center">
        <span style={previewStyle}>
          Sample Subtitle Text
        </span>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        Preview of your subtitle style
      </p>
    </div>
  );
}

export default SubtitlePreview;