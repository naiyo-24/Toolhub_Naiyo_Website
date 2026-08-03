import React, { useEffect, useState, useRef } from 'react';
import { Keyboard, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export function BarcodeScanner({ onScan, onClose, isOpen }: BarcodeScannerProps) {
  const [usbInput, setUsbInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleUsbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usbInput.trim()) {
      onScan(usbInput.trim());
      setUsbInput('');
      if (onClose) onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[12px_12px_0px_0px_#000] max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-neo-pink text-white border-4 border-black rounded-full p-2 hover:scale-110 transition-transform"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
          Scan Barcode
        </h3>

        <div className="bg-gray-100 p-8 rounded-xl border-4 border-black text-center mb-6 border-dashed">
          <Keyboard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="font-bold text-gray-500">Scan with USB scanner now...</p>
        </div>
        <form onSubmit={handleUsbSubmit} className="space-y-4">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Or type barcode manually..." 
            value={usbInput}
            onChange={e => setUsbInput(e.target.value)}
            className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold text-lg focus:outline-none focus:bg-white" 
          />
          <button type="submit" className="w-full bg-black text-white font-black uppercase py-3 rounded-xl hover:bg-gray-800 transition-colors">
            Submit Barcode
          </button>
        </form>
      </div>
    </div>
  );
}
