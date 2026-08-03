import React from 'react';
import { ArrowRight, Zap, Shield, WifiOff, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_#000] relative rounded-2xl mb-16">
          <div className="absolute -top-6 -left-6 bg-neo-pink border-4 border-black px-4 py-2 font-black uppercase text-xl shadow-[4px_4px_0px_0px_#000] rotate-[-5deg] rounded-xl">
            Our Story
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-8 leading-none mt-4 text-center">About ToolHub</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 p-6 bg-gray-100 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000]">
            <div className="text-center md:text-right flex-1">
              <h3 className="font-black text-2xl uppercase mb-2">A Proud Product Of</h3>
              <p className="font-bold text-gray-700">Innovating digital solutions for a better tomorrow.</p>
            </div>
            <div className="shrink-0 bg-white p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:scale-105 transition-transform">
              <img src="/assets/logos/naiyo24_logo.jpeg" alt="Naiyo24 Logo" className="h-24 w-auto object-contain rounded-lg" />
            </div>
            <div className="flex-1 hidden md:block">
              {/* Spacer for centering */}
            </div>
          </div>

          <div className="space-y-8 text-lg font-medium leading-relaxed">
            <p>
              Welcome to <span className="font-black">ToolHub</span>, the ultimate all-in-one utility application designed to bring every digital tool you could ever need into one singular, blazing-fast platform.
            </p>
            
            <p>
              Born from a vision by <span className="font-black bg-neo-yellow px-1 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000]">Naiyo24</span>, we realized that people were wasting too much time jumping between dozens of different websites, downloading sketchy applications, and paying ridiculous subscriptions just to accomplish simple daily tasks like converting a PDF, generating a QR code, or formatting JSON.
            </p>

            <div className="bg-neo-blue text-black p-8 border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_#000] my-10 transform hover:-rotate-1 transition-transform">
              <h2 className="text-3xl font-black uppercase mb-4">Our Mission</h2>
              <p className="font-bold text-xl leading-tight">
                To democratize digital utility. We believe that powerful, everyday tools should be accessible to everyone—completely free, overwhelmingly fast, and completely secure.
              </p>
            </div>

            <h2 className="text-3xl font-black uppercase mb-6 mt-12 inline-block border-b-4 border-black pb-2">Why We Built ToolHub</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] flex gap-4">
                <WifiOff className="w-8 h-8 shrink-0 text-neo-purple" />
                <div>
                  <h4 className="font-black uppercase mb-1">Offline First</h4>
                  <p className="text-sm font-bold text-gray-600">Most of our tools run entirely in your browser or locally on your device, meaning you don't even need an internet connection.</p>
                </div>
              </div>
              
              <div className="bg-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] flex gap-4">
                <Shield className="w-8 h-8 shrink-0 text-neo-green" />
                <div>
                  <h4 className="font-black uppercase mb-1">Privacy Focused</h4>
                  <p className="text-sm font-bold text-gray-600">Your data belongs to you. We process files locally whenever possible, ensuring nothing is uploaded to sketchy third-party servers.</p>
                </div>
              </div>

              <div className="bg-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] flex gap-4">
                <Zap className="w-8 h-8 shrink-0 text-neo-pink" />
                <div>
                  <h4 className="font-black uppercase mb-1">Blazing Fast</h4>
                  <p className="text-sm font-bold text-gray-600">No bloatware, no heavy loading screens. Just instant access to over 150+ utilities optimized for performance.</p>
                </div>
              </div>

              <div className="bg-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] flex gap-4">
                <CheckCircle2 className="w-8 h-8 shrink-0 text-neo-yellow" />
                <div>
                  <h4 className="font-black uppercase mb-1">Completely Free</h4>
                  <p className="text-sm font-bold text-gray-600">We don't hide core features behind paywalls. ToolHub is built to serve the community, accessible to students, professionals, and everyone in between.</p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center border-t-4 border-black pt-12">
              <h3 className="text-2xl font-black uppercase mb-6">Ready to supercharge your workflow?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/tools" className="bg-neo-yellow border-4 border-black font-black px-8 py-4 uppercase text-lg shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all rounded-xl inline-flex items-center justify-center gap-2">
                  Explore Tools <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/download" className="bg-black text-white border-4 border-black font-black px-8 py-4 uppercase text-lg shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all rounded-xl inline-flex items-center justify-center">
                  Download App
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
