import React, { useState, useRef } from 'react';
import { Upload, Palette, Image as ImageIcon, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function QRGenerator() {
  const [text, setText] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateQR = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setQrImageUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-utility/qr/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qr_type: 'TEXT',
          data: text,
          fill_color: fgColor,
          back_color: bgColor,
          logo_base64: logoUrl, // Sends the base64 string
          border_color: borderColor,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR Code from server.');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setQrImageUrl(imageUrl);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* LEFT SETTINGS PANEL */}
      <div className="flex-1 bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-4">Settings</h3>
        
        <div className="mb-6">
          <label className="block text-xl font-black uppercase mb-2">1. Enter Text or URL</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-black uppercase mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" /> QR Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 rounded-xl border-4 border-black cursor-pointer p-0"
              />
              <span className="font-bold text-sm">{fgColor.toUpperCase()}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-xl border-4 border-black cursor-pointer p-0"
              />
              <span className="font-bold text-sm">{bgColor.toUpperCase()}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Border
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-10 h-10 rounded-xl border-4 border-black cursor-pointer p-0"
              />
              <span className="font-bold text-sm">{borderColor.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xl font-black uppercase mb-2 flex items-center gap-2">
            <ImageIcon className="w-6 h-6" /> 3. Add Logo (Optional)
          </label>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleLogoUpload}
            className="hidden" 
          />
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-neo-yellow border-4 border-black px-6 py-3 font-black uppercase rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" /> {logoUrl ? 'Change Logo' : 'Upload Logo'}
            </button>
            {logoUrl && (
              <button 
                onClick={removeLogo}
                className="text-red-500 font-bold uppercase hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={generateQR}
          disabled={isLoading || !text.trim()}
          className="w-full bg-neo-blue text-white font-black uppercase text-xl py-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generate QR Code'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* RIGHT PREVIEW PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center bg-neo-blue/10 border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        {qrImageUrl ? (
          <>
            <div className="bg-white border-4 border-black p-2 rounded-2xl shadow-[8px_8px_0px_0px_#000] mb-8 relative">
              <img src={qrImageUrl} alt="Generated QR" className="w-[300px] h-[300px] object-contain rounded-xl" />
            </div>
            <a 
              href={qrImageUrl} 
              download="toolhub-qr.png"
              className="bg-neo-blue text-white font-black uppercase text-xl px-12 py-5 border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all"
            >
              Download PNG
            </a>
          </>
        ) : (
          <div className="text-center opacity-40 p-12">
            <div className="w-64 h-64 border-4 border-dashed border-black rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <span className="font-black uppercase text-2xl">Preview</span>
            </div>
            <p className="font-bold text-xl">Enter text and click Generate to see your QR Code here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const qrGeneratorInstructions = [
  "Enter the text, link, or phone number you want to convert into the main input box.",
  "Customize your QR Code by picking a Foreground Color and Background Color.",
  "Click 'Upload Logo' to insert your brand logo directly into the center of the QR code.",
  "Click 'Generate QR Code' to fetch the customized image from our advanced API.",
  "Click the massive 'Download' button to save it as a high-quality PNG!"
];
