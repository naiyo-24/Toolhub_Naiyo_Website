import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fades out after 3.5 seconds as a fallback
    const timer = setTimeout(() => {
      setIsVisible(false);
      window.dispatchEvent(new Event('splashScreenDone'));
    }, 3500); 
    
    // Animate the progress percentage from 0 to 100 over ~3 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment randomly for a more natural loading feel
        return Math.min(prev + Math.floor(Math.random() * 15) + 1, 100);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neo-bg"
        >
          <div className="bg-white border-4 border-black p-4 shadow-[12px_12px_0px_0px_#000] flex flex-col items-center">
            <video 
              src="/assets/animations/splash_screen.mp4" 
              autoPlay 
              muted 
              playsInline
              className="w-64 h-64 object-contain"
              onEnded={() => {
                setIsVisible(false);
                window.dispatchEvent(new Event('splashScreenDone'));
              }}
            />
            <div className="w-full mt-6 bg-gray-200 border-4 border-black h-8 relative overflow-hidden">
              <motion.div 
                className="h-full bg-neo-yellow border-r-4 border-black"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-black text-xl font-['Archivo_Black'] mix-blend-difference text-white">
                LOADING {progress}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
