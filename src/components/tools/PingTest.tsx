import React, { useState, useEffect } from 'react';
import { Activity, Loader2, Zap, ZapOff } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function PingTest() {
  const [host, setHost] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ping = async () => {
    if (!host) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    let cleanHost = host.replace(/^https?:\/\//, '').split('/')[0];

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: cleanHost })
      });
      if (!response.ok) throw new Error('Failed to ping host');
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
          <Activity className="w-8 h-8" />
          Ping Test
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Host / IP Address</label>
          <input 
            type="text" 
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="google.com or 8.8.8.8"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all font-mono"
          />
        </div>

        <button 
          onClick={ping}
          disabled={isLoading || !host}
          className="w-full bg-neo-green border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
          {isLoading ? 'Pinging...' : 'Send Ping'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 flex flex-col items-center justify-center text-center">
            {result.is_reachable ? (
              <>
                <div className="bg-neo-green p-4 rounded-full border-4 border-black mb-4">
                  <Zap className="w-10 h-10 text-black" />
                </div>
                <h4 className="text-xl font-black uppercase mb-1">Host is Reachable</h4>
                <p className="font-mono text-gray-400 mb-6">{result.host}</p>
                
                <div className="bg-white/10 p-6 rounded-xl border-2 border-white/20 w-full">
                  <span className="block text-sm font-bold text-gray-400 uppercase mb-2">Round Trip Latency</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-neo-green">{result.latency_ms}</span>
                    <span className="text-xl font-bold text-gray-400">ms</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500 p-4 rounded-full border-4 border-black mb-4">
                  <ZapOff className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-black uppercase mb-1 text-red-400">Host Unreachable</h4>
                <p className="font-mono text-gray-400">{result.host}</p>
                <p className="mt-4 font-bold text-sm text-gray-500">The request timed out. The host may be down or blocking ICMP packets.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const pingTestInstructions = [
  "Enter a domain name (e.g. google.com) or an IP address (e.g. 8.8.8.8).",
  "Click 'Send Ping' to send an ICMP echo request to the target.",
  "Check the reachability status and the round trip latency (in milliseconds)."
];
