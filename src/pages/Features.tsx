import React from 'react';
import { Shield, Zap, WifiOff, Layout, FileText, Lock, Globe, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdSenseBanner } from '../components/ui/AdSenseBanner';


const FEATURES = [
  {
    title: '100% Offline First',
    desc: 'Never rely on an internet connection again. Our PWA architecture ensures that every core tool works seamlessly, completely offline.',
    icon: <WifiOff className="w-12 h-12" />,
    color: 'bg-neo-blue',
  },
  {
    title: 'Bank-Grade Security',
    desc: 'All file processing (PDFs, Images) happens locally on your device. Your sensitive data never touches our servers.',
    icon: <Shield className="w-12 h-12" />,
    color: 'bg-neo-green',
  },
  {
    title: 'Lightning Fast',
    desc: 'No more waiting for files to upload or download. Instant processing power driven by your own devices hardware.',
    icon: <Zap className="w-12 h-12" />,
    color: 'bg-neo-yellow',
  },
  {
    title: 'Beautiful Brutalism',
    desc: 'A striking, distraction-free user interface that stands out. High contrast, bold typography, and undeniable style.',
    icon: <Layout className="w-12 h-12" />,
    color: 'bg-neo-pink',
  },
  {
    title: 'Massive Arsenal',
    desc: 'From PDF manipulation to AI assistants, get access to over 150 meticulously crafted utilities in one place.',
    icon: <FileText className="w-12 h-12" />,
    color: 'bg-neo-purple',
  },
  {
    title: 'Install Anywhere',
    desc: 'Works perfectly as a web app on desktop, or install it natively to your home screen on iOS and Android.',
    icon: <Smartphone className="w-12 h-12" />,
    color: 'bg-[#9333EA]',
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block bg-neo-yellow border-4 border-black px-6 py-2 font-black uppercase text-2xl shadow-[6px_6px_0px_0px_#000] mb-6 rotate-[-2deg]"
          >
            Why ToolHub?
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6 bg-white border-4 border-black inline-block p-4 shadow-[12px_12px_0px_0px_#000]">
            FEATURES
          </h1>
          <p className="font-bold text-2xl max-w-3xl mx-auto mt-8 bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000]">
            Built with speed, privacy, and incredible design in mind. ToolHub isn't just another utility app; it's a completely reimagined toolkit. We analyzed hundreds of common digital tasks and created streamlined, bloat-free solutions for each one.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {FEATURES.map((feature, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              key={idx}
              className="bg-white border-4 border-black flex flex-col md:flex-row shadow-[12px_12px_0px_0px_#000] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_#000] transition-all group"
            >
              <div className={`${feature.color} border-b-4 md:border-b-0 md:border-r-4 border-black p-8 flex items-center justify-center shrink-0 group-hover:bg-neo-yellow transition-colors`}>
                <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black uppercase mb-4 leading-tight">{feature.title}</h3>
                <p className="font-bold text-lg text-gray-800">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DEEP DIVE SECTION */}
        <div className="mt-24 bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_#000]">
          <div className="inline-block bg-neo-pink px-4 py-1 border-4 border-black font-black uppercase mb-6 rotate-[-1deg] shadow-[4px_4px_0px_0px_#000]">
            Under The Hood
          </div>
          <h2 className="text-4xl font-black uppercase mb-8">Deep Dive Into Our Technology</h2>
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-p:font-bold prose-p:text-gray-700 space-y-6 text-left">
            <p>
              Traditional online tools upload your files to remote servers, process them, and then force you to download the result. This is slow, requires a stable internet connection, and poses significant privacy risks for sensitive documents.
            </p>
            <h3 className="text-2xl mt-8 mb-4 uppercase">The Progressive Web App (PWA) Advantage</h3>
            <p>
              ToolHub is built as a Progressive Web App utilizing cutting-edge WebAssembly (Wasm) and Service Workers. When you use our PDF tools or image converters, the actual computation happens right inside your browser using your device's CPU. This means operations are instantaneous and your files never leave your computer. 
            </p>
            <h3 className="text-2xl mt-8 mb-4 uppercase">Installable and Native-Feeling</h3>
            <p>
              You don't need to visit the app store to install ToolHub. Simply click the install icon in your browser's address bar to add ToolHub to your home screen or desktop. It behaves exactly like a native application, complete with offline support, an icon, and a standalone window, providing an immersive and distraction-free environment.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="bg-neo-blue border-4 border-black p-12 shadow-[16px_16px_0px_0px_#000] inline-block relative max-w-4xl w-full">
            <div className="absolute -top-6 -right-6 bg-neo-pink border-4 border-black px-4 py-2 font-black uppercase text-xl shadow-[4px_4px_0px_0px_#000] rotate-[5deg]">
              No Signup Required
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-6">Ready to upgrade your workflow?</h2>
            <button className="bg-white text-black font-black uppercase text-2xl border-4 border-black px-12 py-6 shadow-[8px_8px_0px_0px_#000] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_0px_#000] transition-all">
              Start Using Tools Now
            </button>
          </div>
        </div>

      </div>
    
        {/* ADVERTISEMENT SECTION */}
        <section className="py-8 bg-neo-bg mt-auto">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <AdSenseBanner slot="9385720759" style={{ minHeight: '90px' }} />
          </div>
        </section>
</div>
  );
}
