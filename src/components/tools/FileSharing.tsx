import React, { useState, useRef } from 'react';
import { Upload, File, Loader2, Copy, Check, Share2 } from 'lucide-react';
import { API_BASE_URL, formatFileUrl } from '../../config/api';

export function FileSharing() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
      setShareLink('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/share/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      
      // The backend now returns the full URL with the actual network IP in absolute_url
      // We fall back to download_path just in case
      const link = data.absolute_url ? formatFileUrl(data.absolute_url) : `${API_BASE_URL.replace('/api', '')}${data.download_path}`;
      setShareLink(link);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Share2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">File Sharing</h2>
      </div>

      <div className="space-y-6">
        <div 
          className={`border-4 border-dashed border-black rounded-xl p-12 text-center cursor-pointer transition-colors ${file ? 'bg-neo-blue/10' : 'bg-gray-50 hover:bg-gray-100'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
          />
          {file ? (
            <div className="flex flex-col items-center gap-4">
              <File className="w-16 h-16 text-neo-blue" />
              <div>
                <p className="font-bold text-lg">{file.name}</p>
                <p className="text-gray-500 font-bold text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-16 h-16 text-gray-400" />
              <div>
                <p className="font-bold text-lg mb-1">Click to select a file</p>
                <p className="text-gray-500 font-bold text-sm">Any file type up to 100MB</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
            {error}
          </div>
        )}

        {file && !shareLink && (
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full bg-neo-yellow hover:bg-yellow-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                Upload & Get Link
              </>
            )}
          </button>
        )}

        {shareLink && (
          <div className="bg-green-50 border-4 border-black p-6 rounded-xl space-y-4 shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-black text-xl text-green-800 uppercase flex items-center gap-2">
              <Check className="w-6 h-6" />
              File Uploaded Successfully!
            </h3>
            <div>
              <label className="block font-bold text-sm mb-2">Shareable Link:</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={shareLink} 
                  readOnly 
                  className="flex-1 bg-white border-4 border-black rounded-xl p-3 font-bold focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-black text-white px-6 rounded-xl font-bold border-4 border-black hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const fileSharingInstructions = [
  "Click the upload area to select a file from your device.",
  "Click 'Upload & Get Link' to securely transfer your file.",
  "Copy the generated link and share it with anyone.",
  "The recipient can click the link to download the file directly."
];
