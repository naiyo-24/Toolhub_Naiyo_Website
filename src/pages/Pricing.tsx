import React from 'react';
import { Check, Star, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6">
            <span className="bg-neo-yellow border-4 border-black inline-block p-4 shadow-[8px_8px_0px_0px_#000] rotate-[-2deg]">100%</span>
            <br />FREE FOREVER
          </h1>
          <p className="font-bold text-2xl max-w-2xl mx-auto mt-8 bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000]">
            No subscriptions. No hidden fees. No paywalls. We believe powerful tools should be accessible to everyone.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          
          {/* FREE TIER */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border-4 border-black p-8 flex flex-col shadow-[12px_12px_0px_0px_#000]"
          >
            <div className="mb-8 border-b-4 border-black pb-8">
              <h2 className="text-4xl font-black uppercase mb-2">Basic User</h2>
              <div className="text-6xl font-black">$0<span className="text-xl text-gray-500">/mo</span></div>
            </div>
            
            <ul className="space-y-4 mb-12 flex-grow">
              {[
                'Full access to 150+ Tools',
                '100% Offline Support (PWA)',
                'Zero Tracking or Analytics',
                'Local Device Processing',
                'Unlimited Usage'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 font-bold text-lg">
                  <div className="bg-neo-green border-2 border-black rounded-full p-1"><Check className="w-4 h-4" /></div>
                  {item}
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-black text-white font-black uppercase text-xl border-4 border-black py-4 shadow-[6px_6px_0px_0px_#FFD13B] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#FFD13B] transition-all">
              Start Using Now
            </button>
          </motion.div>

          {/* SUPPORTER TIER */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-neo-pink border-4 border-black p-8 flex flex-col shadow-[12px_12px_0px_0px_#000] relative lg:-mt-8 lg:mb-8"
          >
            <div className="absolute -top-6 inset-x-0 mx-auto w-max bg-neo-yellow border-4 border-black px-6 py-2 font-black uppercase text-xl shadow-[4px_4px_0px_0px_#000]">
              <Star className="w-6 h-6 inline-block mr-2 -mt-1 fill-black" />
              Support The Project
            </div>
            
            <div className="mb-8 border-b-4 border-black pb-8 pt-4">
              <h2 className="text-4xl font-black uppercase mb-2">Buy Us A Coffee</h2>
              <div className="text-6xl font-black">$5<span className="text-xl text-black/60">/one-time</span></div>
            </div>
            
            <ul className="space-y-4 mb-12 flex-grow text-black">
              {[
                'Everything in Basic',
                'Warm Fuzzy Feeling',
                'Help Cover Server Costs',
                'Fund Future Tool Updates',
                'Priority Feature Requests'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 font-bold text-lg">
                  <div className="bg-white border-2 border-black rounded-full p-1"><Check className="w-4 h-4" /></div>
                  {item}
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-white text-black font-black uppercase text-xl border-4 border-black py-4 shadow-[6px_6px_0px_0px_#000] flex items-center justify-center gap-3 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all">
              <Coffee className="w-6 h-6" /> Donate
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
