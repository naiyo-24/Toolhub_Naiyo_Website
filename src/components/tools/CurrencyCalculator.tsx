import React, { useState } from 'react';
import { DollarSign, Loader2, ArrowRightLeft } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const COMMON_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD',
  'SEK', 'KRW', 'SGD', 'NOK', 'MXN', 'INR', 'RUB', 'ZAR', 'TRY', 'BRL'
];

export function CurrencyCalculator() {
  const [amount, setAmount] = useState<number | ''>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('INR');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const calculate = async () => {
    if (!amount || !fromCurrency || !toCurrency) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/convert/currency?amount=${amount}&from_currency=${fromCurrency}&to_currency=${toCurrency}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to convert currency.');
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
          Live Currency Exchange
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Amount</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 100"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full">
              <label className="block text-lg font-black uppercase mb-2">From</label>
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
              >
                {COMMON_CURRENCIES.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={swapCurrencies}
              className="mt-8 bg-black text-white border-4 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform"
              title="Swap Currencies"
            >
              <ArrowRightLeft className="w-6 h-6" />
            </button>
            
            <div className="w-full">
              <label className="block text-lg font-black uppercase mb-2">To</label>
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
              >
                {COMMON_CURRENCIES.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !amount || !fromCurrency || !toCurrency}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Convert Currency'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 text-center">
            <h4 className="text-2xl font-black uppercase mb-2 text-neo-yellow">Exchange Result</h4>
            <div className="text-4xl md:text-5xl font-black truncate text-green-400">
              {result.converted_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-3xl">{toCurrency}</span>
            </div>
            <div className="mt-4 font-bold text-lg opacity-80 uppercase text-white">
              {amount} {fromCurrency} = {result.converted_amount} {toCurrency}
            </div>
            <div className="mt-4 text-xs font-bold opacity-60">
              Live market rates fetched securely via API.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const currencyCalculatorInstructions = [
  "Enter the amount of money you want to exchange.",
  "Select the source currency (e.g., USD).",
  "Select the target currency (e.g., INR).",
  "Click 'Convert Currency' to fetch live market rates securely from the backend API."
];
