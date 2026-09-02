import React, { useState } from 'react';
import { FileText, Upload, Download, Loader2, FileType2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function CSVToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a valid CSV file (.csv).');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/csv-to-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to convert CSV to PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred while converting.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#EF4444] p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <FileType2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">CSV to PDF</h2>
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
              <p className="mb-2 text-xl font-black uppercase">Click or drag CSV here</p>
              <p className="text-sm font-bold text-gray-500">Supports .CSV files</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv,text/csv"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-6 bg-neo-pink border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
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

      {/* Action Button */}
      <button
        onClick={handleConvert}
        disabled={!file || isProcessing}
        className="w-full bg-[#EF4444] hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-[#EF4444] text-white border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
      >
        {isProcessing ? (
          <><Loader2 className="w-6 h-6 animate-spin" /> Converting...</>
        ) : (
          <><Download className="w-6 h-6" /> Convert to PDF</>
        )}
      </button>
    </div>
  );
}

export const csvToPDFInstructions = [
  "Upload a CSV file.",
  "Click 'Convert to PDF'.",
  "The file will be securely processed and downloaded as a PDF file."
];
