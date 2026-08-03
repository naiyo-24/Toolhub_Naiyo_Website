import React, { useState } from 'react';
import { Wifi, Loader2, Download } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function WiFiQRGenerator() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!ssid) return;
    setIsLoading(true);
    setError(null);
    setQrUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/internet-tools/qr/wifi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ssid, 
          password: encryption === 'nopass' ? '' : password, 
          encryption 
        })
      });
      if (!response.ok) throw new Error('Failed to generate WiFi QR code');
      
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
          <Wifi className="w-8 h-8" />
          WiFi QR Generator
        </h3>
        
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Network Name (SSID)</label>
            <input 
              type="text" 
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="e.g., Home_Network_5G"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-lg font-black uppercase mb-2">Security / Encryption</label>
            <select
              value={encryption}
              onChange={(e) => setEncryption(e.target.value as any)}
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            >
              <option value="WPA">WPA/WPA2/WPA3 (Standard)</option>
              <option value="WEP">WEP (Older)</option>
              <option value="nopass">None (Open Network)</option>
            </select>
          </div>

          {encryption !== 'nopass' && (
            <div>
              <label className="block text-lg font-black uppercase mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="WiFi Password"
                className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all font-mono"
              />
            </div>
          )}
        </div>

        <button 
          onClick={generate}
          disabled={isLoading || !ssid}
          className="w-full bg-neo-purple text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generate QR Code'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {qrUrl && (
          <div className="mt-8 bg-black border-4 border-black p-8 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 flex flex-col items-center">
            <h4 className="text-xl font-black uppercase mb-6 text-neo-purple text-center">Scan to Connect</h4>
            <div className="bg-white p-4 rounded-xl border-4 border-black">
              <img src={qrUrl} alt="WiFi QR Code" className="w-64 h-64" />
            </div>
            
            <a 
              href={qrUrl}
              download={`wifi-qr-${ssid}.png`}
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

export const wifiQrGeneratorInstructions = [
  "Enter the exact SSID (name) of your WiFi network.",
  "Select the security type (usually WPA/WPA2) and type the password.",
  "Click generate to instantly create a QR code. Guests can scan this to join your network without typing the password!"
];
