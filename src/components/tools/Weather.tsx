import React, { useState } from 'react';
import { Thermometer, Loader2, Cloud, Wind, MapPin, Clock } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function Weather() {
  const [location, setLocation] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkWeather = async () => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/travel-tools/weather`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to fetch weather. Please try a different location.');
      }
      
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
          <Thermometer className="w-8 h-8" />
          Check Weather
        </h3>
        
        <div className="space-y-4 mb-6">
          <label className="block text-lg font-black uppercase">Enter Location</label>
          <input 
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkWeather()}
            placeholder="e.g. Paris, France"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <button 
          onClick={checkWeather}
          disabled={isLoading || !location.trim()}
          className="w-full bg-neo-blue text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Get Weather'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] relative animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-6 text-neo-blue">Current Weather</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 border-2 border-gray-600 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-sm">
                  <MapPin className="w-4 h-4" /> Location
                </div>
                <div className="text-xl font-black">{result.Location}</div>
              </div>
              
              <div className="bg-gray-800 border-2 border-gray-600 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-sm">
                  <Thermometer className="w-4 h-4" /> Temperature
                </div>
                <div className="text-2xl font-black text-neo-yellow">{result.Temperature}</div>
              </div>
              
              <div className="bg-gray-800 border-2 border-gray-600 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-sm">
                  <Wind className="w-4 h-4" /> Wind Speed
                </div>
                <div className="text-xl font-black">{result.Windspeed}</div>
              </div>
              
              <div className="bg-gray-800 border-2 border-gray-600 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-sm">
                  <Clock className="w-4 h-4" /> Time
                </div>
                <div className="text-xl font-black">{result.Time}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
