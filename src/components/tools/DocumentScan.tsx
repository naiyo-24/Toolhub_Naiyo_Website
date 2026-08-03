import React, { useState } from 'react';
import { Camera, Upload, Scan, Loader2 } from 'lucide-react';

export function DocumentScan() {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-green p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Camera className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase">Document Scan (Mobile App)</h2>
      </div>

      <div className="bg-neo-yellow/30 border-4 border-black p-6 rounded-xl mb-8 font-bold text-center">
        Note: This tool is designed for the ToolHub Mobile App. You can test the interface here.
      </div>

      <div className="mb-8">
        {!image ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-black rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Camera className="w-16 h-16 mb-4 text-black" />
              <p className="mb-2 text-2xl font-black uppercase">Take a Photo</p>
              <p className="text-sm font-bold text-gray-500">Or upload an image to scan</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#000]">
              <img src={image} alt="Scanned document" className="w-full h-auto object-contain max-h-[500px]" />
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setImage(null)}
                className="flex-1 bg-white hover:bg-gray-100 text-black border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
              >
                Retake
              </button>
              <button 
                className="flex-1 bg-neo-green hover:bg-green-400 text-black border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
              >
                <Scan className="w-6 h-6" /> Save PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const documentScanInstructions = [
  "This tool requires the ToolHub mobile app for camera access.",
  "Take a clear photo of your document.",
  "The app will automatically crop and enhance the document.",
  "Save it as a high-quality PDF."
];
