import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Download, Trash2 } from 'lucide-react';

export function DigitalSignature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        if (!hasDrawn) setHasDrawn(true);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }
    }
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'digital_signature.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <PenTool className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Digital Signature</h2>
      </div>

      <div className="mb-8">
        <label className="font-black uppercase text-lg block mb-4">Draw Your Signature</label>
        
        <div className="relative border-4 border-black rounded-2xl overflow-hidden bg-gray-50 shadow-[6px_6px_0px_0px_#000]">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full h-[300px] cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 font-bold uppercase text-2xl opacity-50">
              Sign Here
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={clearCanvas}
          className="flex-1 bg-neo-pink hover:bg-red-400 text-black border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-lg shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
        >
          <Trash2 className="w-6 h-6" /> Clear
        </button>
        <button
          onClick={downloadSignature}
          disabled={!hasDrawn}
          className="flex-[2] bg-neo-blue hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-neo-blue text-white border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-lg shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
        >
          <Download className="w-6 h-6" /> Download as Transparent PNG
        </button>
      </div>
    </div>
  );
}

export const digitalSignatureInstructions = [
  "Use your mouse or touch screen to draw your signature in the box.",
  "Click 'Clear' if you make a mistake and want to start over.",
  "Click 'Download' to save your signature as a transparent PNG file that you can use on any document."
];
