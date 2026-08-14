import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ScanLine, 
  PieChart, 
  FileCheck, 
  Files, 
  Download,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Verification Hub",
    desc: "Instantly verify GST, PAN, Udyam, MCA, and IFSC using official government endpoints.",
    color: "bg-neo-blue"
  },
  {
    icon: <ScanLine className="w-8 h-8" />,
    title: "Document Scanner & OCR",
    desc: "Professional scanner with edge detection and smart OCR extraction for Indian IDs.",
    color: "bg-neo-pink"
  },
  {
    icon: <PieChart className="w-8 h-8" />,
    title: "Bank Statement Analysis",
    desc: "Auto-detect debits, credits, EMI bounces, and cash flow trends.",
    color: "bg-neo-yellow"
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Financial Analysis",
    desc: "Calculate DSCR, Current Ratio, Debt Equity, and generate loan assessments.",
    color: "bg-neo-green"
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Case Management",
    desc: "Track onboarding status, attach documents, and manage verification pipelines.",
    color: "bg-neo-purple"
  },
  {
    icon: <FileCheck className="w-8 h-8" />,
    title: "Report Generation",
    desc: "Generate professional banker reports & credit analysis summaries in seconds.",
    color: "bg-white"
  }
];

export default function LoanDesk() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-6xl relative z-10 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-neo-yellow px-4 py-2 border-4 border-black rounded-xl font-black text-sm md:text-xl shadow-[4px_4px_0px_0px_#000] mb-6 uppercase"
        >
          ToolHub Banker Edition
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black uppercase leading-none tracking-tight mb-8"
        >
          LOANDESK
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-3xl font-bold max-w-4xl mx-auto leading-relaxed mb-10 bg-white p-6 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]"
        >
          The ultimate Banking Verification & Document Intelligence Platform designed for loan officers, NBFC agents, and financial consultants.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href="https://play.google.com/store/apps/details?id=com.naiyo24.tool_hub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-neo-blue text-white font-black uppercase text-xl md:text-2xl border-4 border-black rounded-xl px-8 py-5 shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all w-full sm:w-auto"
          >
            Get Mobile App <Download className="w-6 h-6" />
          </a>
          <Link 
            to="/tools" 
            className="flex items-center justify-center gap-3 bg-white text-black font-black uppercase text-xl md:text-2xl border-4 border-black rounded-xl px-8 py-5 shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all w-full sm:w-auto"
          >
            Explore Tools <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </section>

      {/* Mockup Showcase */}
      <section className="container mx-auto px-4 max-w-7xl relative z-10 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="bg-white border-[6px] border-black rounded-[2rem] p-4 md:p-8 shadow-[16px_16px_0px_0px_#000] overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4 border-b-4 border-black pb-4">
            <div className="w-4 h-4 rounded-full bg-neo-pink border-2 border-black"></div>
            <div className="w-4 h-4 rounded-full bg-neo-yellow border-2 border-black"></div>
            <div className="w-4 h-4 rounded-full bg-neo-green border-2 border-black"></div>
            <div className="ml-4 font-black uppercase text-xl">LoanDesk Dashboard Preview</div>
          </div>
          <img 
            src="/assets/images/bankmock.png" 
            alt="LoanDesk Banker Dashboard Mockup" 
            className="w-full h-auto rounded-xl border-4 border-black"
          />
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-4 max-w-6xl mb-24">
        <div className="bg-neo-bg py-8">
          <h2 className="text-5xl font-black uppercase text-center mb-16">
            <span className="bg-neo-pink text-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000] inline-block -rotate-2">
              Powerful
            </span> Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${feat.color} ${feat.color === 'bg-white' ? 'text-black' : 'text-black'} border-4 border-black rounded-2xl p-8 flex flex-col items-start shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] transition-all`}
              >
                <div className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] mb-6">
                  {feat.icon}
                </div>
                <h3 className="font-black text-2xl uppercase mb-4 leading-tight">{feat.title}</h3>
                <p className="font-bold text-lg leading-relaxed mix-blend-color-burn">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="container mx-auto px-4 max-w-4xl text-center">
        <div className="bg-black text-white border-[6px] border-black p-12 md:p-20 rounded-3xl shadow-[16px_16px_0px_0px_#neo-yellow] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neo-blue rounded-full mix-blend-screen filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neo-pink rounded-full mix-blend-screen filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-none">Ready to revolutionize your workflow?</h2>
            <p className="text-xl md:text-2xl font-bold mb-10 text-gray-300">
              The full LoanDesk banker experience is available exclusively on the ToolHub Mobile Application.
            </p>
            
            <a 
              href="https://play.google.com/store/apps/details?id=com.naiyo24.tool_hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:scale-105 hover:-translate-y-2 transition-transform"
            >
              <img src="/assets/images/play.png" alt="Get it on Google Play" className="h-24 mx-auto" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
