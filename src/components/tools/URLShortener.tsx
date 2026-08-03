import React, { useState } from 'react';
import { Link, Loader2, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function URLShortener() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ short_url: string, original_url: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shorten = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    let submitUrl = url;
    if (!submitUrl.startsWith('http')) {
      submitUrl = 'https://' + submitUrl;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/url/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl })
      });
      if (!response.ok) throw new Error('Failed to shorten URL');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Link className="w-8 h-8" />
          URL Shortener
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Paste Long URL</label>
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <button 
          onClick={shorten}
          disabled={isLoading || !url}
          className="w-full bg-neo-pink border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Shorten Link'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-lg font-bold uppercase mb-2 text-neo-pink">Shortened URL</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 bg-white text-black border-4 border-black p-4 rounded-xl font-mono font-bold w-full break-all">
                {result.short_url}
              </div>
              <button 
                onClick={copyToClipboard}
                className="w-full sm:w-auto bg-neo-pink text-black border-4 border-black p-4 rounded-xl font-black uppercase hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const urlShortenerInstructions = [
  "Paste your long URL into the input field above.",
  "Click 'Shorten Link' to generate a compact version.",
  "Use the 'Copy' button to easily copy your new short URL to your clipboard."
];
