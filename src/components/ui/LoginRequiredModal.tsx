import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader2, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../lib/AuthContext';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
}

export function LoginRequiredModal({ isOpen, onClose, toolName }: LoginRequiredModalProps) {
  const { loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    setIsLoggingIn(true);
    setError(null);
    try {
      if (credentialResponse.credential) {
        await loginWithGoogle(credentialResponse.credential);
        onClose();
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleError = () => {
    setError('Google Login Failed. Please try again.');
  };

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
            className="bg-[#ff4d4d] border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_#000] max-w-md w-full relative p-10 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 z-50 bg-white border-4 border-black w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <X className="w-8 h-8 font-black" />
            </button>

            <div className="bg-white border-4 border-black w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_#000]">
              <Lock className="w-12 h-12 text-black" />
            </div>
            
            <h2 className="text-4xl font-black uppercase mb-6 leading-none tracking-tight text-white">Login Required</h2>
            <p className="font-bold text-xl mb-6 leading-relaxed text-white">
              To use the <br/>
              <span className="inline-block bg-white text-black px-4 py-2 mt-2 mb-2 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
                {toolName}
              </span>
              <br/>
              you need to sign in to securely save your data!
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl flex items-center gap-2 w-full text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            
            {isLoggingIn ? (
              <div className="w-full bg-white text-black border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" /> Logging in...
              </div>
            ) : (
              <div className="w-full flex justify-center mt-2 border-4 border-black p-2 rounded-xl bg-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  text="signup_with"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
