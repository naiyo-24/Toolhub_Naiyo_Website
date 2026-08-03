import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Loader2, Clock, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface CountdownResult {
  status: string;
  days_left?: number;
  hours_left?: number;
  message: string;
}

export function ExamCountdown() {
  const [examDate, setExamDate] = useState('');
  const [result, setResult] = useState<CountdownResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    if (!examDate) {
      setError('Please select an exam date.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/student-toolkit/exam-countdown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exam_date: examDate
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to calculate countdown');
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
    setExamDate('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <CalendarIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Exam Countdown</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="font-black uppercase text-sm block mb-2">Select Exam Date</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-blue/50 transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
            {error}
          </div>
        )}

        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="w-full bg-neo-blue hover:bg-blue-500 text-white border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Calculating...
            </>
          ) : (
            'Start Countdown'
          )}
        </button>

        {result && (
          <div className={`border-4 border-black p-8 rounded-xl text-center shadow-[4px_4px_0px_0px_#000] mt-8 animate-in fade-in zoom-in duration-300 ${result.status === 'Passed' ? 'bg-neo-green/20' : 'bg-neo-yellow'}`}>
            
            {result.status === 'Upcoming' ? (
              <>
                <Clock className="w-16 h-16 text-black mx-auto mb-4" />
                <h3 className="font-black text-2xl uppercase mb-6">Time Remaining</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                    <div className="text-5xl font-black">{result.days_left}</div>
                    <div className="font-bold text-gray-500 uppercase mt-1">Days</div>
                  </div>
                  <div className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                    <div className="text-5xl font-black">{result.hours_left}</div>
                    <div className="font-bold text-gray-500 uppercase mt-1">Hours</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-16 h-16 text-neo-green mx-auto mb-4" />
                <h3 className="font-black text-2xl uppercase mb-6 text-neo-green">Exam Completed</h3>
              </>
            )}
            
            <p className="font-bold text-lg bg-white border-4 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000] inline-block">{result.message}</p>
            
            <button
              onClick={reset}
              className="mt-8 mx-auto bg-white hover:bg-gray-100 text-black border-4 border-black font-black text-lg py-3 px-6 rounded-xl flex items-center gap-2 transition-colors uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
            >
              <RefreshCw className="w-5 h-5" />
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const examCountdownInstructions = [
  "Select the exact date of your upcoming exam from the calendar.",
  "Click 'Start Countdown' to calculate the time remaining.",
  "Use this visual countdown to pace your study schedule and stay motivated!"
];
