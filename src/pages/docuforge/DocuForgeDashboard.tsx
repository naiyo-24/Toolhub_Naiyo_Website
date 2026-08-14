import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, FileText, Plus, Folder, Clock, MoreVertical, File, Download, Trash2 } from 'lucide-react';
import localforage from 'localforage';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SavedDocument {
  id: string;
  name: string;
  date: number;
  size: number;
  pdfData: string; // Base64 or Blob
}

export default function DocuForgeDashboard() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Recent Scans');
  const [previewDoc, setPreviewDoc] = useState<SavedDocument | null>(null);
  const [editName, setEditName] = useState('');
  const [previewNumPages, setPreviewNumPages] = useState<number | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const keys = await localforage.keys();
      const docs: SavedDocument[] = [];
      for (const key of keys) {
        if (key.startsWith('doc_')) {
          const doc = await localforage.getItem<SavedDocument>(key);
          if (doc) docs.push(doc);
        }
      }
      docs.sort((a, b) => b.date - a.date);
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      await localforage.removeItem(`doc_${id}`);
      if (previewDoc && previewDoc.id === id) setPreviewDoc(null);
      loadDocuments();
    }
  };

  const handleRename = async () => {
    if (!previewDoc || !editName.trim() || editName === previewDoc.name) return;
    
    const updatedDoc = { ...previewDoc, name: editName };
    await localforage.setItem(`doc_${previewDoc.id}`, updatedDoc);
    setPreviewDoc(updatedDoc);
    loadDocuments();
  };

  const downloadDocument = (doc: SavedDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement('a');
    link.href = doc.pdfData;
    link.download = `${doc.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-neo-bg p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight flex items-center gap-3">
              <div className="bg-neo-purple text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <FileText className="w-8 h-8" />
              </div>
              DocuForge
            </h1>
            <p className="font-bold text-gray-600 mt-2">Your offline-first document workspace.</p>
          </div>

          <Link 
            to="/docuforge/scan" 
            className="bg-neo-yellow text-black border-4 border-black font-black uppercase px-6 py-4 rounded-xl flex items-center gap-2 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            <Camera className="w-6 h-6" />
            Scan New Document
          </Link>
        </div>

        {/* Workspace Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black uppercase mb-6 flex items-center gap-2">
                <span className="bg-black text-white px-2 py-1 rounded">Library</span>
              </h3>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => setActiveCategory('Recent Scans')}
                    className={`w-full flex items-center gap-3 font-black p-4 rounded-xl border-4 border-black transition-all ${
                      activeCategory === 'Recent Scans' 
                        ? 'bg-neo-yellow translate-x-[4px] translate-y-[4px] shadow-none' 
                        : 'bg-white shadow-[4px_4px_0px_0px_#000] hover:bg-neo-yellow/20'
                    }`}
                  >
                    <Clock className="w-6 h-6" /> Recent Scans
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveCategory('Personal')}
                    className={`w-full flex items-center gap-3 font-black p-4 rounded-xl border-4 border-black transition-all ${
                      activeCategory === 'Personal' 
                        ? 'bg-neo-blue text-white translate-x-[4px] translate-y-[4px] shadow-none' 
                        : 'bg-white shadow-[4px_4px_0px_0px_#000] hover:bg-neo-blue/10'
                    }`}
                  >
                    <Folder className={`w-6 h-6 ${activeCategory === 'Personal' ? 'text-white' : 'text-neo-blue'}`} /> Personal
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveCategory('Receipts')}
                    className={`w-full flex items-center gap-3 font-black p-4 rounded-xl border-4 border-black transition-all ${
                      activeCategory === 'Receipts' 
                        ? 'bg-neo-green translate-x-[4px] translate-y-[4px] shadow-none' 
                        : 'bg-white shadow-[4px_4px_0px_0px_#000] hover:bg-neo-green/20'
                    }`}
                  >
                    <Folder className="w-6 h-6" /> Receipts
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content: Document Grid */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
              {activeCategory} 
              <span className="text-sm bg-gray-200 text-black px-3 py-1 rounded-full">{documents.length}</span>
            </h2>
            
            {loading ? (
              <div className="text-center font-bold p-12">Loading workspace...</div>
            ) : documents.length === 0 ? (
              <div className="bg-white border-4 border-black border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                <File className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-black uppercase text-gray-500 mb-2">No documents yet</h3>
                <p className="font-bold text-gray-400 mb-6 max-w-md">
                  Click the "Scan New Document" button to start building your offline PDF library.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    onClick={() => {
                      setPreviewDoc(doc);
                      setEditName(doc.name);
                    }}
                    className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col relative group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer"
                  >
                    
                    {/* Delete button (absolute outside) */}
                    <button 
                      onClick={(e) => deleteDocument(doc.id, e)}
                      className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center bg-red-500 text-white border-4 border-black rounded-full shadow-[2px_2px_0px_0px_#000] hover:bg-red-600 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all z-10"
                      title="Delete Document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Thumbnail */}
                    <div className="aspect-[1/1.4] bg-gray-50 border-4 border-black rounded-lg mb-4 overflow-hidden relative flex flex-col items-center justify-center group-hover:bg-gray-100 transition-colors">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Document 
                          file={doc.pdfData} 
                          loading={<div className="font-bold text-gray-400 text-xs uppercase animate-pulse">Loading preview...</div>}
                          error={<FileText className="w-16 h-16 text-gray-300" />}
                        >
                          <Page 
                            pageNumber={1} 
                            width={300}
                            renderTextLayer={false} 
                            renderAnnotationLayer={false}
                            className="w-full h-full"
                          />
                        </Document>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex justify-between items-start gap-3 mt-auto">
                      <div className="overflow-hidden">
                        <h4 className="font-black truncate text-lg leading-tight" title={doc.name}>{doc.name}</h4>
                        <p className="text-xs font-bold text-gray-500 mt-1">
                          {new Date(doc.date).toLocaleDateString()} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button 
                        onClick={(e) => downloadDocument(doc, e)}
                        className="bg-neo-blue text-white border-4 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-blue-600 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all shrink-0"
                        title="Download PDF"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[200] bg-neo-bg flex flex-col">
          {/* Top Navbar */}
          <div className="flex items-center justify-between p-4 bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_#000] z-10">
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setPreviewDoc(null)} 
                className="p-2 border-4 border-black rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                <div className="font-black uppercase px-2 text-sm">Close</div>
              </button>
              
              <div className="flex-1 max-w-md flex items-center bg-gray-100 border-4 border-black rounded-xl px-3 py-2 focus-within:bg-white focus-within:ring-4 focus-within:ring-neo-blue/30 transition-all">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                  className="w-full bg-transparent font-black outline-none text-lg"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => downloadDocument(previewDoc, e)}
                className="bg-neo-blue text-white border-4 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline font-black uppercase text-sm">Download</span>
              </button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className="flex-1 bg-gray-200 overflow-y-auto relative p-4 sm:p-8 flex flex-col items-center">
            <Document 
              file={previewDoc.pdfData}
              onLoadSuccess={({ numPages }) => setPreviewNumPages(numPages)}
              loading={<div className="font-black uppercase text-xl p-8 animate-pulse text-gray-500">Loading Document...</div>}
              className="flex flex-col gap-6 items-center w-full max-w-4xl"
            >
              {previewNumPages ? Array.from(new Array(previewNumPages), (el, index) => (
                <div key={`page_${index + 1}`} className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_#000] overflow-hidden w-full flex justify-center">
                  <Page 
                    pageNumber={index + 1} 
                    renderTextLayer={false} 
                    renderAnnotationLayer={false}
                    width={Math.min(window.innerWidth - 64, 800)}
                  />
                </div>
              )) : null}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
}
