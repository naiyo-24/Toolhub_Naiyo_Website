import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Download, Search } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function WebScreenshot() {
  const [url, setUrl] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setScreenshotUrl(null);

    let submitUrl = url;
    if (!submitUrl.startsWith('http')) {
      submitUrl = 'https://' + submitUrl;
    }

    try {
      // We pass the URL as a query param to the GET endpoint.
      // The backend returns an image stream.
      const endpoint = `${API_BASE_URL}/internet-tools/screenshot?url=${encodeURIComponent(submitUrl)}`;
      
      const response = await fetch(endpoint, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to capture screenshot. The website might block automated requests.');
      }
      
      // We can create an object URL from the blob
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setScreenshotUrl(objectUrl);

    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <ImageIcon className="w-8 h-8" />
          Web Screenshot
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-black uppercase mb-2">Website URL</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="w-full flex-1 bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white transition-all"
            />
            <button 
              onClick={capture}
              disabled={isLoading || !url}
              className="bg-neo-blue text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap gap-2"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              {isLoading ? 'Capturing...' : 'Capture'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {screenshotUrl && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 flex flex-col items-center">
            <div className="border-8 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_#000] bg-gray-200 relative group">
              <div className="bg-black text-white p-2 flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-mono text-sm ml-2 truncate opacity-70">{url}</span>
              </div>
              <img src={screenshotUrl} alt="Website Screenshot" className="w-full object-cover min-h-[300px]" />
            </div>

            <a 
              href={screenshotUrl}
              download={`screenshot-${url.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`}
              className="mt-8 bg-neo-pink text-black border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" />
              Download Full Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export const webScreenshotInstructions = [
  "Enter the URL of any public website.",
  "Click 'Capture' to instruct our servers to visit the page and take a high-quality screenshot.",
  "Wait a few seconds for the image to generate, then preview or download it directly to your device."
];
