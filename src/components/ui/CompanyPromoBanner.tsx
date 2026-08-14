import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const PROMOS = [
  {
    name: 'Caby24',
    url: 'https://play.google.com/store/apps/details?id=com.bhukk.parcelcustomer',
    desc: 'Fast, reliable ride-hailing and parcel delivery on Android!',
    color: 'bg-neo-blue',
    logo: '/assets/logos/caby24_logo.png'
  },
  {
    name: 'AttendX24',
    url: 'https://play.google.com/store/apps/details?id=com.attendx24',
    desc: 'The ultimate attendance tracking & management app for your business.',
    color: 'bg-neo-green',
    logo: '/assets/logos/attendx24_logo.png'
  },
  {
    name: 'ToolHub App',
    url: 'https://play.google.com/store/apps/details?id=com.naiyo24.tool_hub&pcampaignid=web_share',
    desc: 'Unlock 150+ Offline Tools & OCR Scanners on Android!',
    color: 'bg-neo-pink',
    logo: '/assets/logos/toolhub_logo.png'
  }
];

interface CompanyPromoBannerProps {
  className?: string;
}

export function CompanyPromoBanner({ className = '' }: CompanyPromoBannerProps) {
  const [currentPromo, setCurrentPromo] = useState(PROMOS[0]);

  useEffect(() => {
    // Select random promo, ensuring it's different from the last one seen
    const lastIndex = sessionStorage.getItem('lastCompanyPromoIndex');
    let newIndex = Math.floor(Math.random() * PROMOS.length);
    
    if (lastIndex !== null && PROMOS.length > 1) {
      while (newIndex === parseInt(lastIndex, 10)) {
        newIndex = Math.floor(Math.random() * PROMOS.length);
      }
    }
    
    sessionStorage.setItem('lastCompanyPromoIndex', newIndex.toString());
    setCurrentPromo(PROMOS[newIndex]);
  }, []);

  return (
    <div className={`container mx-auto px-4 max-w-6xl my-12 ${className}`}>
      <div 
        onClick={() => window.open(currentPromo.url, '_blank')}
        className={`w-full ${currentPromo.color} border-4 border-black rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between shadow-[8px_8px_0px_0px_#000] text-black gap-4 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000] transition-all cursor-pointer`}
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-white border-4 border-black p-2 md:p-3 shadow-[4px_4px_0px_0px_#000] rounded-xl shrink-0 flex items-center justify-center">
            <img src={currentPromo.logo} alt={`${currentPromo.name} logo`} className="w-8 h-8 md:w-12 md:h-12 object-contain" />
          </div>
          <div>
            <span className="inline-block bg-white border-2 border-black rounded-md font-black px-2 py-0.5 text-[10px] uppercase mb-1 shadow-[2px_2px_0px_0px_#000]">
              Sponsored by Naiyo24
            </span>
            <h3 className="font-black text-xl md:text-3xl uppercase leading-tight">Get {currentPromo.name}</h3>
            <p className="font-bold text-sm md:text-base text-black/80">{currentPromo.desc}</p>
          </div>
        </div>
        <button className="shrink-0 flex items-center justify-center gap-2 bg-white text-black font-black uppercase text-sm md:text-base border-4 border-black px-8 py-4 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all w-full md:w-auto">
          Download <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
