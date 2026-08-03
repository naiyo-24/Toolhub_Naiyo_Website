import React, { useState, useRef } from 'react';
import { Upload, PieChart, Loader2, Database } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface FileTypeInfo {
  count: number;
  size_bytes: number;
}

interface AnalysisResult {
  total_files: number;
  total_size_bytes: number;
  breakdown: Record<string, FileTypeInfo>;
}

export function StorageAnalyzer() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      setError('');
      setResult(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    
    const formData = new FormData();
    files.forEach(f => {
      formData.append('files', f);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/analyze/storage`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze files');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError('');
  };

  // Sort breakdown by size descending
  const sortedBreakdown = result ? Object.entries(result.breakdown).sort((a, b) => b[1].size_bytes - a[1].size_bytes) : [];

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <PieChart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Storage Analyzer</h2>
      </div>

      <div className="space-y-6">
        {!result && (
          <div 
            className="border-4 border-dashed border-black rounded-xl p-12 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-neo-blue/10"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              multiple
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
            />
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-16 h-16 text-gray-400" />
              <div>
                <p className="font-bold text-lg mb-1">Select files to analyze</p>
                <p className="text-gray-500 font-bold text-sm">See which file types are taking up the most space.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
            {error}
          </div>
        )}

        {files.length > 0 && !result && (
          <div className="space-y-4">
            <div className="bg-neo-yellow border-4 border-black px-4 py-2 inline-block rounded-xl shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-xl uppercase">Files Selected: {files.length}</h3>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-neo-blue hover:bg-blue-500 text-white border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Storage...
                </>
              ) : (
                <>
                  <Database className="w-6 h-6" />
                  Analyze Storage
                </>
              )}
            </button>
            <button
              onClick={reset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-black border-4 border-black font-black text-lg py-2 px-8 rounded-xl transition-colors uppercase"
            >
              Clear Selection
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] text-center">
                <p className="font-bold text-gray-500 uppercase text-sm mb-1">Total Files</p>
                <p className="font-black text-4xl">{result.total_files}</p>
              </div>
              <div className="bg-neo-yellow border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] text-center">
                <p className="font-bold uppercase text-sm mb-1 text-black">Total Size</p>
                <p className="font-black text-4xl">{(result.total_size_bytes / 1024 / 1024).toFixed(2)} <span className="text-xl">MB</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-xl uppercase bg-white border-4 border-black px-4 py-2 inline-block rounded-xl shadow-[4px_4px_0px_0px_#000]">
                Storage Breakdown
              </h3>
              <div className="space-y-3">
                {sortedBreakdown.map(([ext, info]) => {
                  const percentage = (info.size_bytes / result.total_size_bytes) * 100;
                  return (
                    <div key={ext} className="bg-gray-50 border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg uppercase bg-black text-white px-2 py-0.5 rounded-lg border-2 border-black">{ext}</span>
                          <span className="font-bold text-gray-500">{info.count} files</span>
                        </div>
                        <span className="font-black text-lg">{(info.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      
                      {/* Brutalist Progress Bar */}
                      <div className="w-full bg-white border-4 border-black rounded-full h-6 overflow-hidden">
                        <div 
                          className="bg-neo-blue h-full border-r-4 border-black"
                          style={{ width: `${Math.max(percentage, 2)}%` }} // Minimum 2% so it's visible
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full bg-black text-white hover:bg-gray-800 border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all uppercase"
            >
              Analyze New Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const storageAnalyzerInstructions = [
  "Select a folder or a batch of files you want to analyze.",
  "Click 'Analyze Storage' to calculate their sizes.",
  "View a detailed breakdown of which file extensions are taking up the most space.",
  "Identify large file types instantly using the visual bar charts!"
];
