import React from 'react';
import { Target, Users, Zap, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* HERO SECTION */}
        <div className="relative mb-24 mt-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neo-yellow border-4 border-black shadow-[12px_12px_0px_0px_#000] rotate-[10deg] -z-10 hidden md:block"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neo-pink border-4 border-black shadow-[12px_12px_0px_0px_#000] -rotate-[15deg] -z-10 hidden md:block"></div>
          
          <div className="bg-white border-4 border-black p-8 md:p-16 shadow-[16px_16px_0px_0px_#000] relative z-10">
            <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6">
              THE STORY <br /> BEHIND <br /> <span className="bg-neo-blue text-white px-2 mt-2 inline-block border-4 border-black">TOOLHUB</span>
            </h1>
            <p className="font-bold text-xl md:text-2xl max-w-2xl leading-relaxed">
              We were tired of ad-filled, slow, and privacy-invading online tools. So we built the ultimate offline-first utility toolkit. Fast, free, and unapologetically brutalist.
            </p>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-12 bg-gray-100 border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] max-w-3xl">
              <div className="shrink-0 bg-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all">
                <img src="/assets/logos/naiyo24_logo.jpeg" alt="Naiyo24 Logo" className="h-16 md:h-20 w-auto object-contain rounded-lg" />
              </div>
              <div>
                <h3 className="font-black text-2xl uppercase mb-1">A Proud Product Of Naiyo24</h3>
                <p className="font-bold text-lg text-gray-700 leading-tight">
                  ToolHub is built and maintained by the Naiyo24 family. Our vision is to democratize digital utilities by providing robust, completely free tools to supercharge your workflow without compromising on privacy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MISSION STRIPS */}
        <div className="space-y-8 mb-24">
          
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-neo-purple border-4 border-black p-8 flex flex-col md:flex-row items-center gap-8 shadow-[12px_12px_0px_0px_#000] ml-0 md:ml-12"
          >
            <div className="bg-white border-4 border-black p-6 shrink-0">
              <Target className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase mb-2 text-white">Our Mission</h2>
              <p className="font-bold text-lg text-white">To democratize access to digital utilities by providing a completely free, highly performant, and privacy-respecting platform that anyone can use.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-neo-green border-4 border-black p-8 flex flex-col md:flex-row items-center gap-8 shadow-[12px_12px_0px_0px_#000] mr-0 md:mr-12"
          >
            <div className="bg-white border-4 border-black p-6 shrink-0">
              <Terminal className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase mb-2">Built For Doers</h2>
              <p className="font-bold text-lg">Whether you are a developer, a designer, or a student, ToolHub is designed to get out of your way. No splash screens, no logins—just tools that work.</p>
            </div>
          </motion.div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_#000]">
            <div className="text-6xl font-black mb-2">150+</div>
            <div className="font-bold uppercase tracking-widest text-sm bg-neo-yellow border-2 border-black inline-block px-3 py-1">Active Tools</div>
          </div>
          <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_#000]">
            <div className="text-6xl font-black mb-2">0</div>
            <div className="font-bold uppercase tracking-widest text-sm bg-neo-pink border-2 border-black inline-block px-3 py-1">Data Collected</div>
          </div>
          <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_#000]">
            <div className="text-6xl font-black mb-2">100%</div>
            <div className="font-bold uppercase tracking-widest text-sm bg-neo-blue text-white border-2 border-black inline-block px-3 py-1">Offline Capable</div>
          </div>
        </div>

      </div>
    </div>
  );
}
