// Convert a hex color and opacity (0..1) to hex with alpha appended
export function hexWithOpacity(hexColor, opacity) {
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

export default hexWithOpacity;
