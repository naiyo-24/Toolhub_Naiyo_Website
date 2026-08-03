import React, { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = async () => {
    if (!birthDate) return;
    
    setIsLoading(true);
    setError(null);
    setAge(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/age`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birth_date: birthDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate age. Please check the date.');
      }

      const data = await response.json();
      setAge({
        years: data.years,
        months: data.months,
        days: data.days
      });
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
          <Calendar className="w-8 h-8" />
          Select Birth Date
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input 
            type="date" 
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="flex-1 bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          />
          <button 
            onClick={calculateAge}
            disabled={isLoading || !birthDate}
            className="bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {age && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-yellow">Your Exact Age</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-4xl md:text-5xl font-black mb-1">{age.years}</div>
                <div className="font-bold uppercase text-sm opacity-80">Years</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-4xl md:text-5xl font-black mb-1">{age.months}</div>
                <div className="font-bold uppercase text-sm opacity-80">Months</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-4xl md:text-5xl font-black mb-1">{age.days}</div>
                <div className="font-bold uppercase text-sm opacity-80">Days</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const ageCalculatorInstructions = [
  "Click on the date input field to open the calendar picker.",
  "Select your date of birth (Year, Month, and Day).",
  "Click the 'Calculate' button.",
  "Your exact age in Years, Months, and Days will be fetched directly from the backend server."
];
