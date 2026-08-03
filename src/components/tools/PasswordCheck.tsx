import React, { useState } from 'react';
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function PasswordCheck() {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (!password) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/password/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Failed to check password strength from server.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-orange-500';
    if (score === 3) return 'bg-yellow-500';
    if (score >= 4) return 'bg-green-500';
    return 'bg-gray-300';
  };

  const getScoreText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score === 2) return 'Weak';
    if (score === 3) return 'Good';
    if (score >= 4) return 'Strong';
    return '';
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8" />
          Strength Checker
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Enter Password to Check</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password..."
              className="w-full bg-gray-50 border-4 border-black p-4 pr-16 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all font-mono"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !password}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Check Strength'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-6 text-neo-yellow">Analysis Result</h4>
            
            <div className="mb-6 text-center">
              <div className="text-4xl font-black uppercase mb-2" style={{ color: getScoreColor(result.score).replace('bg-', '') }}>
                {getScoreText(result.score)}
              </div>
              
              {/* Score Bar */}
              <div className="flex gap-2 h-4 mt-4">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`flex-1 rounded-full border-2 border-black ${
                      level <= result.score ? getScoreColor(result.score) : 'bg-gray-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {result.feedback && result.feedback.length > 0 && (
              <div className="mt-6 border-t-2 border-white/20 pt-6">
                <h5 className="font-bold uppercase text-sm opacity-80 mb-3">Feedback to improve:</h5>
                <ul className="space-y-2">
                  {result.feedback.map((f: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-red-300">
                      <span className="font-black mt-1">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.score >= 4 && (
              <div className="mt-6 border-t-2 border-white/20 pt-6 text-green-400 font-bold">
                Excellent! Your password is very secure.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const passwordCheckInstructions = [
  "Type or paste a password into the input box.",
  "Use the 'Eye' icon to toggle the visibility of the password if needed.",
  "Click 'Check Strength' to securely analyze the password using advanced backend logic.",
  "Review the strength score and read the personalized feedback to improve it."
];
