import React, { useState } from 'react';
import { Gauge, Loader2, Download, Upload, Activity } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function SpeedTest() {
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/speedtest`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to run speed test. Please ensure backend speedtest-cli is installed and reachable.');
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-neo-pink rounded-full border-4 border-black shadow-[4px_4px_0px_0px_#000] mb-6">
            <Gauge className="w-12 h-12 text-black" />
          </div>
          <h3 className="text-4xl font-black uppercase tracking-tight">Speed Test</h3>
          <p className="text-gray-500 font-bold mt-2">Test your connection speed (Download, Upload, Ping)</p>
        </div>

        <button 
          onClick={runTest}
          disabled={isLoading}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-6 font-black uppercase text-2xl rounded-2xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              Testing Connection... (May take 30s+)
            </>
          ) : (
            'Start Test'
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
            
            <div className="bg-blue-100 border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center">
              <Download className="w-10 h-10 mb-3 text-blue-600" />
              <span className="font-bold uppercase text-gray-600 text-sm tracking-wider mb-2">Download</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{result.download_mbps}</span>
                <span className="font-bold text-gray-500">Mbps</span>
              </div>
            </div>

            <div className="bg-green-100 border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center">
              <Upload className="w-10 h-10 mb-3 text-green-600" />
              <span className="font-bold uppercase text-gray-600 text-sm tracking-wider mb-2">Upload</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{result.upload_mbps}</span>
                <span className="font-bold text-gray-500">Mbps</span>
              </div>
            </div>

            <div className="bg-purple-100 border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center">
              <Activity className="w-10 h-10 mb-3 text-purple-600" />
              <span className="font-bold uppercase text-gray-600 text-sm tracking-wider mb-2">Ping</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{result.ping_ms}</span>
                <span className="font-bold text-gray-500">ms</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export const speedTestInstructions = [
  "Click 'Start Test' to begin analyzing your network connection.",
  "Wait for the test to complete (it may take 30+ seconds depending on network stability).",
  "Review your Download (Mbps), Upload (Mbps), and Ping (ms) results."
];
