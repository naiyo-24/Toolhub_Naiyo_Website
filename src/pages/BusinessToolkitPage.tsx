import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Activity, PieChart, Calculator, FileText, User, ShoppingCart, Store } from 'lucide-react';
import { ALL_TOOLS } from '../data/tools';

export default function BusinessToolkitPage() {
  const businessTools = ALL_TOOLS.filter(t => t.category === 'business');

  return (
    <div className="min-h-screen bg-neo-bg font-sans pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/tools/business" className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:underline decoration-4 underline-offset-4">
          <ArrowLeft className="w-6 h-6" /> Back to Business Tools Category
        </Link>
        
        <div className="bg-neo-yellow border-4 border-black p-8 md:p-16 mb-12 shadow-[12px_12px_0px_0px_#000] flex flex-col md:flex-row items-center gap-8 rounded-2xl">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl">
            <Briefcase className="w-16 h-16" />
          </div>
          <div className="text-center md:text-left text-black">
            <h1 className="text-5xl md:text-6xl font-black uppercase leading-none mb-4 tracking-tight">Business Dashboard</h1>
            <p className="font-bold text-xl md:text-2xl max-w-2xl bg-white/70 px-4 py-2 border-4 border-black inline-block rounded-xl">
              Access your full suite of business management tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTools.map(tool => (
            <Link 
              key={tool.id} 
              to={`/business-tools/${tool.id}`}
              className="bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#000] transition-all flex flex-col items-start gap-4"
            >
              <div className="bg-neo-blue text-white border-4 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-black text-2xl uppercase mb-1">{tool.name}</h3>
                <p className="font-bold text-gray-600">Access {tool.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
