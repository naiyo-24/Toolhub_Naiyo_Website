import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Download, Settings2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export const modifyPdfInstructions = [
  "Click to upload the PDF document you want to modify.",
  "Specify the pages you want to delete or rotate (e.g., '1, 3-5').",
  "Select the rotation angle (90°, 180°, 270°) if rotating.",
  "Click 'Modify PDF' to process and download the updated document."
];

export function ModifyPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesToDelete, setPagesToDelete] = useState('');
  const [pagesToRotate, setPagesToRotate] = useState('');
  const [rotationAngle, setRotationAngle] = useState('90');
  const [pageSize, setPageSize] = useState('auto');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modifiedUrl, setModifiedUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
      setModifiedUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleModify = async () => {
    if (!file) return;
    if (!pagesToDelete && !pagesToRotate && pageSize === 'auto') {
      setError('Please specify pages to delete/rotate or a new page size.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setModifiedUrl(null);
    
    const formData = new FormData();
    formData.append('file', file);
    if (pagesToDelete) formData.append('delete_pages', pagesToDelete);
    if (pagesToRotate) {
      formData.append('rotate_pages', pagesToRotate);
      formData.append('rotation_angle', rotationAngle);
    }
    if (pageSize !== 'auto') {
      formData.append('page_size', pageSize);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/modify-pages`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to modify PDF.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setModifiedUrl(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred while modifying the PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-pink p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Settings2 className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase">Modify PDF Pages</h2>
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
              <p className="mb-2 text-xl font-black uppercase">Click or drag a PDF here</p>
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
              onClick={() => { setFile(null); setModifiedUrl(null); }}
              className="px-4 py-2 bg-white border-2 border-black rounded-lg font-bold hover:bg-gray-100"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {file && !modifiedUrl && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded">Delete</span> Pages
              </h3>
              <label className="block text-sm font-bold text-gray-600 mb-2">Page numbers</label>
              <input 
                type="text"
                value={pagesToDelete}
                onChange={(e) => setPagesToDelete(e.target.value)}
                placeholder="e.g. 1, 3-5"
                className="w-full border-4 border-black rounded-xl p-3 font-bold outline-none focus:ring-4 focus:ring-red-500/30 transition-all"
              />
            </div>
            
            <div className="bg-neo-blue/10 border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
              <div>
                <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                  <span className="bg-neo-blue text-white px-2 py-1 rounded">Rotate</span> Pages
                </h3>
                <label className="block text-sm font-bold text-gray-600 mb-2">Page numbers</label>
                <input 
                  type="text"
                  value={pagesToRotate}
                  onChange={(e) => setPagesToRotate(e.target.value)}
                  placeholder="e.g. 2, 4"
                  className="w-full border-4 border-black rounded-xl p-3 font-bold outline-none focus:ring-4 focus:ring-neo-blue/30 mb-4 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Rotation Angle</label>
                <select 
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(e.target.value)}
                  className="w-full border-4 border-black rounded-xl p-3 font-bold outline-none cursor-pointer bg-white focus:ring-4 focus:ring-neo-blue/30 transition-all"
                >
                  <option value="90">90° Clockwise</option>
                  <option value="180">180° (Upside down)</option>
                  <option value="270">90° Counter-Clockwise</option>
                </select>
              </div>
            </div>

            <div className="bg-neo-yellow/20 border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                <span className="bg-black text-neo-yellow px-2 py-1 rounded">Resize</span> PDF
              </h3>
              <label className="block text-sm font-bold text-gray-600 mb-2">New Page Size</label>
              <select 
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="w-full border-4 border-black rounded-xl p-3 font-bold outline-none cursor-pointer bg-white focus:ring-4 focus:ring-neo-yellow/50 transition-all"
              >
                <option value="auto">Auto size (Keep original)</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A3">A3</option>
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                <option value="B3">B3</option>
                <option value="B4">B4</option>
                <option value="B5">B5</option>
                <option value="LETTER">LETTER</option>
                <option value="LEGAL">LEGAL</option>
                <option value="TABLOID">TABLOID</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleModify}
            disabled={isLoading || (!pagesToDelete && !pagesToRotate && pageSize === 'auto')}
            className="w-full bg-neo-pink text-black border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Modifying PDF...
              </>
            ) : (
              <>
                <Settings2 className="w-6 h-6" /> Modify PDF
              </>
            )}
          </button>
        </div>
      )}

      {modifiedUrl && (
        <div className="mt-8 bg-black text-white border-4 border-black p-8 rounded-2xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4 text-center">
          <div className="bg-neo-pink w-16 h-16 rounded-full border-4 border-black mx-auto flex items-center justify-center mb-4">
            <Settings2 className="w-8 h-8 text-black" />
          </div>
          <h4 className="text-3xl font-black uppercase mb-6 text-neo-pink">PDF Modified Successfully!</h4>
          
          <a 
            href={modifiedUrl}
            download={`modified_${file?.name || 'document.pdf'}`}
            className="w-full bg-white text-black border-4 border-black px-6 py-4 font-black uppercase text-xl rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_#fff]"
          >
            <Download className="w-6 h-6" />
            Download Modified PDF
          </a>
        </div>
      )}
    </div>
  );
}
