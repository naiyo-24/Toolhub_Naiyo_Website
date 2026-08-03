import React, { useState } from 'react';
import { FileText, Upload, Download, Loader2, Minimize2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function DocPDFCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'quality' | 'target'>('quality');
  const [quality, setQuality] = useState(50);
  const [targetSize, setTargetSize] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type !== 'application/pdf') {
        setError('Please select a valid PDF file.');
        return;
      }
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (mode === 'quality') {
      formData.append('quality', quality.toString());
    } else {
      if (!targetSize || isNaN(Number(targetSize)) || Number(targetSize) <= 0) {
        setError("Please enter a valid target size in KB.");
        setIsProcessing(false);
        return;
      }
      formData.append('target_size_kb', targetSize);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/compress-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to compress PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed_document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred while compressing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#9333EA] p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Minimize2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Compress PDF</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-4 border-black rounded-xl text-red-700 font-bold">
          {error}
        </div>
      )}

      {/* Upload Zone */}
      <div className="mb-8">
        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-black rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-3 text-black" />
              <p className="mb-2 text-xl font-black uppercase">Click or drag a PDF here</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-6 bg-neo-yellow border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center gap-4 overflow-hidden">
              <FileText className="w-8 h-8 flex-shrink-0" />
              <span className="font-bold text-lg truncate max-w-[200px] md:max-w-md">{file.name}</span>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="px-4 py-2 bg-white border-2 border-black rounded-lg font-black hover:bg-red-100 transition-colors"
            >
              Change File
            </button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('quality')}
            className={`flex-1 py-3 px-4 rounded-xl border-4 border-black font-black uppercase transition-all ${mode === 'quality' ? 'bg-[#9333EA] text-white shadow-[4px_4px_0px_0px_#000] translate-x-0 translate-y-0' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            Adjust Quality
          </button>
          <button
            onClick={() => setMode('target')}
            className={`flex-1 py-3 px-4 rounded-xl border-4 border-black font-black uppercase transition-all ${mode === 'target' ? 'bg-neo-yellow text-black shadow-[4px_4px_0px_0px_#000] translate-x-0 translate-y-0' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            Target Size
          </button>
        </div>

        {mode === 'quality' ? (
          <div>
            <label className="font-black uppercase text-lg block mb-4 flex justify-between">
              <span>Compression Quality</span>
              <span className="text-[#9333EA]">{quality}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="90"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black accent-[#9333EA]"
            />
            <div className="flex justify-between mt-2 text-sm font-bold text-gray-500">
              <span>Smaller File (Low Quality)</span>
              <span>Larger File (High Quality)</span>
            </div>
          </div>
        ) : (
          <div>
            <label className="font-black uppercase text-lg block mb-2">
              Target Size (KB)
            </label>
            <p className="text-sm font-bold text-gray-600 mb-4">
              Enter the maximum file size you need (e.g. 500 for 500KB). The tool will attempt to compress the PDF to fit under this size.
            </p>
            <input
              type="number"
              placeholder="e.g. 500"
              value={targetSize}
              onChange={(e) => setTargetSize(e.target.value)}
              className="w-full border-4 border-black rounded-xl p-4 font-black text-lg focus:outline-none focus:ring-4 focus:ring-neo-yellow shadow-[4px_4px_0px_0px_#000]"
            />
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleCompress}
        disabled={!file || isProcessing}
        className="w-full bg-[#9333EA] hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-[#9333EA] text-white border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
      >
        {isProcessing ? (
          <><Loader2 className="w-6 h-6 animate-spin" /> Compressing...</>
        ) : (
          <><Minimize2 className="w-6 h-6" /> Compress PDF</>
        )}
      </button>
    </div>
  );
}

export const docPDFCompressInstructions = [
  "Upload the PDF you want to compress.",
  "Choose between adjusting the 'Compression Quality' manually or entering a specific 'Target Size (KB)'.",
  "Click 'Compress PDF' to process and download the smaller file."
];
