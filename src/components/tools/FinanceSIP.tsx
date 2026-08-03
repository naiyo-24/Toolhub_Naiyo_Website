import React, { useState } from 'react';
import { Calculator, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function FinanceSIP() {
  const [monthly_investment, set_monthly_investment] = useState<string>('');
  const [expected_annual_return, set_expected_annual_return] = useState<string>('');
  const [time_period_years, set_time_period_years] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (!monthly_investment || !expected_annual_return || !time_period_years) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/finance-tools/sip-calculator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_investment: Number(monthly_investment),
          expected_annual_return: Number(expected_annual_return),
          time_period_years: Number(time_period_years)
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate. Please check inputs.');
      
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
          SIP Calculator
        </h3>
        
        <div className="space-y-4 mb-6">

          <div>
            <label className="block text-lg font-black uppercase mb-2">Monthly Investment (₹)</label>
            <input 
              type="number" 
              value={monthly_investment}
              onChange={(e) => set_monthly_investment(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">Expected Annual Return (%)</label>
            <input 
              type="number" 
              value={expected_annual_return}
              onChange={(e) => set_expected_annual_return(e.target.value)}
              placeholder="e.g. 12"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">Time Period (Years)</label>
            <input 
              type="number" 
              value={time_period_years}
              onChange={(e) => set_time_period_years(e.target.value)}
              placeholder="e.g. 10"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !monthly_investment || !expected_annual_return || !time_period_years}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-yellow">Calculation Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result).map(([key, value]) => (
                <div key={key} className="bg-gray-900 border-2 border-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm font-bold uppercase mb-1">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xl font-black text-white break-words">
                    {typeof value === 'number' ? value.toLocaleString() : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
