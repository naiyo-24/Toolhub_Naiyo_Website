import React, { useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function BMICalculator() {
  const [weight, setWeight] = useState<number | ''>('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [heightFt, setHeightFt] = useState<number | ''>('');
  const [heightIn, setHeightIn] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    let finalHeightCm = 0;
    
    if (heightUnit === 'cm') {
      if (!heightCm) return;
      finalHeightCm = Number(heightCm);
    } else {
      if (heightFt === '' && heightIn === '') return;
      const ft = Number(heightFt || 0);
      const inches = Number(heightIn || 0);
      finalHeightCm = (ft * 30.48) + (inches * 2.54);
    }

    if (!weight || !finalHeightCm || !age) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/bmi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight_kg: Number(weight),
          height_cm: finalHeightCm,
          age: Number(age)
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate BMI from server.');
      
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
          <Activity className="w-8 h-8" />
          BMI Details
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Weight (kg)</label>
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 70"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-lg font-black uppercase">Height</label>
              <div className="flex gap-2 bg-gray-200 p-1 rounded-lg border-2 border-black">
                <button 
                  onClick={() => setHeightUnit('cm')}
                  className={`px-3 py-1 font-bold text-sm uppercase rounded ${heightUnit === 'cm' ? 'bg-black text-white' : 'hover:bg-gray-300'}`}
                >
                  cm
                </button>
                <button 
                  onClick={() => setHeightUnit('ft')}
                  className={`px-3 py-1 font-bold text-sm uppercase rounded ${heightUnit === 'ft' ? 'bg-black text-white' : 'hover:bg-gray-300'}`}
                >
                  ft/in
                </button>
              </div>
            </div>
            
            {heightUnit === 'cm' ? (
              <input 
                type="number" 
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 175"
                className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
              />
            ) : (
              <div className="flex gap-4">
                <div className="w-1/2 relative">
                  <input 
                    type="number" 
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Feet"
                    className="w-full bg-gray-50 border-4 border-black p-4 pr-12 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">ft</span>
                </div>
                <div className="w-1/2 relative">
                  <input 
                    type="number" 
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Inches"
                    className="w-full bg-gray-50 border-4 border-black p-4 pr-12 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">in</span>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-lg font-black uppercase mb-2">Age</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 25"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !weight || !age || (heightUnit === 'cm' ? !heightCm : (heightFt === '' && heightIn === ''))}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate BMI'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 text-center">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-yellow">Your Result</h4>
            
            <div className="mb-4">
              <span className="text-6xl font-black">{result.bmi}</span>
            </div>
            
            <div className={`inline-block border-4 border-white px-6 py-2 rounded-xl text-xl font-black uppercase ${
              result.category.includes('Underweight') ? 'bg-blue-500' :
              result.category.includes('Normal') ? 'bg-green-500' :
              result.category.includes('Overweight') ? 'bg-orange-500' : 'bg-red-500'
            }`}>
              {result.category}
            </div>
            
            {result.healthy_weight_range && (
              <div className="mt-6 text-sm font-bold opacity-80 uppercase border-t-2 border-white/20 pt-4">
                Healthy Weight Range: {result.healthy_weight_range}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const bmiCalculatorInstructions = [
  "Enter your current weight in kilograms.",
  "Enter your height in centimeters.",
  "Enter your age.",
  "Click 'Calculate BMI' to see your Body Mass Index and healthy weight range."
];
