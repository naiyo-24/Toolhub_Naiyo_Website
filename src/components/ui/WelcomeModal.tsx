import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, WifiOff, LayoutGrid, Star, ArrowRight } from 'lucide-react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSplashDone = () => {
      // slight delay after splash fades out for a smooth transition
      setTimeout(() => setIsOpen(true), 300); 
    };
    
    window.addEventListener('splashScreenDone', handleSplashDone);
    
    // Fallback timer just in case the event is missed
    const fallbackTimer = setTimeout(() => setIsOpen(true), 4000);

    return () => {
      window.removeEventListener('splashScreenDone', handleSplashDone);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            {/* Modal Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border-[6px] border-black rounded-[2rem] shadow-[16px_16px_0px_0px_#000] max-w-5xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col lg:flex-row items-center lg:items-stretch"
            >
              {/* Close Button - Always positioned top right of the modal */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50 bg-white border-4 border-black w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0px_0px_#000]"
              >
                <X className="w-8 h-8 font-black" />
              </button>

              {/* LEFT COLUMN: Content (Visible on all devices) */}
              <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                
                {/* Logo Area */}
                <div className="flex items-center gap-4 mb-8">
                  <img 
                    src="/assets/logos/toolhub_logo.png" 
                    alt="ToolHub Logo" 
                    className="h-16 sm:h-20 w-auto object-contain" 
                  />
                  <div className="font-black text-3xl sm:text-4xl uppercase leading-tight tracking-tight text-black">
                    TOOL<br/>
                    HUB
                  </div>
                </div>

                {/* Main Headline */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tighter mb-4">
                  ALL YOUR TOOLS,<br/>IN <span className="text-neo-purple">ONE PLACE.</span>
                </h2>
                
                <p className="font-bold text-gray-600 text-lg sm:text-xl mb-8">
                  Simplify. Save Time. Get More Done.
                </p>

                {/* Features List */}
                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="bg-neo-purple border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_#000] shrink-0">
                      <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl leading-tight">150+ Powerful Tools</h4>
                      <p className="text-sm font-bold text-gray-600">From daily utilities to AI, PDF, Business and more.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-neo-yellow border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_#000] shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl leading-tight">Fast & Easy</h4>
                      <p className="text-sm font-bold text-gray-600">Built for speed, simple to use, always reliable.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-neo-pink border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_#000] shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl leading-tight">Secure & Private</h4>
                      <p className="text-sm font-bold text-gray-600">Your data is safe with us. 100% trustworthy.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-neo-blue border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_#000] shrink-0">
                      <WifiOff className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl leading-tight">Works Offline</h4>
                      <p className="text-sm font-bold text-gray-600">Most tools work without internet. Anytime, anywhere.</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a 
                  href="#" 
                  className="bg-neo-purple text-white font-black uppercase text-xl sm:text-2xl border-4 border-black py-4 px-6 sm:px-8 rounded-2xl shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all flex items-center justify-between w-full max-w-md mb-8 gap-4"
                >
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <svg className="w-8 h-8 shrink-0" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                    </svg>
                    <span className="text-lg sm:text-xl md:text-2xl">GET IT ON PLAY STORE</span>
                  </div>
                  <ArrowRight className="w-8 h-8 shrink-0" />
                </a>

                {/* Footer Reviews */}
                <div className="flex items-center gap-4 border-t-4 border-black pt-6">
                  <div className="flex -space-x-3">
                    <img className="w-10 h-10 rounded-full border-2 border-black bg-blue-200" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                    <img className="w-10 h-10 rounded-full border-2 border-black bg-green-200" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jude" alt="User" />
                    <img className="w-10 h-10 rounded-full border-2 border-black bg-yellow-200" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="User" />
                    <img className="w-10 h-10 rounded-full border-2 border-black bg-red-200" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" alt="User" />
                  </div>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-neo-yellow text-neo-yellow border-black" />)}
                    </div>
                    <p className="text-xs font-black uppercase text-gray-600">50K+ Happy Users</p>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Visuals (Hidden on mobile, visible on lg screens) */}
              <div className="hidden lg:flex w-1/2 bg-gray-50 border-l-[6px] border-black p-12 relative items-center justify-center overflow-hidden rounded-r-[1.5rem]">
                
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neo-purple rounded-full z-0"></div>
                
                {/* Yellow Sparkle */}
                <svg className="absolute top-12 right-24 w-12 h-12 text-neo-yellow z-10 drop-shadow-[2px_2px_0px_#000]" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="2">
                  <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                </svg>

                {/* Pink Plus */}
                <svg className="absolute bottom-24 right-8 w-10 h-10 text-neo-pink z-10 drop-shadow-[2px_2px_0px_#000]" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="3">
                  <path d="M12 5V19M5 12H19" strokeLinecap="round" />
                </svg>
                
                {/* Phone Mockup Frame */}
                <div className="relative z-10 w-[300px] h-[600px] bg-[#f8f9fa] border-8 border-black rounded-[3rem] shadow-[16px_16px_0px_0px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden pt-10">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-50 shadow-sm"></div>
                  
                  {/* The actual screenshot */}
                  <img 
                    src="/assets/images/1.jpeg" 
                    alt="App Screenshot" 
                    className="w-full h-full object-cover rounded-b-[2.5rem]"
                  />
                </div>

                {/* Bottom Badge */}
                <div className="absolute bottom-8 right-8 z-20">
                  <img src="/assets/images/play.png" alt="Get it on Google Play" className="h-[60px] object-contain drop-shadow-[4px_4px_0px_#000]" />
                </div>
              </div>
              
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
