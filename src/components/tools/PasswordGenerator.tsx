import React, { useState } from 'react';
import { KeyRound, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function PasswordGenerator() {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [customChars, setCustomChars] = useState<string>('');
  
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const calculate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/password/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          length,
          include_uppercase: includeUppercase,
          include_lowercase: includeLowercase,
          include_numbers: includeNumbers,
          include_symbols: includeSymbols,
          custom_chars: customChars
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate password from server.');
      }
      
      const data = await response.json();
      setResult(data.password);
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
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <KeyRound className="w-8 h-8" />
          Password Generator
        </h3>
        
        <div className="space-y-6 mb-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-lg font-black uppercase">Password Length</label>
              <span className="font-black text-xl text-neo-blue">{length}</span>
            </div>
            <input 
              type="range" 
              min="8" max="64" 
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-black cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 border-4 border-black rounded-xl hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-6 h-6 border-4 border-black rounded shadow-[2px_2px_0px_0px_#000] accent-neo-blue"
              />
              <span className="font-bold uppercase">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border-4 border-black rounded-xl hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-6 h-6 border-4 border-black rounded shadow-[2px_2px_0px_0px_#000] accent-neo-blue"
              />
              <span className="font-bold uppercase">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border-4 border-black rounded-xl hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-6 h-6 border-4 border-black rounded shadow-[2px_2px_0px_0px_#000] accent-neo-blue"
              />
              <span className="font-bold uppercase">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border-4 border-black rounded-xl hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-6 h-6 border-4 border-black rounded shadow-[2px_2px_0px_0px_#000] accent-neo-blue"
              />
              <span className="font-bold uppercase">Symbols (!@#$)</span>
            </label>
          </div>

          <div>
            <label className="block text-lg font-black uppercase mb-2">Custom Characters (Optional)</label>
            <input 
              type="text" 
              value={customChars}
              onChange={(e) => setCustomChars(e.target.value)}
              placeholder="e.g. only use xyz123"
              className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols && !customChars)}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generate Secure Password'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 relative group">
            <h4 className="text-xl font-black uppercase mb-4 text-neo-yellow">Your Password</h4>
            <div className="bg-white/10 p-6 rounded-xl border-2 border-white/20 font-mono text-2xl md:text-3xl text-center break-all shadow-inner">
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

export const passwordGeneratorInstructions = [
  "Use the slider to select the length of your password (up to 64 characters).",
  "Check or uncheck the boxes to include uppercase, lowercase, numbers, and symbols.",
  "Optionally, provide a list of exact characters to restrict generation.",
  "Click 'Generate Secure Password' to fetch a highly secure string from the server.",
  "Click the Copy icon to safely copy it to your clipboard."
];
