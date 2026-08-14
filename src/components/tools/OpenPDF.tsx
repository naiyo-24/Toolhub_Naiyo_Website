import React, { useState, useRef } from 'react';
import { Upload, BookOpen, AlertCircle, X, Download } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const openPdfInstructions = [
  "Click to upload the PDF document you want to view.",
  "Your document will securely open in our built-in offline viewer.",
  "You can read, zoom, and print directly from this page.",
  "No files are uploaded to our servers; viewing is 100% private."
];

export function OpenPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState<number>();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a valid PDF file.');
        return;
      }
      setFile(selectedFile);
      setPdfUrl(URL.createObjectURL(selectedFile));
      setError('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setFile(null);
    setPdfUrl(null);
    setNumPages(undefined);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (file) {
    return (
      <div className="max-w-6xl mx-auto bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000] overflow-hidden flex flex-col" style={{ height: '85vh' }}>
        <div className="bg-neo-yellow border-b-4 border-black p-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3 truncate pr-4">
            <BookOpen className="w-6 h-6 shrink-0" />
            <h2 className="font-black uppercase truncate">{file.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={pdfUrl!} 
              target="_blank" 
              rel="noreferrer"
              className="bg-white border-2 border-black p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              title="Download / Open Native"
            >
              <Download className="w-5 h-5 font-bold" />
            </a>
            <button 
              onClick={handleClose}
              className="bg-white border-2 border-black p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors shrink-0"
              title="Close Viewer"
            >
              <X className="w-5 h-5 font-bold" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-200 relative overflow-y-auto flex flex-col items-center py-8 px-4 gap-8">
          <Document 
            file={file} 
            onLoadSuccess={onDocumentLoadSuccess} 
            className="flex flex-col items-center gap-8 w-full"
            loading={
              <div className="text-xl font-bold p-8 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl">
                Loading PDF...
              </div>
            }
            error={
              <div className="text-xl font-bold p-8 bg-red-100 border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl text-red-600">
                Failed to load PDF.
              </div>
            }
          >
            {numPages ? Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="bg-white p-2 border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col">
                <Page 
                  pageNumber={index + 1} 
                  renderTextLayer={true} 
                  renderAnnotationLayer={true} 
                  width={Math.min(window.innerWidth - 80, 800)}
                />
                <div className="text-center mt-4 mb-2 font-bold text-gray-500">Page {index + 1} of {numPages}</div>
              </div>
            )) : null}
          </Document>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-yellow p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <BookOpen className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase">Open PDF Viewer</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-4 border-black rounded-xl text-red-700 font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-black rounded-2xl bg-gray-50 hover:bg-neo-yellow/20 cursor-pointer transition-colors group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 group-hover:scale-105 transition-transform">
            <Upload className="w-16 h-16 mb-4 text-black" />
            <p className="mb-2 text-2xl font-black uppercase text-center px-4">Click to Open a PDF</p>
            <p className="text-gray-500 font-bold">100% Offline & Private Viewer</p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept=".pdf"
            onChange={handleFileSelect}
          />
        </label>
      </div>
    </div>
  );
}
