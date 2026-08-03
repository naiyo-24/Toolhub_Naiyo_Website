import React, { useState } from 'react';
import { Type, Loader2, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function FancyText() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const convertText = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/social-tools/fancy-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to convert text');
      
      const data = await response.json();
      setResult(data.styles);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Type className="w-8 h-8" />
          Fancy Text Generator
        </h3>
        
        <div className="space-y-4 mb-6">
          <label className="block text-lg font-black uppercase">Enter Text</label>
          <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your name or short bio..."
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <button 
          onClick={convertText}
          disabled={isLoading || !text.trim()}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Make it Fancy'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4">Results</h4>
            {Object.entries(result).map(([styleName, styledText]: any) => (
              <div key={styleName} className="bg-white border-4 border-black p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold uppercase text-gray-500 mb-1">{styleName.replace(/_/g, ' ')}</div>
                  <div className="text-xl font-bold truncate">{styledText}</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(styleName, styledText)}
                  className="bg-black text-white p-3 rounded-lg border-2 border-black hover:bg-gray-800 transition-colors shrink-0"
                >
                  {copiedKey === styleName ? <Check className="w-5 h-5 text-neo-green" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
