import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDocuForge, ScannedPage } from './DocuForgeContext';
import { ArrowLeft, Check, Camera, FileOutput, Scissors, Contrast } from 'lucide-react';

export default function ImageEditor() {
  const { pages, updatePage, removePage } = useDocuForge();
  const navigate = useNavigate();
  
  // If no pages, go back to scan or dashboard
  useEffect(() => {
    if (pages.length === 0) {
      navigate('/docuforge');
    }
  }, [pages, navigate]);

  const [currentPageIndex, setCurrentPageIndex] = useState(pages.length > 0 ? pages.length - 1 : 0);
  const currentPage = pages[currentPageIndex];

  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%', // Can be 'px' or '%'
    x: 10,
    y: 10,
    width: 80,
    height: 80
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  if (!currentPage) return null;

  const handleApplyCropAndFilter = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // Apply Filter based on context state
    if (currentPage.filter !== 'none') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (currentPage.filter === 'grayscale') {
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        } else if (currentPage.filter === 'bw') {
          const threshold = 128;
          const val = avg > threshold ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    const base64Image = canvas.toDataURL('image/jpeg', 0.9);
    updatePage(currentPage.id, { croppedImage: base64Image });
  };

  const finishEditing = async () => {
    // Apply current crop/filter before moving on
    await handleApplyCropAndFilter();
    navigate('/docuforge/preview');
  };

  const addAnotherPage = async () => {
    await handleApplyCropAndFilter();
    navigate('/docuforge/scan');
  };

  return (
    <div className="min-h-screen bg-neo-bg flex flex-col">
      
      {/* Top Nav */}
      <div className="bg-white border-b-4 border-black p-4 flex justify-between items-center z-10 sticky top-0">
        <button 
          onClick={() => navigate('/docuforge/scan')}
          className="flex items-center gap-2 font-bold hover:text-neo-blue transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="font-black uppercase text-xl">
          Edit Page {currentPageIndex + 1} of {pages.length}
        </div>
        <button 
          onClick={finishEditing}
          className="bg-neo-purple text-white border-2 border-black font-bold uppercase px-4 py-2 rounded-lg flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all"
        >
          Done <FileOutput className="w-4 h-4" />
        </button>
      </div>

      {/* Main Editor Area */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        
        {/* Image Preview (Crop Area) */}
        <div className="flex-grow p-4 lg:p-8 flex items-center justify-center bg-gray-100 overflow-y-auto">
          <div className="max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            <ReactCrop 
              crop={crop} 
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-h-[60vh] lg:max-h-[75vh]"
            >
              <img 
                ref={imgRef}
                src={currentPage.originalImage} 
                alt="Document to crop" 
                className="max-w-full h-auto object-contain"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  // Auto set initial crop to slightly inside the image
                  setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
                }}
                style={{
                  filter: currentPage.filter === 'grayscale' ? 'grayscale(100%)' : currentPage.filter === 'bw' ? 'contrast(200%) grayscale(100%)' : 'none'
                }}
              />
            </ReactCrop>
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="w-full lg:w-80 bg-white border-t-4 lg:border-t-0 lg:border-l-4 border-black flex flex-col">
          <div className="p-6 flex-grow overflow-y-auto space-y-8">
            
            {/* Filter Section */}
            <div>
              <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                <Contrast className="w-5 h-5 text-neo-pink" /> 
                Color Filter
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => updatePage(currentPage.id, { filter: 'none' })}
                  className={`border-2 border-black rounded-lg py-2 text-xs font-bold uppercase transition-colors ${currentPage.filter === 'none' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Original
                </button>
                <button 
                  onClick={() => updatePage(currentPage.id, { filter: 'grayscale' })}
                  className={`border-2 border-black rounded-lg py-2 text-xs font-bold uppercase transition-colors ${currentPage.filter === 'grayscale' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Grayscale
                </button>
                <button 
                  onClick={() => updatePage(currentPage.id, { filter: 'bw' })}
                  className={`border-2 border-black rounded-lg py-2 text-xs font-bold uppercase transition-colors ${currentPage.filter === 'bw' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  B&W
                </button>
              </div>
            </div>

            {/* Page Navigation / Management */}
            <div>
               <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-neo-blue" /> 
                Pages ({pages.length})
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-4">
                {pages.map((p, index) => (
                  <div 
                    key={p.id} 
                    onClick={async () => {
                      await handleApplyCropAndFilter();
                      setCurrentPageIndex(index);
                    }}
                    className={`shrink-0 w-16 h-20 bg-gray-100 border-2 rounded-lg cursor-pointer overflow-hidden ${currentPageIndex === index ? 'border-neo-blue border-4 shadow-md' : 'border-black hover:border-gray-500'}`}
                  >
                    <img src={p.croppedImage || p.originalImage} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t-2 border-dashed border-gray-300">
               <button 
                  onClick={() => removePage(currentPage.id)}
                  className="w-full text-red-500 font-bold uppercase border-2 border-red-500 rounded-lg py-2 hover:bg-red-50 transition-colors"
                >
                  Delete Current Page
                </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t-4 border-black bg-gray-50 flex flex-col gap-3">
            <button 
              onClick={addAnotherPage}
              className="w-full bg-white text-black border-2 border-black font-black uppercase px-4 py-3 rounded-xl flex justify-center items-center gap-2 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all"
            >
              <Camera className="w-5 h-5" /> Add Another Page
            </button>
            <button 
              onClick={finishEditing}
              className="w-full bg-neo-yellow text-black border-4 border-black font-black uppercase px-4 py-4 rounded-xl flex justify-center items-center gap-2 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg"
            >
              <Check className="w-6 h-6" /> Create PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
