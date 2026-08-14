import React, { useState } from 'react';
import { FileText, Loader2, Download, AlignLeft, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export const textToPdfInstructions = [
  "Type or paste your text into the text area.",
  "Click 'Create PDF' to generate a document from your text.",
  "Download your newly created PDF file."
];

export function TextToPDF() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to a PDF.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setPdfUrl(null);
    
    const formData = new FormData();
    formData.append('text', text);

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/text-to-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create PDF from text.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-purple p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <AlignLeft className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Text to PDF</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-4 border-black rounded-xl text-red-700 font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {!pdfUrl ? (
        <div className="space-y-6">
          <div>
            <label className="block font-black uppercase text-sm mb-2 text-gray-700 flex items-center justify-between">
              <span>Enter Text</span>
              <span className="text-gray-400 font-bold text-xs">{text.length} characters</span>
            </label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full border-4 border-black rounded-xl p-4 font-bold outline-none focus:ring-4 focus:ring-neo-purple/30 min-h-[300px] resize-y"
            />
          </div>

          <button 
            onClick={handleCreate}
            disabled={isLoading || !text.trim()}
            className="w-full bg-neo-purple text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Creating PDF...
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" /> Create PDF
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center py-8 animate-in slide-in-from-bottom-4">
          <div className="bg-neo-purple w-20 h-20 rounded-full border-4 border-black mx-auto flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000]">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-3xl font-black uppercase mb-2 text-neo-purple">PDF Created!</h4>
          <p className="text-gray-600 font-bold mb-8">Your text has been successfully converted into a PDF document.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={pdfUrl}
              download="document.pdf"
              className="bg-neo-purple text-white border-4 border-black px-8 py-4 font-black uppercase text-lg rounded-xl flex items-center justify-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all shadow-[4px_4px_0px_0px_#000]"
            >
              <Download className="w-6 h-6" /> Download PDF
            </a>
            
            <button 
              onClick={() => { setPdfUrl(null); setText(''); }}
              className="bg-white text-black border-4 border-black px-8 py-4 font-black uppercase text-lg rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
            >
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
