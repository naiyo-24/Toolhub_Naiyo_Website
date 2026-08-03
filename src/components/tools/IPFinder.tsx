import React, { useState } from 'react';
import { Globe, Loader2, MapPin, Navigation } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function IPFinder() {
  const [ip, setIp] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = ip 
        ? `${API_BASE_URL}/internet-tools/ip/lookup?ip=${ip}`
        : `${API_BASE_URL}/internet-tools/ip/lookup`;
        
      const response = await fetch(endpoint, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to lookup IP');
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
          <Globe className="w-8 h-8" />
          IP Lookup
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">IP Address (Optional)</label>
          <input 
            type="text" 
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Leave empty for your IP"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all font-mono"
          />
        </div>

        <button 
          onClick={lookup}
          disabled={isLoading}
          className="w-full bg-neo-blue text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Find Location'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            {result.message ? (
              <div className="text-red-400 font-bold text-lg">{result.message}</div>
            ) : (
              <>
                <h4 className="text-2xl font-black uppercase mb-6 text-neo-blue flex items-center gap-3">
                  <MapPin className="w-8 h-8" />
                  {result.ip}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 border-2 border-white/20 rounded-xl">
                    <span className="block text-sm font-bold text-gray-400 uppercase mb-1">Country</span>
                    <span className="text-xl font-black">{result.country}</span>
                  </div>
                  <div className="bg-white/10 p-4 border-2 border-white/20 rounded-xl">
                    <span className="block text-sm font-bold text-gray-400 uppercase mb-1">City</span>
                    <span className="text-xl font-black">{result.city}</span>
                  </div>
                  <div className="bg-white/10 p-4 border-2 border-white/20 rounded-xl sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="block text-sm font-bold text-gray-400 uppercase mb-1">Coordinates</span>
                      <span className="text-lg font-mono font-bold text-neo-blue">
                        {result.latitude}, {result.longitude}
                      </span>
                    </div>
                    <Navigation className="w-8 h-8 opacity-50" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const ipFinderInstructions = [
  "Enter an IP address to find its geographical location.",
  "If you leave it blank, the tool will automatically detect and locate your own public IP address.",
  "Click 'Find Location' to view the Country, City, and GPS Coordinates."
];
