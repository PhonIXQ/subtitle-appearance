// Helper to produce a responsive font-size clamp
export function getFontSizeClamp(fontSize) {
  const cqw = (fontSize / 56) * 3.4;

  return `clamp(4px, ${cqw}cqw, ${fontSize}px)`;
}

export default getFontSizeClamp;
