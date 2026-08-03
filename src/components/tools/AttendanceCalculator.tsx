import React, { useState } from 'react';
import { Calculator, RefreshCw, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function AttendanceCalculator() {
  const [formData, setFormData] = useState({
    total_classes: '',
    classes_attended: '',
    target_percentage: '75'
  });
  
  interface AttendanceResult {
    current_percentage: number;
    status: string;
    message: string;
  }
  
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = async () => {
    if (!formData.total_classes || !formData.classes_attended || !formData.target_percentage) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/student-toolkit/attendance-calculator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total_classes: parseInt(formData.total_classes),
          classes_attended: parseInt(formData.classes_attended),
          target_percentage: parseFloat(formData.target_percentage),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to calculate attendance');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while calculating.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFormData({
      total_classes: '',
      classes_attended: '',
      target_percentage: '75'
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#9333EA] p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Attendance Calculator</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="font-black uppercase text-sm block mb-2">Total Classes Held</label>
            <input
              type="number"
              name="total_classes"
              value={formData.total_classes}
              onChange={handleInputChange}
              min="0"
              placeholder="e.g. 40"
              className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#9333EA]/50 transition-all"
            />
          </div>
          <div>
            <label className="font-black uppercase text-sm block mb-2">Classes Attended</label>
            <input
              type="number"
              name="classes_attended"
              value={formData.classes_attended}
              onChange={handleInputChange}
              min="0"
              placeholder="e.g. 25"
              className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#9333EA]/50 transition-all"
            />
          </div>
          <div>
            <label className="font-black uppercase text-sm block mb-2">Target Percentage (%)</label>
            <input
              type="number"
              name="target_percentage"
              value={formData.target_percentage}
              onChange={handleInputChange}
              step="1"
              min="1"
              max="100"
              placeholder="e.g. 75"
              className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#9333EA]/50 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
            {error}
          </div>
        )}

        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="w-full bg-[#9333EA] hover:bg-purple-600 text-white border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Calculating...
            </>
          ) : (
            'Check Attendance Status'
          )}
        </button>

        {result && (
          <div className={`${result.status === 'Safe' ? 'bg-neo-green/20 border-neo-green' : 'bg-neo-pink/20 border-neo-pink'} border-4 p-8 rounded-xl text-center shadow-[4px_4px_0px_0px_#000] mt-8 animate-in fade-in zoom-in duration-300`}>
            {result.status === 'Safe' ? (
              <CheckCircle2 className="w-16 h-16 text-neo-green mx-auto mb-4" />
            ) : (
              <AlertCircle className="w-16 h-16 text-neo-pink mx-auto mb-4" />
            )}
            
            <h3 className="font-black text-xl uppercase mb-2">Current Attendance</h3>
            <p className="text-5xl font-black mb-6">{result.current_percentage}%</p>
            
            <div className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
              <p className="font-bold text-lg text-gray-800">{result.message}</p>
            </div>
            
            <button
              onClick={reset}
              className="mt-6 mx-auto bg-white hover:bg-gray-100 text-black border-4 border-black font-black text-lg py-3 px-6 rounded-xl flex items-center gap-2 transition-colors uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
            >
              <RefreshCw className="w-5 h-5" />
              Reset Calculator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const attendanceCalculatorInstructions = [
  "Enter the total number of classes held so far.",
  "Enter how many classes you actually attended.",
  "Enter your target percentage (usually 75%).",
  "Click 'Check Attendance Status' to see if you're safe.",
  "The tool will tell you exactly how many classes you can bunk or how many you need to attend consecutively to reach your goal!"
];
