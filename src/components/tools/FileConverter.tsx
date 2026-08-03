import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UploadCloud, FileType, RefreshCw, Loader2, Download, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function FileConverter() {
  const { toolId } = useParams<{ toolId: string }>();
  
  // Parse toolId like 'jpg-png' into { from: 'jpg', to: 'png' }
  const [fromFormat, setFromFormat] = useState('');
  const [toFormat, setToFormat] = useState('');

  useEffect(() => {
    if (toolId) {
      const parts = toolId.split('-');
      if (parts.length === 2) {
        setFromFormat(parts[0]);
        setToFormat(parts[1]);
      }
    }
  }, [toolId]);

  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultUrl(null);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!file || !fromFormat || !toFormat) return;

    setIsConverting(true);
    setError(null);
    setResultUrl(null);

    const formData = new FormData();
    formData.append('file', file);
    
    let endpoint = '';

    // Determine the correct backend endpoint based on the conversion type
    if (toFormat === 'pdf') {
      endpoint = `${API_BASE_URL}/docuforge/image-to-pdf`;
      // Actually image-to-pdf might expect something different. Let's send it to file-tools or docuforge as needed
      // Wait, docuforge image-to-pdf takes files (List[UploadFile]).
      formData.delete('file');
      formData.append('files', file); 
    } else if (fromFormat === 'pdf') {
      endpoint = `${API_BASE_URL}/docuforge/pdf-to-image`;
      formData.append('output_format', toFormat);
    } else {
      endpoint = `${API_BASE_URL}/file-tools/image-convert`;
      formData.append('target_format', toFormat);
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Conversion failed. Please try again.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred during conversion.');
    } finally {
      setIsConverting(false);
    }
  };

  if (!fromFormat || !toFormat) return null;

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center justify-center gap-3 text-center">
          <FileType className="w-8 h-8 text-neo-pink" />
          {fromFormat.toUpperCase()} to {toFormat.toUpperCase()} Converter
        </h3>

        <div className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 hover:border-black transition-all cursor-pointer relative group"
             onClick={() => !isConverting && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept={`.${fromFormat}`} 
            disabled={isConverting}
          />
          <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform">
            <UploadCloud className={`w-16 h-16 ${file ? 'text-neo-pink' : 'text-gray-400'}`} />
            <div>
              <p className="font-bold text-xl mb-1">
                {file ? file.name : `Click to select .${fromFormat} file`}
              </p>
              {!file && (
                <p className="text-gray-500 font-medium">
                  Max file size: 10MB
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <button 
          onClick={handleConvert}
          disabled={!file || isConverting}
          className="w-full mt-6 bg-neo-pink text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <RefreshCw className="w-6 h-6" />
              Convert to {toFormat.toUpperCase()}
            </>
          )}
        </button>

        {resultUrl && !isConverting && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-pink text-center">Conversion Complete!</h4>
            
            <a 
              href={resultUrl}
              download={`converted.${toFormat === 'pdf' && fromFormat === 'pdf' ? 'zip' : toFormat}`}
              className="w-full bg-white text-black border-4 border-black px-6 py-4 font-black uppercase text-lg rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <Download className="w-6 h-6" />
              Download Result
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
