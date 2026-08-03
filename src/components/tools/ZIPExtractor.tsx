import React, { useState, useRef } from 'react';
import { Upload, File, Loader2, Download, Archive, X } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface ExtractedFile {
  filename: string;
  size_bytes: number;
}

export function ZIPExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedList, setExtractedList] = useState<ExtractedFile[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setExtractedList(null);
      setError('');
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/zip/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract ZIP file');
      }

      const data = await response.json();
      setExtractedList(data.extracted_files);
    } catch (err: any) {
      setError(err.message || 'An error occurred during extraction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = async (targetFile: string) => {
    if (!file) return;
    setDownloadingFile(targetFile);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_file', targetFile);

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/zip/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Download failed: ${errText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Get the actual filename without path
      a.download = targetFile.split('/').pop() || targetFile;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to download file.');
    } finally {
      setDownloadingFile(null);
    }
  };

  const reset = () => {
    setFile(null);
    setExtractedList(null);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-neo-purple p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            <Archive className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black uppercase">ZIP Extractor</h2>
        </div>
        {file && (
          <button 
            onClick={reset}
            className="p-2 bg-neo-pink border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_#000] transition-all"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {!extractedList ? (
          <>
            <div 
              className={`border-4 border-dashed border-black rounded-xl p-12 text-center cursor-pointer transition-colors ${file ? 'bg-neo-purple/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".zip"
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  <Archive className="w-16 h-16 text-neo-purple" />
                  <div>
                    <p className="font-bold text-lg">{file.name}</p>
                    <p className="text-gray-500 font-bold text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-16 h-16 text-gray-400" />
                  <div>
                    <p className="font-bold text-lg mb-1">Upload a .ZIP file</p>
                    <p className="text-gray-500 font-bold text-sm">We'll peek inside to let you extract files.</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
                {error}
              </div>
            )}

            {file && (
              <button
                onClick={handleExtract}
                disabled={isLoading}
                className="w-full bg-neo-yellow hover:bg-yellow-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Reading ZIP...
                  </>
                ) : (
                  <>
                    <Archive className="w-6 h-6" />
                    List Contents
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="font-black text-xl uppercase mb-4 px-4 py-2 bg-neo-yellow border-4 border-black inline-block rounded-xl shadow-[4px_4px_0px_0px_#000]">
              Files in Archive ({extractedList.length})
            </h3>
            
            <div className="bg-gray-50 border-4 border-black rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-neo-blue text-white sticky top-0">
                  <tr>
                    <th className="p-4 font-black uppercase border-b-4 border-black border-r-4">Filename</th>
                    <th className="p-4 font-black uppercase border-b-4 border-black border-r-4 w-32">Size</th>
                    <th className="p-4 font-black uppercase border-b-4 border-black w-32">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {extractedList.map((f, i) => (
                    <tr key={i} className="border-b-4 border-black last:border-b-0 hover:bg-gray-200 transition-colors">
                      <td className="p-4 font-bold border-r-4 border-black break-words">{f.filename}</td>
                      <td className="p-4 font-bold border-r-4 border-black whitespace-nowrap text-sm text-gray-700">
                        {(f.size_bytes / 1024).toFixed(1)} KB
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDownloadFile(f.filename)}
                          disabled={downloadingFile === f.filename}
                          className="bg-neo-green hover:bg-green-400 text-black border-4 border-black font-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center w-full"
                        >
                          {downloadingFile === f.filename ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const zipExtractorInstructions = [
  "Upload a valid .zip archive file.",
  "Click 'List Contents' to see all files inside the zip.",
  "Browse the files and click the Download button next to any file to extract it directly.",
  "You don't need to extract the whole zip, just pick what you need!"
];
