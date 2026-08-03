import React, { useState } from 'react';
import { Calendar, Bot, Loader2, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function StudyPlanner() {
  const [formData, setFormData] = useState({
    days_available: '',
    hours_per_day: ''
  });
  
  const [subjects, setSubjects] = useState<string[]>(['Math', 'History']);
  const [newSubject, setNewSubject] = useState('');
  
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects(prev => [...prev, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (sub: string) => {
    if (subjects.length <= 1) return;
    setSubjects(prev => prev.filter(s => s !== sub));
  };

  const handleCalculate = async () => {
    if (!formData.days_available || !formData.hours_per_day || subjects.length === 0) {
      setError('Please fill in all fields and add at least one subject.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/student-toolkit/study-planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days_available: parseInt(formData.days_available),
          hours_per_day: parseFloat(formData.hours_per_day),
          subjects: subjects
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate plan');
      }

      const data = await response.json();
      setResult(data.study_plan);
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
          <div className="bg-neo-green p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            <Calendar className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-3xl font-black uppercase leading-tight">AI Study Planner</h2>
        </div>
        <div className="bg-black text-white px-3 py-1 rounded-xl border-4 border-black font-black uppercase shadow-[2px_2px_0px_0px_#000] rotate-3 text-sm flex items-center gap-2">
          <Bot className="w-4 h-4 text-neo-green" /> Smart Plan
        </div>
      </div>

      {!result ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-black uppercase text-sm block mb-2">Days Available to Study</label>
              <input
                type="number"
                name="days_available"
                value={formData.days_available}
                onChange={handleInputChange}
                min="1"
                max="90"
                placeholder="e.g. 14"
                className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-green/50 transition-all"
              />
            </div>
            <div>
              <label className="font-black uppercase text-sm block mb-2">Study Hours Per Day</label>
              <input
                type="number"
                name="hours_per_day"
                value={formData.hours_per_day}
                onChange={handleInputChange}
                min="0.5"
                step="0.5"
                max="24"
                placeholder="e.g. 4"
                className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-green/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="font-black uppercase text-sm block mb-2">Subjects to Cover</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                placeholder="e.g. Chemistry"
                className="flex-1 border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/50 transition-all"
              />
              <button
                onClick={addSubject}
                className="bg-black text-white px-4 rounded-xl border-4 border-black font-black hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub, idx) => (
                <div key={idx} className="bg-neo-green border-4 border-black px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
                  {sub}
                  <button onClick={() => removeSubject(sub)} className="hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={isLoading || subjects.length === 0}
            className="w-full bg-neo-green hover:bg-green-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating Master Schedule...
              </>
            ) : (
              'Create Study Plan'
            )}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300">
          <div className="bg-[#f0fff4] border-4 border-black p-6 md:p-8 rounded-xl shadow-[6px_6px_0px_0px_#000] prose prose-lg max-w-none font-medium text-gray-800 whitespace-pre-wrap">
            {formatText(result)}
          </div>
          
          <button
            onClick={reset}
            className="mt-8 mx-auto w-full md:w-auto bg-black text-white hover:bg-gray-800 border-4 border-black font-black text-lg py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
          >
            <RefreshCw className="w-5 h-5" />
            Create Another Plan
          </button>
        </div>
      )}
    </div>
  );
}

export const studyPlannerInstructions = [
  "Enter how many days you have available until your exam.",
  "Enter how many hours you realistically plan to study each day.",
  "Add all the subjects or topics you need to review.",
  "Click 'Create Study Plan' and the AI will split up your workload intelligently across your available time!"
];
