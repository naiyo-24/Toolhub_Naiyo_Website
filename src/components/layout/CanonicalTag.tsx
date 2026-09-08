import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CanonicalTag = () => {
  const location = useLocation();

  useEffect(() => {
    // We want the base URL to be exactly what we want indexed, e.g. https://toolhubutility.com
    const baseUrl = 'https://toolhubutility.com';
    // Clean up trailing slash from pathname if it exists and it's not exactly "/"
    const path = location.pathname.endsWith('/') && location.pathname !== '/'
      ? location.pathname.slice(0, -1)
      : location.pathname;
    const canonicalUrl = `${baseUrl}${path}`;

    // Look for existing canonical tag
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");

    if (!link) {
      // If it doesn't exist, create it
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    // Set the href to our dynamic canonical URL
    link.setAttribute('href', canonicalUrl);
  }, [location.pathname]);

  return null;
};

export default CanonicalTag;
