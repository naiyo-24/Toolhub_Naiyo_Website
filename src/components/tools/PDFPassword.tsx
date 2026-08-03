import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Download, Lock } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function PDFPassword() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [protectedUrl, setProtectedUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
      setProtectedUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProtect = async () => {
    if (!file) return;
    if (!password) {
      setError('Please enter a password to encrypt the PDF.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setProtectedUrl(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_BASE_URL}/file-tools/pdf/protect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to encrypt PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setProtectedUrl(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred during encryption.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!protectedUrl || !file) return;
    
    const a = document.createElement('a');
    a.href = protectedUrl;
    
    const nameParts = file.name.split('.');
    const ext = nameParts.pop();
    a.download = `${nameParts.join('.')}_protected.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setProtectedUrl(null);
    setPassword('');
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-pink p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Lock className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase">PDF Password</h2>
      </div>

      <div className="space-y-6">
        {!protectedUrl ? (
          <>
            <div 
              className={`border-4 border-dashed border-black rounded-xl p-12 text-center cursor-pointer transition-colors ${file ? 'bg-neo-pink/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="application/pdf"
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  <FileText className="w-16 h-16 text-neo-pink" />
                  <div>
                    <p className="font-bold text-lg break-words">{file.name}</p>
                    <p className="text-gray-500 font-bold text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-16 h-16 text-gray-400" />
                  <div>
                    <p className="font-bold text-lg mb-1">Click to select a PDF</p>
                    <p className="text-gray-500 font-bold text-sm">Secure your document with a password</p>
                  </div>
                </div>
              )}
            </div>

            {file && (
              <div className="bg-gray-50 border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                <label className="font-black uppercase block mb-2">Set Password</label>
                <div className="relative">
                  <Lock className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="w-full border-4 border-black rounded-xl pl-12 pr-4 py-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-pink/50"
                  />
                </div>
                <p className="text-sm font-bold text-gray-500 mt-2">
                  Make sure to remember this password. The file cannot be opened without it!
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
                {error}
              </div>
            )}

            {file && (
              <button
                onClick={handleProtect}
                disabled={isLoading}
                className="w-full bg-neo-pink hover:bg-pink-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Encrypting...
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6" />
                    Lock PDF
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border-4 border-black p-6 rounded-xl text-center shadow-[4px_4px_0px_0px_#000]">
              <Lock className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-black text-2xl text-green-700 uppercase mb-2">PDF Locked!</h3>
              <p className="font-bold text-gray-600">Your document is now encrypted with the password you provided.</p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-neo-green hover:bg-green-400 text-black border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all flex items-center justify-center gap-3 uppercase"
            >
              <Download className="w-6 h-6" />
              Download Locked PDF
            </button>
            
            <button
              onClick={reset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-black border-4 border-black font-black text-lg py-3 px-8 rounded-xl transition-colors uppercase mt-2"
            >
              Lock Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const pdfPasswordInstructions = [
  "Upload the PDF document you want to secure.",
  "Enter a strong password in the input field.",
  "Click 'Lock PDF' to encrypt the document.",
  "Download your secure PDF. Anyone who opens it will be prompted for the password!"
];
