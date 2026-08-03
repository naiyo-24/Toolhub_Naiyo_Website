import React, { useState } from 'react';
import { FileText, Upload, Plus, Trash2, Download, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function DocPDFMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...selectedFiles]);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/merge-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to merge PDFs');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged_document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred while merging.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#9333EA] p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Merge PDF</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-4 border-black rounded-xl text-red-700 font-bold">
          {error}
        </div>
      )}

      {/* Upload Zone */}
      <div className="mb-8">
        <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-black rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 mb-3 text-black" />
            <p className="mb-2 text-xl font-black uppercase">Click or drag PDFs here</p>
            <p className="text-sm font-bold text-gray-500">Only PDF files are supported</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-8">
          <h3 className="font-black uppercase text-xl mb-4">Files to Merge ({files.length})</h3>
          <div className="space-y-3">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-neo-yellow px-3 py-1 border-2 border-black font-black rounded-lg text-sm">
                    {idx + 1}
                  </div>
                  <span className="font-bold truncate max-w-[200px] md:max-w-md">{file.name}</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="px-3 py-1 border-2 border-black rounded-lg font-black bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="px-3 py-1 border-2 border-black rounded-lg font-black bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button 
                    onClick={() => removeFile(idx)}
                    className="p-2 border-2 border-black rounded-lg bg-red-100 hover:bg-red-200 text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleMerge}
        disabled={files.length < 2 || isProcessing}
        className="w-full bg-[#9333EA] hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-[#9333EA] text-white border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
      >
        {isProcessing ? (
          <><Loader2 className="w-6 h-6 animate-spin" /> Merging...</>
        ) : (
          <><Download className="w-6 h-6" /> Merge PDFs</>
        )}
      </button>
    </div>
  );
}

export const docPDFMergeInstructions = [
  "Click to upload two or more PDF files.",
  "Use the ↑ and ↓ arrows to arrange the files in the correct order.",
  "Click 'Merge PDFs' to combine them into a single document.",
  "The merged file will download automatically."
];
