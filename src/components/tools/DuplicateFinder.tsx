import React, { useState, useRef } from 'react';
import { Upload, File, Loader2, Search, AlertCircle, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface DuplicateResult {
  duplicate_file: string;
  original_file: string;
}

interface AnalysisResult {
  total_files: number;
  duplicates_found: number;
  duplicates: DuplicateResult[];
}

export function DuplicateFinder() {
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
      const response = await fetch(`${API_BASE_URL}/file-tools/analyze/duplicates`, {
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

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Duplicate Finder</h2>
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
                <p className="font-bold text-lg mb-1">Upload files to scan</p>
                <p className="text-gray-500 font-bold text-sm">Select multiple files, and we'll find exact matches.</p>
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
              <h3 className="font-black text-xl uppercase">Files Queued: {files.length}</h3>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-neo-green hover:bg-green-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Scanning Files...
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  Find Duplicates
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
                <p className="font-bold text-gray-500 uppercase text-sm mb-1">Total Scanned</p>
                <p className="font-black text-4xl">{result.total_files}</p>
              </div>
              <div className={`${result.duplicates_found > 0 ? 'bg-neo-pink text-white' : 'bg-neo-green'} border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] text-center`}>
                <p className="font-bold uppercase text-sm mb-1">Duplicates Found</p>
                <p className="font-black text-4xl">{result.duplicates_found}</p>
              </div>
            </div>

            {result.duplicates_found > 0 ? (
              <div className="space-y-4">
                <h3 className="font-black text-xl uppercase bg-neo-yellow border-4 border-black px-4 py-2 inline-block rounded-xl shadow-[4px_4px_0px_0px_#000]">
                  Duplicate Details
                </h3>
                <div className="space-y-3">
                  {result.duplicates.map((dup, idx) => (
                    <div key={idx} className="bg-gray-50 border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-neo-pink shrink-0 mt-1" />
                        <div>
                          <p className="font-black text-lg break-words text-neo-pink">{dup.duplicate_file}</p>
                          <p className="font-bold text-sm text-gray-600 mt-1 break-words">
                            Identical to: <span className="text-black">{dup.original_file}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-4 border-black p-8 text-center rounded-xl shadow-[4px_4px_0px_0px_#000]">
                <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-black text-2xl text-green-700 uppercase mb-2">Clean! No Duplicates</h3>
                <p className="font-bold text-gray-600">All {result.total_files} files are completely unique.</p>
              </div>
            )}

            <button
              onClick={reset}
              className="w-full bg-black text-white hover:bg-gray-800 border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all uppercase"
            >
              Scan New Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const duplicateFinderInstructions = [
  "Select a batch of files you want to check.",
  "Click 'Find Duplicates' to let the system analyze them.",
  "We compare the actual contents (hashes) of the files, not just their names.",
  "Review the results to see which files are exact copies of others!"
];
