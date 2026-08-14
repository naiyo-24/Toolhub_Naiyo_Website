import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle } from 'lucide-react';

interface AppPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppPromoModal({ isOpen, onClose }: AppPromoModalProps) {
  const features = [
    "Crop & Color Filters",
    "Eraser Tool",
    "Add Signatures",
    "Add Watermarks",
    "Add Text & Highlights",
    "Advanced Rotation"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-neo-yellow border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_#000] max-w-md w-full relative p-8 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 bg-white border-4 border-black w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <X className="w-6 h-6 font-black" />
            </button>

            <div className="bg-white border-4 border-black w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_#000]">
              <Star className="w-10 h-10 text-black" fill="currentColor" />
            </div>
            
            <h2 className="text-3xl font-black uppercase mb-4 leading-none tracking-tight">Unlock More Features!</h2>
            <p className="font-bold text-gray-800 mb-6">
              Install the ToolHub app to access advanced PDF editing tools on the go!
            </p>

            <div className="bg-white border-4 border-black rounded-xl p-4 mb-6 text-left shadow-[4px_4px_0px_0px_#000]">
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle className="w-5 h-5 text-neo-green shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <a 
              href="https://play.google.com/store/apps/details?id=com.naiyo24.tool_hub"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="inline-block hover:scale-105 hover:-translate-y-1 transition-transform"
            >
              <img src="/assets/images/play.png" alt="Get the App" className="h-20 mx-auto object-contain" />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
