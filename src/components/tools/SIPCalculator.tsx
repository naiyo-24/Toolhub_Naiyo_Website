import React, { useState } from 'react';
import { Calculator, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function SIPCalculator() {
  const [monthly, setMonthly] = useState<number | ''>('');
  const [returnRate, setReturnRate] = useState<number | ''>('');
  const [tenure, setTenure] = useState<number | ''>('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (!monthly || !returnRate || !tenure) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/sip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_investment: Number(monthly),
          expected_annual_return: Number(returnRate),
          tenure_years: Number(tenure)
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate SIP from server.');
      
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
          SIP Details
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Monthly Investment (₹)</label>
            <input 
              type="number" 
              value={monthly}
              onChange={(e) => setMonthly(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 5000"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">Expected Return Rate (% p.a)</label>
            <input 
              type="number" 
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 12"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">Time Period (Years)</label>
            <input 
              type="number" 
              value={tenure}
              onChange={(e) => setTenure(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 10"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !monthly || !returnRate || !tenure}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate Returns'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-yellow">Wealth Projection</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-2xl font-black mb-1">₹{result.invested_amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                <div className="font-bold uppercase text-xs opacity-80">Invested Amount</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-2xl font-black mb-1 text-green-400">₹{result.estimated_returns?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                <div className="font-bold uppercase text-xs opacity-80">Est. Returns</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-2xl font-black mb-1 text-neo-yellow">₹{result.total_value?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                <div className="font-bold uppercase text-xs opacity-80">Total Value</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const sipCalculatorInstructions = [
  "Enter the amount you plan to invest every month.",
  "Enter the annual return percentage you expect (e.g., 12%).",
  "Enter the number of years you plan to stay invested.",
  "Click 'Calculate Returns' to securely fetch your wealth projection from the backend."
];
