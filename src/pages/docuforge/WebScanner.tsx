import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, X, Check, Image as ImageIcon, RotateCcw, AlertCircle } from 'lucide-react';
import { useDocuForge } from './DocuForgeContext';

export default function WebScanner() {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  const { addPage, pages } = useDocuForge();
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const acceptAndContinue = () => {
    if (capturedImage) {
      addPage(capturedImage);
      setCapturedImage(null);
      // If we want to go edit immediately, navigate to editor.
      // If we want batch mode, we just stay here. Let's redirect to editor for now.
      navigate('/docuforge/editor');
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate('/docuforge')} 
          className="text-white bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="text-white font-black uppercase text-xl">
          Scan Document
        </div>
        <button 
          onClick={toggleCamera} 
          className="text-white bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Main Viewfinder */}
      <div className="relative w-full max-w-2xl aspect-[3/4] sm:aspect-video md:aspect-[3/4] bg-gray-900 flex items-center justify-center overflow-hidden">
        
        {!capturedImage ? (
          <>
            {cameraError && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-6 text-center bg-black/80 backdrop-blur-sm">
                <div className="bg-red-500/20 border-2 border-red-500 p-6 rounded-xl max-w-sm">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-white font-black uppercase mb-2">Camera Error</h3>
                  <p className="text-red-200 text-sm font-bold mb-4">{cameraError}</p>
                  <p className="text-gray-400 text-xs">Note: Cameras require HTTPS on mobile devices. If you are using a local IP address (e.g., http://192.168...), the browser will block the camera.</p>
                  <button onClick={() => setCameraError(null)} className="mt-4 bg-white text-black font-black uppercase px-4 py-2 rounded-lg w-full">Dismiss</button>
                </div>
              </div>
            )}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: facingMode === 'environment' ? { exact: 'environment' } : 'user',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
              }}
              onUserMedia={() => setCameraError(null)}
              onUserMediaError={(err) => {
                console.error("Camera error:", err);
                
                // If back camera is requested but not available (like on desktop), fallback to front camera silently
                if (typeof err !== 'string' && err.name === 'OverconstrainedError' && facingMode === 'environment') {
                  setFacingMode('user');
                  return;
                }
                
                setCameraError(typeof err === 'string' ? err : err.message || err.name || "Failed to access camera.");
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Guide overlay */}
            <div className="absolute inset-8 border-2 border-white/50 border-dashed rounded-xl pointer-events-none"></div>
          </>
        ) : (
          <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 inset-x-0 p-8 flex justify-center items-center gap-8 bg-gradient-to-t from-black via-black/80 to-transparent pb-12">
        
        {!capturedImage ? (
          <>
            <label className="text-white flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="bg-gray-800 p-3 rounded-full">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase">Gallery</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        setCapturedImage(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
            </label>

            {/* Shutter Button */}
            <button 
              onClick={capture}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors active:scale-95"
            >
              <div className="w-16 h-16 rounded-full bg-white"></div>
            </button>

            <div className="w-[60px] flex justify-center">
              {pages.length > 0 && (
                <div 
                  className="relative cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate('/docuforge/editor')}
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
                    <img src={pages[pages.length - 1].originalImage} className="w-full h-full object-cover opacity-50" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-neo-yellow text-black font-black text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-black">
                    {pages.length}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={retake}
              className="bg-gray-800 text-white font-black uppercase px-6 py-4 rounded-xl border-4 border-gray-600 hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Retake
            </button>

            <button 
              onClick={acceptAndContinue}
              className="bg-neo-yellow text-black font-black uppercase px-8 py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center gap-2"
            >
              <Check className="w-6 h-6" /> Keep Scan
            </button>
          </>
        )}

      </div>
    </div>
  );
}
