import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Download, Unlock, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export const unlockPdfInstructions = [
  "Click to upload your password-protected PDF document.",
  "Enter the original password required to open the PDF.",
  "Click 'Unlock PDF' to remove the password.",
  "Download the newly unlocked PDF file."
];

export function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unlockedUrl, setUnlockedUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
      setUnlockedUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUnlock = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError('');
    setUnlockedUrl(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/unlock-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to unlock PDF. Please check the password.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setUnlockedUrl(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred while unlocking.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-green p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Unlock className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase">Unlock PDF</h2>
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
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-3 text-black" />
              <p className="mb-2 text-xl font-black uppercase">Click or drag a protected PDF here</p>
              <p className="text-sm text-gray-500 font-bold">Only PDF files supported</p>
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
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-neo-blue" />
              <div>
                <p className="font-bold truncate max-w-xs md:max-w-md">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setUnlockedUrl(null); }}
              className="px-4 py-2 bg-white border-2 border-black rounded-lg font-bold hover:bg-gray-100"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {file && !unlockedUrl && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="bg-gray-50 border-4 border-black p-6 rounded-xl">
            <h3 className="font-black uppercase mb-4">Mode 1: Unlock Encrypted File</h3>
            <label className="block font-black uppercase text-sm mb-2 text-gray-700">User Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password required to open the file..."
              className="w-full border-4 border-black rounded-xl p-4 font-bold outline-none focus:ring-4 focus:ring-neo-green/30 mb-4"
            />
            <button 
              onClick={handleUnlock}
              disabled={isLoading || !password}
              className="w-full bg-neo-green text-black border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Unlocking...</>
              ) : (
                <><Unlock className="w-6 h-6" /> Unlock File (Requires Password)</>
              )}
            </button>
          </div>
          
          <div className="relative text-center my-6">
            <span className="bg-white px-4 font-black uppercase text-gray-400 text-sm">OR</span>
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
          </div>

          <div className="bg-gray-50 border-4 border-black p-6 rounded-xl">
            <h3 className="font-black uppercase mb-4 text-neo-blue">Mode 2: Remove Owner Restrictions</h3>
            <p className="font-bold text-gray-600 mb-6 text-sm">Use this if the PDF can be opened without a password, but printing, copying, or editing is disabled. This instantly removes those restrictions!</p>
            <button 
              onClick={handleUnlock}
              disabled={isLoading}
              className="w-full bg-neo-blue text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Removing Permissions...</>
              ) : (
                <><Unlock className="w-6 h-6" /> Bypass Owner Restrictions (No Password)</>
              )}
            </button>
          </div>
        </div>
      )}

      {unlockedUrl && (
        <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-2xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 text-center">
          <div className="bg-neo-green w-16 h-16 rounded-full border-4 border-black mx-auto flex items-center justify-center mb-4">
            <Unlock className="w-8 h-8 text-black" />
          </div>
          <h4 className="text-3xl font-black uppercase mb-6 text-neo-green">PDF Unlocked Successfully!</h4>
          
          <a 
            href={unlockedUrl}
            download={`unlocked_${file?.name || 'document.pdf'}`}
            className="w-full bg-white text-black border-4 border-black px-6 py-4 font-black uppercase text-xl rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_#fff]"
          >
            <Download className="w-6 h-6" />
            Download Unlocked PDF
          </a>
        </div>
      )}
    </div>
  );
}
