import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Download, FileJson, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export const pdfToTextInstructions = [
  "Click to upload the PDF document you want to extract text from.",
  "Click 'Extract Text' to process the file.",
  "View the extracted text directly in the browser or download it as a .txt file."
];

export function PDFToText() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedText, setExtractedText] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
      setExtractedText(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExtract = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError('');
    setExtractedText(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/pdf-to-text`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text from PDF');
      }

      const data = await response.json();
      setExtractedText(data.text || data.extracted_text || 'No text found in this PDF.');
    } catch (err: any) {
      setError(err.message || 'An error occurred while extracting text.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_${file?.name.replace('.pdf', '') || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <FileJson className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">PDF to Text</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-4 border-black rounded-xl text-red-700 font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="mb-8">
        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-black rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <Upload className="w-10 h-10 md:w-12 md:h-12 mb-3 text-black shrink-0" />
              <p className="mb-2 text-base md:text-xl font-black uppercase leading-tight">Click or drag a PDF here</p>
              <p className="text-xs md:text-sm text-gray-500 font-bold">Only PDF files supported</p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".pdf"
              onChange={handleFileSelect}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 border-4 border-black rounded-xl bg-neo-yellow/20">
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-2 sm:mr-4">
              <FileText className="w-8 h-8 text-neo-blue shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-bold truncate" title={file.name}>{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setExtractedText(null); }}
              className="px-4 py-2 bg-white border-2 border-black rounded-lg font-bold hover:bg-gray-100 shrink-0"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {file && !extractedText && (
        <div className="animate-in slide-in-from-bottom-4">
          <button 
            onClick={handleExtract}
            disabled={isLoading}
            className="w-full bg-neo-blue text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Extracting Text...
              </>
            ) : (
              <>
                <FileJson className="w-6 h-6" /> Extract Text
              </>
            )}
          </button>
        </div>
      )}

      {extractedText && (
        <div className="mt-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-black uppercase">Extracted Text</h4>
            <button 
              onClick={handleDownload}
              className="bg-neo-blue text-white border-2 border-black px-4 py-2 font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download .txt
            </button>
          </div>
          
          <div className="bg-gray-50 border-4 border-black p-6 rounded-xl max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
              {extractedText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
