import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
}

export function ComingSoonModal({ isOpen, onClose, toolName }: ComingSoonModalProps) {
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
            className="bg-neo-yellow border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_#000] max-w-md w-full relative p-10 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 z-50 bg-white border-4 border-black w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <X className="w-8 h-8 font-black" />
            </button>

            <div className="bg-white border-4 border-black w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_#000]">
              <Clock className="w-12 h-12 text-black" />
            </div>
            
            <h2 className="text-4xl font-black uppercase mb-6 leading-none tracking-tight">Coming Soon!</h2>
            <p className="font-bold text-xl mb-10 leading-relaxed">
              We are working hard to bring you <br/>
              <span className="inline-block bg-white px-4 py-2 mt-2 mb-2 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
                {toolName}
              </span>
              <br/>
              Check back in a future update!
            </p>
            
            <button 
              onClick={onClose}
              className="bg-white text-black font-black uppercase text-xl border-4 border-black py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all w-full"
            >
              Awesome
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
