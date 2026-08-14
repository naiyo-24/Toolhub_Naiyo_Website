import React, { useEffect, useRef } from 'react';

// Extend the Window interface to recognize adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseBannerProps {
  client?: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSenseBanner({
  client = 'ca-pub-XXXXXXXXXXXXXXXX', // Placeholder client ID
  slot,
  format = 'auto',
  responsive = true,
  style,
  className = ''
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only push the ad if it hasn't been loaded yet and we're in the browser
    if (typeof window !== 'undefined' && !isLoaded.current) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isLoaded.current = true;
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  return (
    <div className={`relative w-full overflow-hidden flex justify-center items-center bg-gray-100 border-4 border-dashed border-gray-300 rounded-xl p-2 min-h-[90px] ${className}`}>
      {/* Dev placeholder for when ads are blocked or offline before timeout fires */}
      <div className="absolute text-gray-400 font-bold uppercase text-xs tracking-widest z-0">
        Advertisement
      </div>
      
      <ins
        ref={adRef}
        className="adsbygoogle relative z-10 w-full"
        style={{ display: 'block', ...style }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
