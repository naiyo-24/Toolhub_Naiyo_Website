import React, { useState } from 'react';
import { Link, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function URLExpander() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ expanded_url: string, original_url: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expand = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    let submitUrl = url;
    if (!submitUrl.startsWith('http')) {
      submitUrl = 'https://' + submitUrl;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/url/expand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ short_url: submitUrl })
      });
      if (!response.ok) throw new Error('Failed to expand URL');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Link className="w-8 h-8" />
          URL Expander
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Paste Short URL</label>
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://bit.ly/xyz..."
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <button 
          onClick={expand}
          disabled={isLoading || !url}
          className="w-full bg-neo-purple text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Expand Link'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-lg font-bold uppercase mb-4 text-neo-purple">Original Destination</h4>
            <div className="bg-white text-black border-4 border-black p-4 rounded-xl font-mono font-bold w-full break-all flex flex-col gap-2">
              <span className="text-gray-500 text-sm">Redirects to:</span>
              <a href={result.expanded_url} target="_blank" rel="noopener noreferrer" className="text-neo-blue hover:underline flex items-center gap-2">
                {result.expanded_url}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const urlExpanderInstructions = [
  "Paste a shortened URL (like bit.ly, tinyurl, etc.) into the input box.",
  "Click 'Expand Link' to reveal the actual destination behind the short link.",
  "Check the expanded URL before clicking to avoid suspicious or malicious websites."
];
