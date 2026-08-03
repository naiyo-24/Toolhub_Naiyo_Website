import React, { useState } from 'react';
import { Calculator, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function GSTCalculator() {
  const [amount, setAmount] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (!amount || !rate) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/gst`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          gst_rate: Number(rate),
          is_inclusive: isInclusive
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate GST from server.');
      
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
          GST Details
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Original Amount (₹)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 1000"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">GST Rate (%)</label>
            <select 
              value={rate}
              onChange={(e) => setRate(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            >
              <option value="" disabled>Select Rate</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-lg">
              <input 
                type="checkbox" 
                checked={isInclusive}
                onChange={(e) => setIsInclusive(e.target.checked)}
                className="w-6 h-6 border-4 border-black rounded shadow-[2px_2px_0px_0px_#000] accent-neo-blue"
              />
              Amount is GST Inclusive?
            </label>
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !amount || !rate}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate GST'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-yellow">Calculation Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-2xl font-black mb-1">₹{result.original_amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                <div className="font-bold uppercase text-xs opacity-80">Net Amount</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-2xl font-black mb-1">₹{result.gst_amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                <div className="font-bold uppercase text-xs opacity-80">GST Amount ({result.gst_rate}%)</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20 md:col-span-2">
                <div className="text-4xl font-black mb-1 text-neo-yellow">₹{result.final_amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                <div className="font-bold uppercase text-xs opacity-80">Final Amount</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t-2 border-white/20 flex justify-between text-sm font-bold opacity-80 uppercase">
              <span>CGST: ₹{result.cgst_amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              <span>SGST: ₹{result.sgst_amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const gstCalculatorInstructions = [
  "Enter the original amount of the product or service.",
  "Select the applicable GST slab rate from the dropdown (5%, 12%, 18%, 28%).",
  "Check the box if your entered amount already includes the GST.",
  "Click 'Calculate GST' to fetch the breakdown (including CGST & SGST) from the server."
];
