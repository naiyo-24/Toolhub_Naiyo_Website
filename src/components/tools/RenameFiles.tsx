import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Edit3, X, Archive } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface FileItem {
  originalFile: File;
  newName: string;
}

export function RenameFiles() {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems = Array.from(e.target.files).map(f => ({
        originalFile: f,
        newName: f.name
      }));
      setFileItems(prev => [...prev, ...newItems]);
      setError('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateFileName = (index: number, newName: string) => {
    setFileItems(prev => {
      const copy = [...prev];
      copy[index].newName = newName;
      return copy;
    });
  };

  const removeFile = (index: number) => {
    setFileItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleRenameAndDownload = async () => {
    if (fileItems.length === 0) return;
    
    // Basic validation
    for (const item of fileItems) {
      if (!item.newName.trim()) {
        setError('All files must have a valid name.');
        return;
      }
    }

    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    
    fileItems.forEach(item => {
      // Create a new File object with the updated name
      // This allows us to send it to the zip creator with the new name
      const renamedFile = new File([item.originalFile], item.newName, {
        type: item.originalFile.type,
      });
      formData.append('files', renamedFile);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/zip/create`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create ZIP file with renamed files');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'renamed_files.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      setFileItems([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-pink p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Edit3 className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase">Batch Rename Files</h2>
      </div>

      <div className="space-y-6">
        <div 
          className="border-4 border-dashed border-black rounded-xl p-12 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-neo-pink/10"
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
              <p className="font-bold text-lg mb-1">Select files to rename</p>
              <p className="text-gray-500 font-bold text-sm">We'll package them in a ZIP file after renaming.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
            {error}
          </div>
        )}

        {fileItems.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-black text-xl uppercase px-4 py-2 bg-neo-yellow border-4 border-black inline-block rounded-xl shadow-[4px_4px_0px_0px_#000]">
              Files ({fileItems.length})
            </h3>
            
            <div className="space-y-3">
              {fileItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                  <FileText className="w-6 h-6 shrink-0" />
                  
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                    <div className="text-sm font-bold text-gray-500 md:w-1/3 truncate">
                      {item.originalFile.name}
                    </div>
                    <div className="hidden md:block">➔</div>
                    <input
                      type="text"
                      value={item.newName}
                      onChange={(e) => updateFileName(i, e.target.value)}
                      className="flex-1 border-2 border-black rounded-lg p-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-pink"
                      placeholder="New filename"
                    />
                  </div>

                  <button
                    onClick={() => removeFile(i)}
                    className="shrink-0 bg-neo-pink hover:bg-pink-400 border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_#000] transition-transform hover:translate-y-[1px]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleRenameAndDownload}
              disabled={isLoading}
              className="w-full bg-neo-green hover:bg-green-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Archive className="w-6 h-6" />
                  Download Renamed ZIP
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const renameFilesInstructions = [
  "Select multiple files from your computer.",
  "Edit the names in the input boxes.",
  "Click 'Download Renamed ZIP' when you're done.",
  "You'll get a single ZIP archive containing all your renamed files!"
];
