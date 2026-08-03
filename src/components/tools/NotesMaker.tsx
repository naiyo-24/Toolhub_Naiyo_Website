import React, { useState } from 'react';
import { FileText, Bot, Loader2, RefreshCw, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function NotesMaker() {
  const [formData, setFormData] = useState({
    topic: '',
    detail_level: 'Standard'
  });
  
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic to generate notes for.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/student-toolkit/notes-maker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic.trim(),
          detail_level: formData.detail_level
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate notes');
      }

      const data = await response.json();
      setResult(data.notes);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating notes.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError('');
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          <div className="bg-neo-pink p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            <FileText className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-3xl font-black uppercase leading-tight">AI Notes Maker</h2>
        </div>
        <div className="bg-black text-white px-3 py-1 rounded-xl border-4 border-black font-black uppercase shadow-[2px_2px_0px_0px_#000] rotate-3 text-sm flex items-center gap-2">
          <Bot className="w-4 h-4 text-neo-pink" /> Smart Notes
        </div>
      </div>

      {!result ? (
        <div className="space-y-6">
          <div>
            <label className="font-black uppercase text-sm block mb-2">Topic or Subject</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="e.g. The French Revolution, Quantum Physics, Cell Biology"
              className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-pink/50 transition-all"
            />
          </div>

          <div>
            <label className="font-black uppercase text-sm block mb-2">Level of Detail</label>
            <select
              name="detail_level"
              value={formData.detail_level}
              onChange={handleInputChange}
              className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-pink/50 transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="Brief">Brief (Summary & Key Points)</option>
              <option value="Standard">Standard (Balanced Notes)</option>
              <option value="Detailed">Detailed (In-depth Explanations)</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading || !formData.topic.trim()}
            className="w-full bg-neo-pink hover:bg-pink-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Drafting Notes...
              </>
            ) : (
              'Generate Notes'
            )}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={copyToClipboard}
              className="bg-white hover:bg-gray-100 text-black border-4 border-black font-black px-4 py-2 rounded-xl flex items-center gap-2 transition-colors uppercase text-sm shadow-[2px_2px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
              {copied ? <Check className="w-4 h-4 text-neo-green" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Notes'}
            </button>
          </div>
          
          <div className="bg-[#fff0f5] border-4 border-black p-6 md:p-8 rounded-xl shadow-[6px_6px_0px_0px_#000] prose prose-lg max-w-none font-medium text-gray-800 whitespace-pre-wrap max-h-[60vh] overflow-y-auto custom-scrollbar">
            {formatText(result)}
          </div>
          
          <button
            onClick={reset}
            className="mt-8 mx-auto w-full md:w-auto bg-black text-white hover:bg-gray-800 border-4 border-black font-black text-lg py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
          >
            <RefreshCw className="w-5 h-5" />
            Generate More Notes
          </button>
        </div>
      )}
    </div>
  );
}

export const notesMakerInstructions = [
  "Enter any topic or subject you want to learn about.",
  "Select how detailed you want the notes to be (Brief, Standard, or Detailed).",
  "Click 'Generate Notes'.",
  "Our AI will instantly draft beautifully structured study notes with headings and bullet points!"
];
