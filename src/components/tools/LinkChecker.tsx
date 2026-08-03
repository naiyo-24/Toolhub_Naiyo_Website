import React, { useState } from 'react';
import { CheckCircle, Loader2, ShieldCheck, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function LinkChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    let submitUrl = url;
    if (!submitUrl.startsWith('http')) {
      submitUrl = 'https://' + submitUrl;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/link/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl })
      });
      if (!response.ok) throw new Error('Failed to check link');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <CheckCircle className="w-8 h-8" />
          Link Checker
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Check Link Safety & Status</label>
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <button 
          onClick={check}
          disabled={isLoading || !url}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Analyze Link'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4">
            <div className={`p-6 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center ${result.is_up ? 'bg-green-100' : 'bg-red-100'}`}>
              {result.is_up ? (
                <Wifi className="w-12 h-12 mb-2 text-green-600" />
              ) : (
                <WifiOff className="w-12 h-12 mb-2 text-red-600" />
              )}
              <h4 className="font-black uppercase text-xl mb-1">Status</h4>
              <p className="font-bold text-gray-700">{result.is_up ? 'Website is UP' : 'Website is DOWN'}</p>
              <div className="mt-2 font-mono bg-black text-white px-3 py-1 rounded-full text-sm">
                Code {result.status_code}
              </div>
            </div>

            <div className={`p-6 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center ${result.is_https ? 'bg-blue-100' : 'bg-yellow-100'}`}>
              {result.is_https ? (
                <ShieldCheck className="w-12 h-12 mb-2 text-blue-600" />
              ) : (
                <ShieldAlert className="w-12 h-12 mb-2 text-yellow-600" />
              )}
              <h4 className="font-black uppercase text-xl mb-1">Security</h4>
              <p className="font-bold text-gray-700">{result.is_https ? 'Secure (HTTPS)' : 'Insecure (HTTP)'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const linkCheckerInstructions = [
  "Enter a URL or domain name to scan.",
  "Click 'Analyze Link' to fetch real-time data.",
  "View the status code, reachability, and HTTPS security layer."
];
