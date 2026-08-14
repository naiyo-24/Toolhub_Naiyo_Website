import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES, ALL_TOOLS, getToolColor } from '../data/tools';
import { ComingSoonModal } from '../components/ui/ComingSoonModal';
import { MobileOnlyModal } from '../components/ui/MobileOnlyModal';
import { LoginRequiredModal } from '../components/ui/LoginRequiredModal';
import { AppPromoModal } from '../components/ui/AppPromoModal';
import { useAuth } from '../lib/AuthContext';

export default function Category() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { category } = useParams<{ category: string }>();
  const catKey = category?.toLowerCase() || '';
  const currentCategory = CATEGORIES.find(c => c.id === catKey);

  const [comingSoonTool, setComingSoonTool] = React.useState<string | null>(null);
  const [mobileOnlyTool, setMobileOnlyTool] = React.useState<string | null>(null);
  const [loginRequiredTool, setLoginRequiredTool] = React.useState<string | null>(null);
  const [showPromo, setShowPromo] = React.useState(false);

  React.useEffect(() => {
    if (catKey === 'pdf-tools') {
      const timer = setTimeout(() => setShowPromo(true), 600);
      return () => clearTimeout(timer);
    }
  }, [catKey]);

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center p-4">
        <div className="bg-white border-4 border-black p-12 text-center shadow-[12px_12px_0px_0px_#000]">
          <h1 className="text-6xl font-black uppercase mb-4 text-red-500">404</h1>
          <h2 className="text-3xl font-black uppercase mb-6">Category Not Found</h2>
          <Link to="/tools" className="inline-block bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const categoryTools = ALL_TOOLS.filter(t => t.category === catKey);

  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* BACK BUTTON */}
        <Link to="/tools" className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:underline decoration-4 underline-offset-4">
          <ArrowLeft className="w-6 h-6" /> Back to All Tools
        </Link>

        {/* CATEGORY HEADER */}
        <div className={`${currentCategory.color} border-4 border-black p-8 md:p-16 mb-12 shadow-[12px_12px_0px_0px_#000] flex flex-col md:flex-row items-center gap-8 rounded-2xl`}>
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl">
            {currentCategory.icon}
          </div>
          <div className="text-center md:text-left text-black">
            <h1 className="text-5xl md:text-8xl font-black uppercase leading-none mb-4 tracking-tight">
              {currentCategory.id === 'business' ? 'Business Dashboard' : currentCategory.name}
            </h1>
            <p className="font-bold text-xl md:text-2xl max-w-2xl bg-white/70 px-4 py-2 border-4 border-black inline-block rounded-xl">{currentCategory.desc}</p>
          </div>
        </div>

        {/* TOOLS GRID */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000] rounded-xl">
              {categoryTools.length} Tools Available
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={idx} 
                onClick={() => {
                  if (tool.comingSoon) setComingSoonTool(tool.name);
                  else if (tool.mobileOnly) setMobileOnlyTool(tool.name);
                  else if (tool.requiresLogin && !user) setLoginRequiredTool(tool.name);
                  else if (tool.customUrl) navigate(tool.customUrl);
                  else if (tool.category === 'business') navigate(`/business-tools/${tool.id}`);
                  else navigate(`/tool/${tool.id}`);
                }}
                className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 hover:-rotate-1 hover:shadow-[16px_16px_0px_0px_#000] transition-all relative group cursor-pointer rounded-2xl"
              >
                {tool.comingSoon ? (
                  <div className="absolute -top-3 -right-3 bg-neo-yellow border-4 border-black px-3 py-1 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000] rotate-12 z-10">
                    Coming Soon
                  </div>
                ) : tool.mobileOnly ? (
                  <div className="absolute -top-3 -right-3 bg-neo-blue text-white border-4 border-black px-3 py-1 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000] rotate-12 z-10">
                    App Only
                  </div>
                ) : tool.requiresLogin && (
                  <div className="absolute -top-3 -right-3 bg-[#ff4d4d] text-white border-4 border-black px-3 py-1 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000] rotate-12 z-10">
                    Login Req
                  </div>
                )}
                <div className="flex gap-4 mb-6 items-start">
                  <div className={`${getToolColor(tool.category)} border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000] rounded-xl shrink-0`}>
                    {tool.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-2xl uppercase leading-tight mb-2 break-words">{tool.name}</h3>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black text-white border-4 border-black w-10 h-10 flex items-center justify-center shadow-[4px_4px_0px_0px_#000] rounded-xl group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-6 h-6 font-black" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
      <AppPromoModal 
        isOpen={showPromo} 
        onClose={() => setShowPromo(false)} 
      />
    </div>
  );
}
