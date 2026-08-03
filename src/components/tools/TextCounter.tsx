import React, { useState } from 'react';
import { Type, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function TextCounter() {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/text/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text from server.');
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
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Type className="w-8 h-8" />
          Text Analyzer
        </h3>
        
        <div className="mb-6">
          <label className="block text-lg font-black uppercase mb-2">Enter your text below</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all min-h-[200px]"
          />
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !text.trim()}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Analyze Text'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-6 text-neo-yellow">Text Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-3xl md:text-4xl font-black mb-1">{result.characters}</div>
                <div className="font-bold uppercase text-xs opacity-80">Characters</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-3xl md:text-4xl font-black mb-1 text-green-400">{result.words}</div>
                <div className="font-bold uppercase text-xs opacity-80">Words</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-3xl md:text-4xl font-black mb-1 text-blue-400">{result.lines}</div>
                <div className="font-bold uppercase text-xs opacity-80">Sentences</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20">
                <div className="text-3xl md:text-4xl font-black mb-1 text-orange-400">{result.spaces}</div>
                <div className="font-bold uppercase text-xs opacity-80">Spaces</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const textCounterInstructions = [
  "Type or paste your text into the large input box.",
  "Click 'Analyze Text' to process the text on the backend.",
  "View the exact character count, word count, sentence count, and space count instantly."
];
