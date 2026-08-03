import React, { useState } from 'react';
import { Binary, Loader2, ArrowRightLeft } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function NumberBaseConverter() {
  const [value, setValue] = useState<string>('');
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(2);
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swapBases = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setResult(null);
  };

  const calculate = async () => {
    if (!value || !fromBase || !toBase) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/convert/bindec`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: value,
          from_base: fromBase,
          to_base: toBase
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to convert number base.');
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
          <Binary className="w-8 h-8" />
          Base Converter
        </h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full">
              <label className="block text-lg font-black uppercase mb-2">From Base</label>
              <select 
                value={fromBase}
                onChange={(e) => setFromBase(Number(e.target.value))}
                className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
              >
                <option value={2}>Binary (Base 2)</option>
                <option value={8}>Octal (Base 8)</option>
                <option value={10}>Decimal (Base 10)</option>
                <option value={16}>Hexadecimal (Base 16)</option>
              </select>
            </div>
            
            <button 
              onClick={swapBases}
              className="mt-8 bg-black text-white border-4 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform"
              title="Swap Bases"
            >
              <ArrowRightLeft className="w-6 h-6" />
            </button>
            
            <div className="w-full">
              <label className="block text-lg font-black uppercase mb-2">To Base</label>
              <select 
                value={toBase}
                onChange={(e) => setToBase(Number(e.target.value))}
                className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
              >
                <option value={2}>Binary (Base 2)</option>
                <option value={8}>Octal (Base 8)</option>
                <option value={10}>Decimal (Base 10)</option>
                <option value={16}>Hexadecimal (Base 16)</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-lg font-black uppercase mb-2">Value to Convert</label>
            <input 
              type="text" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={fromBase === 2 ? "e.g. 101010" : fromBase === 16 ? "e.g. 1A3F" : "e.g. 256"}
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all font-mono"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !value || !fromBase || !toBase}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Convert Base'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 text-center">
            <h4 className="text-2xl font-black uppercase mb-2 text-neo-yellow">Converted Result</h4>
            <div className="text-3xl md:text-5xl font-black truncate font-mono text-green-400 p-4 bg-white/10 rounded-xl border-2 border-white/20">
              {result.converted_value.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const numberBaseConverterInstructions = [
  "Select the starting number base (e.g., Decimal).",
  "Select the target number base (e.g., Binary or Hexadecimal).",
  "Enter the value to convert.",
  "Click 'Convert Base' to perform the conversion securely via the API."
];
