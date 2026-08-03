import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Apple, Download as DownloadIcon, Smartphone } from 'lucide-react';

export default function DownloadPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-neo-bg pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-8 border-black rounded-3xl p-8 md:p-16 shadow-[16px_16px_0px_0px_#000] text-center"
        >
          <div className="inline-block bg-neo-cyan text-black px-6 py-2 border-4 border-black font-black text-xl mb-6 shadow-[4px_4px_0px_0px_#000] -rotate-2">
            GET THE APP
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-tight tracking-tighter">
            Download ToolHub
          </h1>
          
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mb-12">
            Take 150+ powerful utilities wherever you go. Available now on Android, with iOS coming soon.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="#"
              className="flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer drop-shadow-md hover:drop-shadow-xl"
            >
              <img src="/assets/images/play.png" alt="Get it on Google Play" className="h-[75px] md:h-[90px] w-auto object-contain" />
            </a>

            <a 
              href="#"
              className="flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer drop-shadow-md hover:drop-shadow-xl"
            >
              <img src="/assets/images/app.png" alt="Download on the App Store" className="h-[50px] md:h-[60px] w-auto object-contain" />
            </a>
          </div>

          <div className="mt-16 pt-12 border-t-4 border-black border-dashed">
            <h3 className="text-2xl font-black uppercase mb-4">Direct APK Download</h3>
            <p className="font-bold mb-6">Need the raw APK file? You can download it directly from our servers.</p>
            <a 
              href="#"
              className="inline-flex items-center gap-2 bg-neo-yellow text-black font-black uppercase px-6 py-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              <DownloadIcon className="w-5 h-5" /> Download APK (v1.0.0)
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
