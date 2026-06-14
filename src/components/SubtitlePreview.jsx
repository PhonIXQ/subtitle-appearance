import React from 'react';
import hexWithOpacity from '../utils/color';

function SubtitlePreview({ settings }) {
  const previewStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    color: settings.textColor,
    backgroundColor: hexWithOpacity(settings.backgroundColor, settings.backgroundOpacity),
    textShadow: settings.textShadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
    fontWeight: settings.fontWeight,
    textAlign: settings.textAlign,
    padding: '8px 16px',
    borderRadius: '4px',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    lineHeight: '60px',
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-4">
      <div className="text-center">
        <span style={previewStyle}>Subtitle Text</span>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">Preview of your subtitle style</p>
    </div>
  );
}

export default SubtitlePreview;
