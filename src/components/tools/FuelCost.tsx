import React, { useState } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function FuelCost() {
  const [distance, setDistance] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');

  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (!distance || !efficiency || !fuelPrice) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/travel-tools/fuel-cost-calc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distance: Number(distance),
          efficiency: Number(efficiency),
          fuel_price: Number(fuelPrice)
        }),
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
          <DollarSign className="w-8 h-8" />
          Fuel Cost Calculator
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Distance</label>
            <input 
              type="number" 
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="e.g. 250 (km or miles)"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">Fuel Efficiency</label>
            <input 
              type="number" 
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              placeholder="e.g. 15 (km/l or mpg)"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">Fuel Price</label>
            <input 
              type="number" 
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              placeholder="Price per unit of fuel"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !distance || !efficiency || !fuelPrice}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate Cost'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-yellow">Calculation Result</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm font-bold uppercase mb-1">Fuel Needed</div>
                <div className="text-2xl font-black text-white">{result.fuel_needed} units</div>
              </div>
              <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm font-bold uppercase mb-1">Total Cost</div>
                <div className="text-2xl font-black text-neo-yellow">{result.total_cost.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
