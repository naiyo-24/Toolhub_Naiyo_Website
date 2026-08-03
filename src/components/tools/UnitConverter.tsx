import React, { useState } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const UNIT_CATEGORIES = {
  Length: ['millimeter', 'centimeter', 'meter', 'kilometer', 'inch', 'foot', 'yard', 'mile', 'nautical_mile'],
  Weight: ['milligram', 'gram', 'kilogram', 'metric_ton', 'ounce', 'pound', 'stone'],
  Temperature: ['celsius', 'fahrenheit', 'kelvin'],
  Area: ['square_meter', 'square_kilometer', 'hectare', 'square_mile', 'acre', 'square_foot', 'square_inch'],
  Volume: ['milliliter', 'liter', 'cubic_meter', 'gallon_us', 'quart_us', 'pint_us', 'cup_us', 'fluid_ounce_us', 'cubic_foot', 'cubic_inch'],
  Speed: ['meter_per_second', 'kilometer_per_hour', 'mile_per_hour', 'knot'],
  Time: ['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
  Data: ['bit', 'byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte']
};

export function UnitConverter() {
  const [category, setCategory] = useState<string>('Length');
  const [value, setValue] = useState<number | ''>('');
  const [fromUnit, setFromUnit] = useState<string>(UNIT_CATEGORIES['Length'][0]);
  const [toUnit, setToUnit] = useState<string>(UNIT_CATEGORIES['Length'][1]);
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    setCategory(newCat);
    setFromUnit(UNIT_CATEGORIES[newCat as keyof typeof UNIT_CATEGORIES][0]);
    setToUnit(UNIT_CATEGORIES[newCat as keyof typeof UNIT_CATEGORIES][1]);
    setResult(null);
  };

  const calculate = async () => {
    if (value === '' || !fromUnit || !toUnit) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/convert/unit?value=${value}&from_unit=${fromUnit}&to_unit=${toUnit}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to convert unit from server.');
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
          <ArrowRightLeft className="w-8 h-8" />
          Unit Conversion
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Category</label>
            <select 
              value={category}
              onChange={handleCategoryChange}
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            >
              {Object.keys(UNIT_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-black uppercase mb-2">From</label>
              <select 
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
              >
                {UNIT_CATEGORIES[category as keyof typeof UNIT_CATEGORIES].map(unit => (
                  <option key={unit} value={unit}>{unit.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-black uppercase mb-2">To</label>
              <select 
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
              >
                {UNIT_CATEGORIES[category as keyof typeof UNIT_CATEGORIES].map(unit => (
                  <option key={unit} value={unit}>{unit.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-lg font-black uppercase mb-2">Value</label>
            <input 
              type="number" 
              value={value}
              onChange={(e) => setValue(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 100"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || value === '' || !fromUnit || !toUnit}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Convert Unit'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 text-center">
            <h4 className="text-2xl font-black uppercase mb-2 text-neo-yellow">Result</h4>
            <div className="text-4xl md:text-5xl font-black truncate">{result.converted_value}</div>
            <div className="mt-4 font-bold text-lg opacity-80 uppercase">
              {result.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const unitConverterInstructions = [
  "Select the type of unit you want to convert (Length, Weight, etc.).",
  "Choose the starting unit (From) and the target unit (To).",
  "Enter the value you want to convert.",
  "Click 'Convert Unit' to fetch the exact conversion from the backend API."
];
