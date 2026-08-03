import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Download, Layers, X, ArrowDown, ArrowUp } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      setError('');
      setMergedUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }
    setIsLoading(true);
    setError('');
    setMergedUrl(null);
    
    const formData = new FormData();
    files.forEach(f => {
      formData.append('files', f);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/pdf/merge`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to merge PDFs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred during merge.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!mergedUrl) return;
    const a = document.createElement('a');
    a.href = mergedUrl;
    a.download = 'merged_document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFiles([]);
    setMergedUrl(null);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-purple p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Merge PDF</h2>
      </div>

      <div className="space-y-6">
        {!mergedUrl ? (
          <>
            <div 
              className="border-4 border-dashed border-black rounded-xl p-12 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-neo-purple/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple
                accept="application/pdf"
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-16 h-16 text-gray-400" />
                <div>
                  <p className="font-bold text-lg mb-1">Click to select PDF files</p>
                  <p className="text-gray-500 font-bold text-sm">Select multiple PDFs to merge them into one.</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
                {error}
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-4">
                <div className="bg-neo-yellow border-4 border-black px-4 py-2 inline-block rounded-xl shadow-[4px_4px_0px_0px_#000]">
                  <h3 className="font-black text-xl uppercase">Files to Merge ({files.length})</h3>
                </div>
                
                <div className="space-y-3">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                      <FileText className="w-6 h-6 shrink-0 text-neo-purple" />
                      
                      <div className="flex-1 font-bold truncate">
                        {f.name}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => moveUp(i)}
                          disabled={i === 0}
                          className="bg-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 transition-transform hover:translate-y-[1px]"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(i)}
                          disabled={i === files.length - 1}
                          className="bg-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 transition-transform hover:translate-y-[1px]"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFile(i)}
                          className="bg-neo-pink hover:bg-pink-400 border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_#000] transition-transform hover:translate-y-[1px]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleMerge}
                  disabled={isLoading || files.length < 2}
                  className="w-full bg-neo-purple hover:bg-purple-600 text-white border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase mt-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      <Layers className="w-6 h-6" />
                      Merge PDFs
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border-4 border-black p-6 rounded-xl text-center shadow-[4px_4px_0px_0px_#000]">
              <Layers className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-black text-2xl text-green-700 uppercase mb-2">Merge Complete!</h3>
              <p className="font-bold text-gray-600">Successfully merged {files.length} documents into one.</p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-neo-green hover:bg-green-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all flex items-center justify-center gap-3 uppercase"
            >
              <Download className="w-6 h-6" />
              Download Merged PDF
            </button>
            
            <button
              onClick={reset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-black border-4 border-black font-black text-lg py-3 px-8 rounded-xl transition-colors uppercase mt-2"
            >
              Merge More Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const mergePdfInstructions = [
  "Select 2 or more PDF files you want to combine.",
  "Use the Up and Down arrows to rearrange the order of the documents.",
  "The file at the top will be the first pages of the new PDF.",
  "Click 'Merge PDFs' and download your combined document!"
];
