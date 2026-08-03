import React, { useState } from 'react';
import { Code, Loader2, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function JSONFormatter() {
  const [inputJson, setInputJson] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const format = async () => {
    if (!inputJson) return;
    setIsLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/json/format`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json_string: inputJson })
      });
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setResult({ is_valid: false, error: 'Network or Server Error' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result && result.formatted_json) {
      navigator.clipboard.writeText(result.formatted_json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Code className="w-8 h-8" />
          JSON Formatter
        </h3>
        
        <div className="mb-6">
          <label className="block text-lg font-black uppercase mb-2">Raw JSON Input</label>
          <textarea 
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder='{"key": "value", "nested": {"array": [1,2,3]}}'
            rows={6}
            className="w-full bg-gray-50 border-4 border-black p-4 text-sm font-mono font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          ></textarea>
        </div>

        <button 
          onClick={format}
          disabled={isLoading || !inputJson}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Format & Validate'}
        </button>

        {result && (
          <div className="mt-8 animate-in slide-in-from-bottom-4">
            {!result.is_valid ? (
              <div className="bg-red-100 border-4 border-red-500 p-6 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                <h4 className="text-xl font-black uppercase mb-2 text-red-600">Invalid JSON</h4>
                <p className="font-mono font-bold text-red-800 break-all">{result.error}</p>
              </div>
            ) : (
              <div className="bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] relative group">
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 bg-neo-yellow text-black border-2 border-black p-2 rounded-lg font-black uppercase hover:scale-105 transition-transform flex items-center gap-2 text-sm z-10"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                
                <h4 className="text-lg font-bold uppercase mb-4 text-neo-yellow">Formatted Output</h4>
                <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded-xl overflow-x-auto max-h-[500px]">
                  <pre className="font-mono text-sm leading-relaxed text-green-400">
                    {result.formatted_json}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const jsonFormatterInstructions = [
  "Paste your raw, minified, or unformatted JSON into the input box.",
  "Click 'Format & Validate' to instantly parse the code.",
  "If the JSON is valid, it will be beautifully indented for easy reading. If there's a syntax error, we'll tell you exactly what went wrong."
];
