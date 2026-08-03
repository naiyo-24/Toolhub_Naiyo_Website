import React, { useState } from 'react';
import { Map, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function DistanceCalculator() {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (!origin || !destination) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/travel-tools/distance-calc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to calculate. Please check inputs.');
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
          <Map className="w-8 h-8" />
          Distance Calculator
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Origin</label>
            <input 
              type="text" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. New York, USA"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">Destination</label>
            <input 
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. London, UK"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !origin || !destination}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate Distance'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-yellow">Calculation Result</h4>
            
            <div className="flex flex-col gap-4">
              <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded-lg flex flex-col gap-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="text-gray-400 font-bold uppercase">From:</div>
                  <div className="font-black text-lg text-right">{result.origin}</div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="text-gray-400 font-bold uppercase">To:</div>
                  <div className="font-black text-lg text-right">{result.destination}</div>
                </div>
              </div>
              
              <div className="bg-neo-yellow text-black border-2 border-black p-4 rounded-lg text-center">
                <div className="text-sm font-bold uppercase mb-1">Direct Distance (As the crow flies)</div>
                <div className="text-3xl font-black">{result.flight_distance_km} km</div>
                <div className="text-xl font-bold">{(result.flight_distance_km * 0.621371).toFixed(1)} miles</div>
              </div>

              {result.driving_distance_km && (
                <div className="bg-neo-blue text-white border-2 border-black p-4 rounded-lg text-center">
                  <div className="text-sm font-bold uppercase mb-1">Driving Distance (Approximate)</div>
                  <div className="text-3xl font-black">{result.driving_distance_km} km</div>
                  <div className="text-xl font-bold">{(result.driving_distance_km * 0.621371).toFixed(1)} miles</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
