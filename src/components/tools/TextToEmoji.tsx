import React, { useState } from 'react';
import { Type, Loader2, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function TextToEmoji() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convertText = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);
    setCopied(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/social-tools/text-to-emoji`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to convert text');
      
      const data = await response.json();
      setResult(data.emoji_text);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
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
          <Type className="w-8 h-8" />
          Text to Emoji Letters
        </h3>
        
        <div className="space-y-4 mb-6">
          <label className="block text-lg font-black uppercase">Enter Text</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type anything..."
            className="w-full h-32 bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all resize-none"
          />
        </div>

        <button 
          onClick={convertText}
          disabled={isLoading || !text.trim()}
          className="w-full bg-neo-blue text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Convert to Emojis'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] relative animate-in slide-in-from-bottom-4">
            <button 
              onClick={copyToClipboard}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-lg border-2 border-black hover:bg-neo-yellow transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-blue">Result</h4>
            <div className="text-2xl whitespace-pre-wrap pr-12 break-all">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
