import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { useDocuForge } from './DocuForgeContext';
import { Save, Download, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PDFPreview() {
  const { pages, clearPages } = useDocuForge();
  const navigate = useNavigate();
  const [docName, setDocName] = useState('New Document');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  const generatePDF = async () => {
    if (pages.length === 0) return;
    setIsGenerating(true);

    try {
      // Create new PDF (A4 size)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const a4Width = 210;
      const a4Height = 297;

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        
        const page = pages[i];
        const imgData = page.croppedImage || page.originalImage;
        
        // Determine image dimensions to scale it correctly on A4
        const img = new Image();
        img.src = imgData;
        await new Promise((resolve) => (img.onload = resolve));
        
        const imgRatio = img.width / img.height;
        const a4Ratio = a4Width / a4Height;
        
        let drawWidth = a4Width;
        let drawHeight = a4Height;
        let x = 0;
        let y = 0;

        if (imgRatio > a4Ratio) {
          // Image is wider than A4
          drawHeight = a4Width / imgRatio;
          y = (a4Height - drawHeight) / 2; // Center vertically
        } else {
          // Image is taller than A4
          drawWidth = a4Height * imgRatio;
          x = (a4Width - drawWidth) / 2; // Center horizontally
        }

        pdf.addImage(imgData, 'JPEG', x, y, drawWidth, drawHeight);
      }

      // Convert to Data URL
      const dataUri = pdf.output('datauristring');
      setPdfDataUrl(dataUri);

      // Save to IndexedDB via localforage
      const id = uuidv4();
      const doc = {
        id,
        name: docName || 'Untitled Document',
        date: Date.now(),
        size: dataUri.length,
        pdfData: dataUri,
      };

      await localforage.setItem(`doc_${id}`, doc);
      setSavedDocId(id);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = `${docName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFinish = () => {
    clearPages();
    navigate('/docuforge');
  };

  if (pages.length === 0 && !savedDocId) {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center p-8 text-center">
        <div>
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-black uppercase mb-4">No pages to generate</h2>
          <button onClick={() => navigate('/docuforge')} className="text-neo-blue font-bold">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="bg-white p-2 border-2 border-black rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-black uppercase">Finalize Document</h1>
        </div>

        <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000]">
          
          {!savedDocId ? (
            <div className="flex flex-col gap-6">
              <div>
                <label className="block font-black uppercase text-sm mb-2 text-gray-600">Document Name</label>
                <input 
                  type="text" 
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full text-2xl font-bold border-b-4 border-black pb-2 bg-transparent outline-none focus:border-neo-blue transition-colors placeholder:text-gray-300"
                  placeholder="Enter document name..."
                />
              </div>

              <div>
                <h3 className="font-black uppercase text-sm mb-4 text-gray-600">Pages Included ({pages.length})</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {pages.map((p, i) => (
                    <div key={p.id} className="relative shrink-0 w-24 aspect-[3/4] border-2 border-black rounded-lg overflow-hidden bg-gray-100">
                      <div className="absolute top-0 left-0 bg-black text-white text-xs font-black px-2 py-1 rounded-br-lg">{i + 1}</div>
                      <img src={p.croppedImage || p.originalImage} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full bg-neo-purple text-white border-4 border-black font-black uppercase text-xl py-4 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isGenerating ? 'Generating PDF...' : (
                  <>
                    <Save className="w-6 h-6" /> Save Document
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="bg-neo-green text-white p-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_#000] mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black uppercase mb-2">Saved Successfully!</h2>
              <p className="font-bold text-gray-500 mb-8 max-w-md">"{docName}" has been saved to your offline workspace.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button 
                  onClick={handleDownload}
                  className="bg-neo-blue text-white border-4 border-black font-black uppercase px-6 py-4 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download PDF
                </button>
                <button 
                  onClick={handleFinish}
                  className="bg-white text-black border-4 border-black font-black uppercase px-6 py-4 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                >
                  Back to Workspace
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
