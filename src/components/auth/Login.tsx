import React, { useState } from 'react';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../lib/AuthContext';

export function Login({ message = "Please log in to continue" }: { message?: string }) {
  const { loginWithGoogle, isLoading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    setIsLoggingIn(true);
    setError(null);
    try {
      if (credentialResponse.credential) {
        await loginWithGoogle(credentialResponse.credential);
      } else {
        throw new Error("No credential received from Google.");
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleError = () => {
    setError('Google Login Failed. Please try again.');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-12 h-12 animate-spin text-neo-pink" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000] w-full flex flex-col items-center text-center">
        <div className="bg-neo-yellow border-4 border-black p-4 rounded-full mb-6">
          <LogIn className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-black uppercase mb-4">Login Required</h2>
        <p className="font-bold text-gray-600 mb-8">
          {message}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl flex items-center gap-2 w-full">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {isLoggingIn ? (
          <div className="w-full bg-neo-pink text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" /> Logging in...
          </div>
        ) : (
          <div className="w-full flex justify-center mt-2 border-4 border-black p-2 rounded-xl bg-gray-50 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="filled_black"
              shape="pill"
            />
          </div>
        )}
      </div>
    </div>
  );
}
