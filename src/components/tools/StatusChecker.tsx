import React, { useState } from 'react';
import { Activity, Loader2, Server, ServerCrash, Clock } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function StatusChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    let submitUrl = url;
    if (!submitUrl.startsWith('http')) {
      submitUrl = 'https://' + submitUrl;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/website/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl })
      });
      const data = await response.json();
      
      // Even if response.ok is false, the backend might return { is_up: false, error: ... }
      if (!response.ok && !data.is_up) {
        setResult(data);
      } else if (!response.ok) {
        throw new Error('Failed to check status');
      } else {
        setResult(data);
      }
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
          <Activity className="w-8 h-8" />
          Status Checker
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Website URL</label>
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <button 
          onClick={checkStatus}
          disabled={isLoading || !url}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Check Status'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className={`mt-8 border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 ${result.is_up ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full border-4 border-black ${result.is_up ? 'bg-green-400' : 'bg-red-400'}`}>
                  {result.is_up ? <Server className="w-8 h-8" /> : <ServerCrash className="w-8 h-8 text-white" />}
                </div>
                <div>
                  <h4 className="font-black uppercase text-2xl mb-1">
                    {result.is_up ? 'Online' : 'Offline'}
                  </h4>
                  <p className="font-bold text-gray-700 text-sm">{result.url}</p>
                </div>
              </div>

              {result.is_up && (
                <div className="flex flex-row gap-4 w-full md:w-auto">
                  <div className="bg-white border-2 border-black p-3 rounded-xl flex-1 text-center">
                    <span className="block text-xs font-bold text-gray-500 uppercase">Code</span>
                    <span className="font-black text-xl">{result.status_code}</span>
                  </div>
                  <div className="bg-white border-2 border-black p-3 rounded-xl flex-1 text-center min-w-[100px]">
                    <span className="block text-xs font-bold text-gray-500 uppercase flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Time
                    </span>
                    <span className="font-black text-xl text-neo-blue">{result.response_time_ms}</span>
                    <span className="text-xs font-bold text-gray-500 ml-1">ms</span>
                  </div>
                </div>
              )}
              
              {!result.is_up && result.error && (
                <div className="w-full bg-black text-red-400 font-mono text-sm p-3 rounded-xl border-2 border-black break-all">
                  {result.error}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const statusCheckerInstructions = [
  "Enter the URL of the website you want to check.",
  "Click 'Check Status' to send a ping request.",
  "View whether the site is online or offline, along with the HTTP response code and response time."
];
