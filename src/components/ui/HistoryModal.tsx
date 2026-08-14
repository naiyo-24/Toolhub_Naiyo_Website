import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
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
            className="bg-[#9333EA] border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_#000] max-w-md w-full relative p-10 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 z-50 bg-white border-4 border-black w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <X className="w-8 h-8 font-black" />
            </button>

            <div className="bg-white border-4 border-black w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_#000]">
              <History className="w-12 h-12 text-black" />
            </div>
            
            <h2 className="text-4xl font-black uppercase mb-6 leading-none tracking-tight text-white">Tool History</h2>
            <p className="font-bold text-xl mb-10 leading-relaxed text-white">
              Saving tool history and data is an <br/>
              <span className="inline-block bg-neo-yellow text-black px-4 py-2 mt-2 mb-2 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
                App Exclusive Feature
              </span>
              <br/>
              Download the mobile app to sync and save all your generated data!
            </p>
            
            <a 
              href="https://play.google.com/store/apps/details?id=com.naiyo24.tool_hub"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="bg-white text-black font-black uppercase text-xl border-4 border-black py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 512 512" fill="currentColor">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              <span>Get the App</span>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
