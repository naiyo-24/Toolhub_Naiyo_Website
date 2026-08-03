import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Download, Settings } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [targetSize, setTargetSize] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
      setCompressedUrl(null);
      setCompressedSize(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsLoading(true);
    setError('');
    setCompressedUrl(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality.toString());
    if (targetSize && !isNaN(Number(targetSize))) {
      formData.append('target_size_kb', targetSize);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/image/compress`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to compress image');
      }

      const blob = await response.blob();
      setCompressedSize(blob.size);
      
      const url = window.URL.createObjectURL(blob);
      setCompressedUrl(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred during compression.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    
    const a = document.createElement('a');
    a.href = compressedUrl;
    
    // Create new filename
    const nameParts = file.name.split('.');
    const ext = nameParts.pop();
    a.download = `${nameParts.join('.')}_compressed.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-pink p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <ImageIcon className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase">Compress Image</h2>
      </div>

      <div className="space-y-6">
        {!compressedUrl ? (
          <>
            <div 
              className={`border-4 border-dashed border-black rounded-xl p-12 text-center cursor-pointer transition-colors ${file ? 'bg-neo-pink/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  <ImageIcon className="w-16 h-16 text-neo-pink" />
                  <div>
                    <p className="font-bold text-lg break-words">{file.name}</p>
                    <p className="text-gray-500 font-bold text-sm">Original: {(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-16 h-16 text-gray-400" />
                  <div>
                    <p className="font-bold text-lg mb-1">Click to select an Image</p>
                    <p className="text-gray-500 font-bold text-sm">JPG, PNG, WebP supported</p>
                  </div>
                </div>
              )}
            </div>

            {file && (
              <div className="bg-gray-50 border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-6 h-6" />
                  <h3 className="font-black text-xl uppercase">Compression Settings</h3>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-bold">Quality Level: {quality}%</label>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-neo-pink"
                  />
                  <div className="flex justify-between text-xs font-bold text-gray-500 mt-1">
                    <span>Smallest Size</span>
                    <span>Best Quality</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-2">Target Size (KB) <span className="text-gray-500 font-normal">(Optional)</span></label>
                  <input
                    type="number"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-pink/50"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
                {error}
              </div>
            )}

            {file && (
              <button
                onClick={handleCompress}
                disabled={isLoading}
                className="w-full bg-neo-pink hover:bg-pink-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6" />
                    Compress Image
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border-4 border-black p-6 rounded-xl text-center shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-2xl text-green-700 uppercase mb-4">Compression Success!</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white border-2 border-black p-3 rounded-lg">
                  <p className="text-gray-500 font-bold text-xs uppercase mb-1">Original Size</p>
                  <p className="font-black text-xl">{(file!.size / 1024).toFixed(2)} KB</p>
                </div>
                <div className="bg-neo-green border-2 border-black p-3 rounded-lg">
                  <p className="text-black font-bold text-xs uppercase mb-1">New Size</p>
                  <p className="font-black text-xl">{(compressedSize! / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              
              <div className="bg-neo-yellow border-2 border-black p-2 rounded-lg font-black inline-block px-4">
                Saved {((1 - compressedSize! / file!.size) * 100).toFixed(1)}% space
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-neo-green hover:bg-green-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all flex items-center justify-center gap-3 uppercase"
            >
              <Download className="w-6 h-6" />
              Download Compressed Image
            </button>
            
            <button
              onClick={reset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-black border-4 border-black font-black text-lg py-3 px-8 rounded-xl transition-colors uppercase mt-2"
            >
              Compress Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const compressImageInstructions = [
  "Upload the image you want to compress.",
  "Adjust the Quality slider (lower means smaller file size but lower quality).",
  "Optionally specify an exact target size in KB.",
  "Click 'Compress Image' and download your perfectly optimized image!"
];
