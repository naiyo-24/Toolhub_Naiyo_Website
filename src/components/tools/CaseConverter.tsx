import React, { useState } from 'react';
import { Type, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const CASE_TYPES = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' }
];

export function CaseConverter() {
  const [text, setText] = useState<string>('');
  const [caseType, setCaseType] = useState<string>('upper');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const calculate = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/text/case`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          case_type: caseType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert text case from server.');
      }
      
      const data = await response.json();
      setResult(data.converted_text);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Type className="w-8 h-8" />
          Case Converter
        </h3>
        
        <div className="mb-6">
          <label className="block text-lg font-black uppercase mb-2">Original Text</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all min-h-[150px]"
          />
        </div>

        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-4">Select Target Case</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CASE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setCaseType(type.id)}
                className={`p-4 border-4 border-black font-black uppercase rounded-xl transition-all ${
                  caseType === type.id 
                    ? 'bg-neo-blue text-white shadow-[4px_4px_0px_0px_#000] translate-x-0 translate-y-0' 
                    : 'bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !text.trim()}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Convert Case'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 relative group">
            <h4 className="text-xl font-black uppercase mb-4 text-neo-yellow">Converted Text</h4>
            <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20 whitespace-pre-wrap font-mono min-h-[100px]">
              {result}
            </div>
            
            <button 
              onClick={handleCopy}
              className="absolute top-6 right-6 bg-white text-black p-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all"
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const caseConverterInstructions = [
  "Enter the text you want to convert in the top text area.",
  "Select the target casing style from the grid (e.g., camelCase, snake_case).",
  "Click 'Convert Case' to securely transform your text using the backend API.",
  "Click the Copy icon in the result box to instantly copy the converted text to your clipboard."
];
