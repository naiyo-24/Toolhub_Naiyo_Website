import React, { useState, useRef } from 'react';
import { Upload, File, Loader2, Archive, X, FolderPlus } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function ZIPCreator() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      setError('');
    }
    // reset input so the same files can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateZip = async () => {
    if (files.length === 0) return;
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    files.forEach(f => {
      formData.append('files', f);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/zip/create`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create ZIP file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'archive.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      // Clear files after successful zip
      setFiles([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred during ZIP creation.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <FolderPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">ZIP Creator</h2>
      </div>

      <div className="space-y-6">
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
              <p className="font-bold text-lg mb-1">Click to select files to ZIP</p>
              <p className="text-gray-500 font-bold text-sm">Select multiple files at once</p>
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
            <div className="flex justify-between items-center px-4 py-2 bg-neo-yellow border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-xl uppercase">
                Selected Files ({files.length})
              </h3>
              <p className="font-bold">Total: {(totalSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            <div className="bg-white border-4 border-black rounded-xl overflow-hidden max-h-64 overflow-y-auto shadow-[4px_4px_0px_0px_#000]">
              <table className="w-full text-left">
                <tbody>
                  {files.map((f, i) => (
                    <tr key={i} className="border-b-4 border-black last:border-b-0 hover:bg-gray-100 transition-colors">
                      <td className="p-4 w-12">
                        <File className="w-6 h-6 text-gray-500" />
                      </td>
                      <td className="p-4 font-bold break-words">{f.name}</td>
                      <td className="p-4 font-bold whitespace-nowrap text-sm text-gray-700 w-32">
                        {(f.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="p-4 w-16">
                        <button
                          onClick={() => removeFile(i)}
                          className="bg-neo-pink hover:bg-pink-400 text-black border-4 border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleCreateZip}
              disabled={isLoading}
              className="w-full bg-neo-blue hover:bg-blue-500 text-white border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Zipping Files...
                </>
              ) : (
                <>
                  <Archive className="w-6 h-6" />
                  Create ZIP Archive
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const zipCreatorInstructions = [
  "Click the upload area to select one or more files.",
  "You can click again to add even more files to your list.",
  "Review the selected files and click 'Create ZIP Archive'.",
  "A single .zip file containing all your files will be downloaded."
];
