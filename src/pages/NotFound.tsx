import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20 flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white border-4 border-black p-8 md:p-16 shadow-[16px_16px_0px_0px_#000] relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-neo-yellow border-4 border-black shadow-[4px_4px_0px_0px_#000] rotate-[10deg] -translate-y-1/2 translate-x-1/2 flex items-center justify-center">
             <AlertTriangle className="w-8 h-8" />
          </div>
          
          <h1 className="text-8xl md:text-9xl font-black uppercase leading-none tracking-tighter mb-6 text-neo-pink">
            404
          </h1>
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 leading-tight">
            Page Not Found
          </h2>
          <p className="font-bold text-xl md:text-2xl max-w-lg mx-auto leading-relaxed mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-neo-blue text-white font-black uppercase text-xl border-4 border-black rounded-xl px-8 py-4 shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all">
            <Home className="w-6 h-6" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
