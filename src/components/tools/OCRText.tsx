import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, FileText, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function OCRText() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(window.URL.createObjectURL(selectedFile));
      setError('');
      setExtractedText('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsLoading(true);
    setError('');
    setExtractedText('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/ocr`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text from image');
      }

      const data = await response.json();
      setExtractedText(data.extracted_text);
    } catch (err: any) {
      setError(err.message || 'An error occurred during extraction.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setExtractedText('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">OCR Text Extraction</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {!previewUrl ? (
            <div 
              className={`border-4 border-dashed border-black rounded-xl p-12 text-center cursor-pointer transition-colors h-64 flex flex-col justify-center ${file ? 'bg-neo-blue/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-16 h-16 text-gray-400" />
                <div>
                  <p className="font-bold text-lg mb-1">Upload an Image</p>
                  <p className="text-gray-500 font-bold text-sm">We'll scan it for text</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000] relative group">
              <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border-4 border-black px-6 py-2 rounded-xl font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                >
                  Change Image
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
              {error}
            </div>
          )}

          {file && !extractedText && (
            <button
              onClick={handleExtract}
              disabled={isLoading}
              className="w-full bg-neo-yellow hover:bg-yellow-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Scanning Image...
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6" />
                  Extract Text
                </>
              )}
            </button>
          )}

          {extractedText && (
            <button
              onClick={reset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 uppercase"
            >
              Scan New Image
            </button>
          )}
        </div>

        <div>
          <div className="h-full border-4 border-black rounded-xl bg-gray-50 flex flex-col shadow-[4px_4px_0px_0px_#000]">
            <div className="bg-black text-white p-4 font-black uppercase flex justify-between items-center">
              <span>Extracted Text</span>
              {extractedText && (
                <button
                  onClick={copyToClipboard}
                  className="bg-white text-black px-4 py-1 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              )}
            </div>
            <div className="p-4 flex-1">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 animate-pulse">
                  <FileText className="w-16 h-16 mb-4" />
                  <p className="font-bold">Reading text from image...</p>
                </div>
              ) : extractedText ? (
                <textarea
                  value={extractedText}
                  readOnly
                  className="w-full h-full min-h-[200px] bg-transparent resize-none font-bold outline-none"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p className="font-bold text-center">Your extracted text will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ocrTextInstructions = [
  "Upload an image containing text (like a screenshot, document scan, or photo).",
  "Click 'Extract Text' to run our OCR engine.",
  "The recognized text will appear in the box on the right.",
  "You can copy it to your clipboard with one click!"
];
