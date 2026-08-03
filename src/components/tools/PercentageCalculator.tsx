import React, { useState } from 'react';
import { Calculator, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function PercentageCalculator() {
  const [part, setPart] = useState<number | ''>('');
  const [total, setTotal] = useState<number | ''>('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (part === '' || !total) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Backend uses query parameters for this endpoint
      const response = await fetch(`${API_BASE_URL}/daily-utility/percentage?part=${part}&total=${total}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to calculate Percentage from server.');
      
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
          <Calculator className="w-8 h-8" />
          Percentage
        </h3>
        
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="w-full">
            <label className="block text-lg font-black uppercase mb-2">Part Value</label>
            <input 
              type="number" 
              value={part}
              onChange={(e) => setPart(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 50"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all text-center"
            />
          </div>
          <div className="text-4xl font-black mt-6 md:mt-0">/</div>
          <div className="w-full">
            <label className="block text-lg font-black uppercase mb-2">Total Value</label>
            <input 
              type="number" 
              value={total}
              onChange={(e) => setTotal(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 200"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all text-center"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || part === '' || !total}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate %'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 text-center">
            <h4 className="text-2xl font-black uppercase mb-2 text-neo-yellow">Result</h4>
            <div className="text-6xl font-black">{result.percentage}%</div>
            <div className="mt-4 font-bold text-lg opacity-80 uppercase">
              {part} is {result.percentage}% of {total}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const percentageCalculatorInstructions = [
  "Enter the 'Part' value in the first box.",
  "Enter the 'Total' value in the second box.",
  "Click 'Calculate %' to securely compute the exact percentage via the API."
];
