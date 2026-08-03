import React, { useState } from 'react';
import { FileCode2, Loader2, ArrowRightLeft, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function EncoderDecoder() {
  const [text, setText] = useState('');
  const [action, setAction] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const processText = async () => {
    if (!text) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/base64/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Failed to ${action} text`);
      }
      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
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
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <FileCode2 className="w-8 h-8" />
          Base64 Encoder/Decoder
        </h3>
        
        <div className="mb-6 flex gap-4 bg-gray-200 p-2 rounded-xl border-4 border-black">
          <button 
            onClick={() => { setAction('encode'); setResult(null); setError(null); }}
            className={`flex-1 py-3 font-black uppercase rounded-lg transition-all ${
              action === 'encode' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-300'
            }`}
          >
            Encode to Base64
          </button>
          <button 
            onClick={() => { setAction('decode'); setResult(null); setError(null); }}
            className={`flex-1 py-3 font-black uppercase rounded-lg transition-all ${
              action === 'decode' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-300'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-black uppercase mb-2">
            Input {action === 'encode' ? 'Plain Text' : 'Base64 String'}
          </label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={action === 'encode' ? 'Enter text to encode...' : 'SGVsbG8gV29ybGQ='}
            rows={5}
            className="w-full bg-gray-50 border-4 border-black p-4 text-lg font-mono font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          ></textarea>
        </div>

        <button 
          onClick={processText}
          disabled={isLoading || !text}
          className="w-full bg-neo-pink border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRightLeft className="w-6 h-6" />}
          {action === 'encode' ? 'Generate Base64' : 'Decode to Text'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 relative">
            <button 
              onClick={copyToClipboard}
              className="absolute top-4 right-4 bg-neo-pink text-black border-2 border-black p-2 rounded-lg font-black uppercase hover:scale-105 transition-transform flex items-center gap-2 text-sm z-10"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            
            <h4 className="text-lg font-bold uppercase mb-4 text-neo-pink">
              {action === 'encode' ? 'Base64 Result' : 'Decoded Text'}
            </h4>
            <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded-xl max-h-[300px] overflow-y-auto">
              <pre className="font-mono text-sm leading-relaxed text-white whitespace-pre-wrap break-all">
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const encoderDecoderInstructions = [
  "Select whether you want to ENCODE plain text to Base64 or DECODE a Base64 string back to text.",
  "Enter your text into the input box.",
  "Click the action button to process it instantly, then copy the result!"
];
