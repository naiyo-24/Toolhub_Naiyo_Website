import React, { useState } from 'react';
import { FileText, Upload, Scissors, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumbers, setPageNumbers] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

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

  const handleSplit = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    if (!pageNumbers.trim()) {
      setError("Please enter page numbers to extract.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('page_numbers', pageNumbers);

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/split-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to split PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'split_document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred while splitting.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#9333EA] p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Scissors className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Split PDF</h2>
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
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-6 bg-neo-yellow border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center gap-4 overflow-hidden">
                <FileText className="w-8 h-8 flex-shrink-0" />
                <span className="font-bold text-lg truncate max-w-[200px] md:max-w-md">{file.name}</span>
              </div>
              <button 
                onClick={() => { setFile(null); setNumPages(undefined); }}
                className="px-4 py-2 bg-white border-2 border-black rounded-lg font-black hover:bg-red-100 transition-colors"
              >
                Change File
              </button>
            </div>
            
            <div className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_#000] overflow-hidden bg-gray-200">
              <div className="bg-black text-white p-3 font-black uppercase text-center">
                Document Preview
              </div>
              <div className="p-4 flex flex-col items-center gap-6 max-h-[500px] overflow-y-auto">
                <Document 
                  file={file} 
                  onLoadSuccess={onDocumentLoadSuccess} 
                  className="flex flex-col items-center gap-6 w-full"
                  loading={<div className="font-bold p-4">Loading preview...</div>}
                >
                  {numPages ? Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="bg-white p-2 border-4 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col">
                      <Page 
                        pageNumber={index + 1} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false} 
                        width={Math.min(window.innerWidth - 120, 500)}
                      />
                      <div className="text-center mt-3 mb-1 font-black text-lg">Page {index + 1}</div>
                    </div>
                  )) : null}
                </Document>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <label className="font-black uppercase text-lg block mb-2">Pages to Extract</label>
        <p className="text-sm font-bold text-gray-500 mb-2">Enter comma-separated page numbers (e.g., 1, 3, 5)</p>
        <input
          type="text"
          value={pageNumbers}
          onChange={(e) => setPageNumbers(e.target.value)}
          placeholder={numPages ? `e.g. 1, ${Math.min(3, numPages)}` : "1, 3, 5"}
          className="w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all"
        />
      </div>

      {/* Action Button */}
      <button
        onClick={handleSplit}
        disabled={!file || !pageNumbers.trim() || isProcessing}
        className="w-full bg-[#9333EA] hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-[#9333EA] text-white border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
      >
        {isProcessing ? (
          <><Loader2 className="w-6 h-6 animate-spin" /> Splitting...</>
        ) : (
          <><Scissors className="w-6 h-6" /> Split PDF</>
        )}
      </button>
    </div>
  );
}

export const splitPDFInstructions = [
  "Upload the PDF you want to split.",
  "Enter the specific page numbers you want to extract, separated by commas (e.g. 1, 3, 5).",
  "Click 'Split PDF' to download a new PDF containing only those pages."
];
