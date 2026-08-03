import React, { useState } from 'react';
import { ClipboardList, Bot, Loader2, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function AssignmentPlanner() {
  const [formData, setFormData] = useState({
    days_until_due: '',
    assignment_topic: ''
  });
  
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = async () => {
    if (!formData.days_until_due || !formData.assignment_topic.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/student-toolkit/assignment-planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days_until_due: parseInt(formData.days_until_due),
          assignment_topic: formData.assignment_topic.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate plan');
      }

      const data = await response.json();
      setResult(data.planner);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError('');
  };

  // Helper to format basic markdown text (bolding only)
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-2">
          {parts.map((part, j) => 
            part.startsWith('**') && part.endsWith('**') ? 
              <strong key={j} className="font-black text-black">{part.slice(2, -2)}</strong> : 
              part
          )}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-neo-purple p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black uppercase leading-tight">Assignment Planner</h2>
        </div>
        <div className="bg-neo-blue text-white px-3 py-1 rounded-xl border-4 border-black font-black uppercase shadow-[2px_2px_0px_0px_#000] -rotate-3 text-sm flex items-center gap-2">
          <Bot className="w-4 h-4" /> AI Powered
        </div>
      </div>

      {!result ? (
        <div className="space-y-6">
          <div>
            <label className="font-black uppercase text-sm block mb-2">Days Until Due</label>
            <input
              type="number"
              name="days_until_due"
              value={formData.days_until_due}
              onChange={handleInputChange}
              min="1"
              max="90"
              placeholder="e.g. 7"
              className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-purple/50 transition-all"
            />
          </div>

          <div>
            <label className="font-black uppercase text-sm block mb-2">Assignment Topic / Details</label>
            <textarea
              name="assignment_topic"
              value={formData.assignment_topic}
              onChange={handleInputChange}
              rows={4}
              placeholder="e.g. A 5-page research paper on the effects of climate change on marine biology."
              className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-purple/50 transition-all resize-none"
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
            className="w-full bg-neo-purple hover:bg-purple-600 text-white border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Planning Assignment...
              </>
            ) : (
              'Generate Master Plan'
            )}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300">
          <div className="bg-[#fdfcdc] border-4 border-black p-6 md:p-8 rounded-xl shadow-[6px_6px_0px_0px_#000] prose prose-lg max-w-none font-medium text-gray-800 whitespace-pre-wrap">
            {formatText(result)}
          </div>
          
          <button
            onClick={reset}
            className="mt-8 mx-auto w-full md:w-auto bg-black text-white hover:bg-gray-800 border-4 border-black font-black text-lg py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
          >
            <RefreshCw className="w-5 h-5" />
            Plan Another Assignment
          </button>
        </div>
      )}
    </div>
  );
}

export const assignmentPlannerInstructions = [
  "Enter the number of days you have until the assignment is due.",
  "Type in what the assignment is about (the more details, the better!).",
  "Click 'Generate Master Plan'.",
  "The AI will break down your assignment into a day-by-day checklist so you can finish it without cramming!"
];
