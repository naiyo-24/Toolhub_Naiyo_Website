import React, { useState } from 'react';
import { QrCode, Loader2, Download } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function UPIQRGenerator() {
  const [vpa, setVpa] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!vpa || !name) return;
    setIsLoading(true);
    setError(null);
    setQrUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/qr/upi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vpa, 
          name, 
          amount: amount ? Number(amount) : undefined 
        })
      });
      if (!response.ok) throw new Error('Failed to generate UPI QR code');
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setQrUrl(objectUrl);
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
          <QrCode className="w-8 h-8" />
          UPI QR Generator
        </h3>
        
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <label className="block text-lg font-black uppercase mb-2">UPI ID (VPA)</label>
            <input 
              type="text" 
              value={vpa}
              onChange={(e) => setVpa(e.target.value)}
              placeholder="e.g., john@upi or 9876543210@ybl"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-lg font-black uppercase mb-2">Payee Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-lg font-black uppercase mb-2">Preset Amount (Optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-500 text-xl">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 500"
                className="w-full bg-gray-50 border-4 border-black p-4 pl-10 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={generate}
          disabled={isLoading || !vpa || !name}
          className="w-full bg-neo-green border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generate UPI Code'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {qrUrl && (
          <div className="mt-8 bg-black border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 flex flex-col items-center">
            <h4 className="text-xl font-black uppercase mb-6 text-neo-green text-center">Scan & Pay via GPay/PhonePe/Paytm</h4>
            <div className="bg-white p-4 rounded-xl border-4 border-black relative">
              {amount && (
                <div className="absolute -top-4 -right-4 bg-neo-green text-black font-black border-4 border-black px-3 py-1 rounded-full rotate-12">
                  ₹{amount}
                </div>
              )}
              <img src={qrUrl} alt="UPI QR Code" className="w-64 h-64" />
            </div>
            
            <a 
              href={qrUrl}
              download={`upi-qr-${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`}
              className="mt-6 bg-white text-black border-4 border-black px-6 py-3 font-black uppercase rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export const upiQrGeneratorInstructions = [
  "Enter your valid UPI ID (e.g. username@okaxis) and exactly how your name appears in the bank.",
  "Optionally, set a fixed amount. If someone scans this code, the amount will be pre-filled in their app.",
  "Download the generated QR code and print it or share it with customers."
];
