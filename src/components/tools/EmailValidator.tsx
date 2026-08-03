import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle, XCircle, Search } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function EmailValidator() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = async () => {
    if (!email) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    if (!email.includes('@')) {
      setError("Please enter a valid email address with an '@' symbol.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/email/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Failed to validate email');
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
          <Mail className="w-8 h-8" />
          Email Validator
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <button 
          onClick={validate}
          disabled={isLoading || !email}
          className="w-full bg-neo-pink border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Validate Email'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-xl font-black uppercase mb-6 text-neo-pink flex items-center gap-2">
              <Search className="w-6 h-6" />
              Scan Results
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
                <span className="font-bold text-gray-300">Format Validity</span>
                <div className="flex items-center gap-2">
                  {result.is_valid_format ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
                  <span className={`font-bold ${result.is_valid_format ? 'text-green-400' : 'text-red-400'}`}>
                    {result.is_valid_format ? 'Valid' : 'Invalid'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
                <span className="font-bold text-gray-300">Domain MX Records (Inbox Exists)</span>
                <div className="flex items-center gap-2">
                  {result.has_mx_records ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
                  <span className={`font-bold ${result.has_mx_records ? 'text-green-400' : 'text-red-400'}`}>
                    {result.has_mx_records ? 'Found' : 'Not Found'}
                  </span>
                </div>
              </div>
            </div>

            {result.mx_records && result.mx_records.length > 0 && (
              <div className="mt-6 pt-4">
                <span className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-2 block">Mail Servers (Raw Data)</span>
                <ul className="space-y-1">
                  {result.mx_records.map((mx: string, idx: number) => (
                    <li key={idx} className="font-mono text-sm text-neo-pink break-all">
                      • {mx}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {!result.has_mx_records && (
              <div className="mt-6 p-4 bg-red-900/50 border-2 border-red-500 rounded-lg text-red-200 text-sm font-bold">
                Warning: No mail servers were found for this domain. Emails sent to this address will likely bounce.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const emailValidatorInstructions = [
  "Enter the email address you want to verify.",
  "Click 'Validate Email' to run a deep DNS check.",
  "Check the MX records to confirm that the domain actually accepts emails, reducing your bounce rate."
];
