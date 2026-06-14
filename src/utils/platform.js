// Helper to detect platform from hostname
export function detectPlatform(hostname) {
  if (!hostname) return 'not supported';
  const host = hostname.toLowerCase();
  if (host.includes('netflix.com')) return 'netflix';
  if (host.includes('disneyplus.com')) return 'disney';
  if (host.includes('hbomax.com')) return 'hbomax';
  if (host.includes('hulu.com')) return 'hulu';
  if (host.includes('primevideo.com')) return 'prime';
  if (host.includes('wetv.vip')) return 'wetv';
  return 'not supported';
}

export default detectPlatform;
