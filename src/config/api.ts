const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL = (import.meta as any).env?.DEV ? '' : `http://${hostname}:8000`;
export const formatFileUrl = (url: string) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    // Replace internal IPs or localhost with the API_BASE_URL
    if (urlObj.hostname === '10.10.14.4' || urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1' || urlObj.hostname.startsWith('192.168.')) {
      return `${API_BASE_URL}${urlObj.pathname}${urlObj.search}`;
    }
  } catch (e) {
    if (url.startsWith('/')) {
      return `${API_BASE_URL}${url}`;
    }
  }
  return url;
};
