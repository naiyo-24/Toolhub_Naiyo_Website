import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES, ALL_TOOLS, getToolColor, getCategoryName } from '../data/tools';
import { ComingSoonModal } from '../components/ui/ComingSoonModal';
import { MobileOnlyModal } from '../components/ui/MobileOnlyModal';
import { LoginRequiredModal } from '../components/ui/LoginRequiredModal';
import { useAuth } from '../lib/AuthContext';

export default function ToolsDirectory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [comingSoonTool, setComingSoonTool] = useState<string | null>(null);
  const [mobileOnlyTool, setMobileOnlyTool] = useState<string | null>(null);
  const [loginRequiredTool, setLoginRequiredTool] = useState<string | null>(null);

  const filteredTools = ALL_TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    getCategoryName(tool.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-6 sm:px-8 max-w-[1600px]">
        
        {/* HEADER & SEARCH */}
        <div className="bg-white border-4 border-black p-8 md:p-12 mb-12 shadow-[12px_12px_0px_0px_#000] relative rounded-2xl flex flex-col items-center text-center">
          <div className="absolute -top-6 -left-4 md:-left-6 bg-neo-yellow border-4 border-black px-4 py-2 font-black uppercase text-xl shadow-[4px_4px_0px_0px_#000] rotate-[-5deg] rounded-xl">
            Explore 150+
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-none mt-4">Tools Directory</h1>
          <p className="font-bold text-xl max-w-3xl mx-auto mb-8">Search through our massive collection of free, offline-capable utilities designed to supercharge your productivity.</p>
          
          <div className="relative flex w-full max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-8 w-8 text-black" />
            </div>
            <input 
              type="text" 
              placeholder="SEARCH FOR ANY TOOL..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-4 border-black py-4 pl-16 pr-6 text-xl md:text-2xl font-black uppercase placeholder-gray-400 focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#000] transition-all rounded-xl"
            />
          </div>
        </div>

        {/* CATEGORIES GRID */}
        {!searchQuery && (
          <div className="mb-16">
            <h2 className="text-3xl font-black uppercase mb-6 inline-block bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000] rounded-xl">Browse By Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((cat, idx) => (
                <Link key={idx} to={`/tools/${cat.id}`} className={`${cat.color} border-4 border-black p-6 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#000] transition-all aspect-square group rounded-2xl`}>
                  <div className="bg-white border-4 border-black p-3 mb-4 shadow-[4px_4px_0px_0px_#000] group-hover:scale-110 transition-transform rounded-xl">
                    {cat.icon}
                  </div>
                  <h3 className="font-black text-sm uppercase leading-tight">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* TOOLS GRID */}
        <div>
          <h2 className="text-3xl font-black uppercase mb-6 inline-block bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000] rounded-xl">
            {searchQuery ? 'Search Results' : 'All Tools'}
          </h2>
          {CATEGORIES.filter(cat => filteredTools.some(tool => tool.category === cat.id)).length > 0 ? (
            <div className="space-y-12">
              {CATEGORIES.filter(cat => filteredTools.some(tool => tool.category === cat.id)).map((cat, groupIdx) => (
                <div key={cat.id} className="bg-gray-50 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] rounded-2xl">
                  <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                    <div className={`${cat.color} border-4 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000]`}>
                      {cat.icon}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black uppercase">{cat.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-6">
                    {filteredTools.filter(tool => tool.category === cat.id).map((tool, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: (idx % 15) * 0.05 }}
                        key={idx} 
                        onClick={() => {
                          if (tool.comingSoon) setComingSoonTool(tool.name);
                          else if ((tool as any).mobileOnly) setMobileOnlyTool(tool.name);
                          else if ((tool as any).requiresLogin && !user) setLoginRequiredTool(tool.name);
                          else if (tool.category === 'business') navigate(`/business-tools/${(tool as any).id}`);
                          else navigate(`/tool/${(tool as any).id}`);
                        }}
                        className="bg-white border-4 border-black p-4 xl:p-5 flex flex-col justify-between shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000] transition-all relative group cursor-pointer rounded-2xl"
                      >
                        {tool.comingSoon ? (
                          <div className="absolute -top-3 -right-3 bg-neo-yellow border-4 border-black px-2 py-1 font-black uppercase text-[10px] xl:text-xs shadow-[2px_2px_0px_0px_#000] rotate-12 z-10">
                            Coming Soon
                          </div>
                        ) : (tool as any).mobileOnly ? (
                          <div className="absolute -top-3 -right-3 bg-neo-blue text-white border-4 border-black px-2 py-1 font-black uppercase text-[10px] xl:text-xs shadow-[2px_2px_0px_0px_#000] rotate-12 z-10">
                            App Only
                          </div>
                        ) : (tool as any).requiresLogin && (
                          <div className="absolute -top-3 -right-3 bg-[#ff4d4d] text-white border-4 border-black px-2 py-1 font-black uppercase text-[10px] xl:text-xs shadow-[2px_2px_0px_0px_#000] rotate-12 z-10">
                            Login Req
                          </div>
                        )}
                        <div className="flex flex-col gap-3 xl:gap-4 mb-16 items-start min-w-0 flex-1">
                          <div className={`${getToolColor(tool.category)} border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000] rounded-xl shrink-0`}>
                            {tool.icon}
                          </div>
                          <div className="w-full min-w-0 flex-1">
                            <h3 className="font-black text-xl xl:text-2xl uppercase leading-tight mb-2 break-words">{tool.name}</h3>
                            <span className="inline-block bg-gray-200 border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase mb-2 rounded-lg">
                              {getCategoryName(tool.category)}
                            </span>
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 xl:bottom-4 xl:right-4">
                          <div className="bg-black text-white border-4 border-black w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center shadow-[4px_4px_0px_0px_#000] rounded-xl group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="w-5 h-5 xl:w-6 xl:h-6 font-black" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_#000] rounded-2xl">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-3xl font-black uppercase mb-2">No Tools Found</h3>
              <p className="font-bold text-xl">Try searching for something else like "PDF" or "Image".</p>
            </div>
          )}
        </div>
      </div>
      <ComingSoonModal 
        isOpen={!!comingSoonTool}
        onClose={() => setComingSoonTool(null)}
        toolName={comingSoonTool || ''}
      />
      <MobileOnlyModal 
        isOpen={!!mobileOnlyTool}
        onClose={() => setMobileOnlyTool(null)}
        toolName={mobileOnlyTool || ''}
      />
      <LoginRequiredModal 
        isOpen={!!loginRequiredTool}
        onClose={() => setLoginRequiredTool(null)}
        toolName={loginRequiredTool || ''}
      />
    </div>
  );
}
