import React, { useState } from 'react';
import { Search, Loader2, Database, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function DNSLookup() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async () => {
    if (!domain) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Clean input to just the domain
    let cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/dns/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: cleanDomain })
      });
      if (!response.ok) throw new Error('Failed to lookup DNS records');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const RecordBox = ({ title, records, colorClass }: { title: string, records: string[], colorClass: string }) => {
    if (!records || records.length === 0) return null;
    return (
      <div className={`border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] ${colorClass}`}>
        <h5 className="font-black uppercase mb-3 flex items-center justify-between">
          {title} Records
          <span className="bg-black text-white px-2 py-0.5 rounded text-sm">{records.length}</span>
        </h5>
        <ul className="space-y-2">
          {records.map((rec, idx) => (
            <li key={idx} className="font-mono text-sm break-all bg-white/50 p-2 border-2 border-black/20 rounded">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Database className="w-8 h-8" />
          DNS Lookup
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Domain Name</label>
          <input 
            type="text" 
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all font-mono"
          />
        </div>

        <button 
          onClick={lookup}
          disabled={isLoading || !domain}
          className="w-full bg-neo-purple text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          {isLoading ? 'Fetching Records...' : 'Lookup DNS'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl flex items-start gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {result && result.records && (
          <div className="mt-8 animate-in slide-in-from-bottom-4">
            <h4 className="text-xl font-black uppercase mb-4 text-gray-700">Results for: <span className="text-black">{result.domain}</span></h4>
            
            {Object.values(result.records).every((arr: any) => arr.length === 0) ? (
              <div className="bg-yellow-100 border-4 border-yellow-500 p-6 rounded-xl font-bold text-center">
                No standard DNS records (A, MX, TXT, NS) found for this domain.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <RecordBox title="A" records={result.records['A']} colorClass="bg-blue-50" />
                <RecordBox title="MX" records={result.records['MX']} colorClass="bg-green-50" />
                <RecordBox title="TXT" records={result.records['TXT']} colorClass="bg-yellow-50" />
                <RecordBox title="NS" records={result.records['NS']} colorClass="bg-purple-50" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const dnsLookupInstructions = [
  "Enter a bare domain name (e.g., example.com) into the input box.",
  "Click 'Lookup DNS' to query public DNS servers for information.",
  "View the A (IPv4), MX (Mail), TXT (Text), and NS (Name Server) records retrieved."
];
