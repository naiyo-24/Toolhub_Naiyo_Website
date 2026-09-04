import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import {
  Download, ArrowRight, Settings, Users, Shield, Star,
  WifiOff, Zap, CheckCircle2
} from "lucide-react";
import { CATEGORIES, ALL_TOOLS, getToolColor, getCategoryName } from "../data/tools";
import { AdSenseBanner } from "../components/ui/AdSenseBanner";
import { CompanyPromoBanner } from "../components/ui/CompanyPromoBanner";

const APP_SCREENSHOTS = [
  "/assets/images/1.jpeg",
  "/assets/images/2.jpeg",
  "/assets/images/3.jpeg",
  "/assets/images/4.jpeg"
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredTools, setFeaturedTools] = useState(ALL_TOOLS.slice(0, 12));

  useEffect(() => {
    // Select a constant list of featured tools (mix of different categories)
    const availableTools = ALL_TOOLS.filter(t => !t.comingSoon);
    const targetNames = [
      'DocuForge Workspace', 'QR Generator', 'JSON Formatter', 'URL Shortener',
      'Age Calculator', 'Password Generator', 'File Converter', 'Form Builder',
      'BMI Calculator', 'Expense Tracker', 'Color Picker', 'Base64 Encoder'
    ];

    let fixedTools = availableTools.filter(t => targetNames.includes(t.name));

    // Pad with other tools if some from targetNames weren't found
    if (fixedTools.length < 12) {
      const others = availableTools.filter(t => !targetNames.includes(t.name));
      fixedTools = [...fixedTools, ...others].slice(0, 12);
    }

    setFeaturedTools(fixedTools);

    // Smooth Scrolling
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Auto-slider for screenshots
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % APP_SCREENSHOTS.length);
    }, 3000);

    // Auto-slider for featured tools (3 pages of 4 tools = 12 tools)
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);

    return () => {
      lenis.destroy();
      clearInterval(timer);
      clearInterval(slideTimer);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow">
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-4 pb-8 lg:pt-10 lg:pb-24 2xl:pt-8 2xl:pb-16 overflow-hidden border-b-4 border-black bg-neo-bg" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }} >
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl 2xl:max-w-[1400px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 2xl:gap-16 items-center">
              <div className="space-y-3 lg:space-y-4 2xl:space-y-4 relative z-10 p-4 -ml-4">
                <div className="inline-block bg-neo-yellow px-4 py-2 lg:px-4 lg:py-1.5 2xl:px-8 2xl:py-3 border-4 border-black rounded-xl font-black text-2xl lg:text-2xl 2xl:text-6xl shadow-[4px_4px_0px_0px_#000] 2xl:shadow-[6px_6px_0px_0px_#000]">
                  150+
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-5xl 2xl:text-7xl font-black uppercase leading-[1] 2xl:leading-[0.9] tracking-tighter">
                  ALL-IN-ONE<br />TOOLKIT
                </h1>
                <div className="inline-block bg-neo-green px-3 py-2 lg:px-3 lg:py-1.5 2xl:px-6 2xl:py-3 border-4 border-black rounded-xl font-black text-sm lg:text-sm 2xl:text-2xl uppercase shadow-[4px_4px_0px_0px_#000] 2xl:shadow-[6px_6px_0px_0px_#000]">
                  EVERY TOOL YOU NEED. ALL IN ONE PLACE.
                </div>
                <p className="text-base lg:text-sm 2xl:text-xl font-bold max-w-lg 2xl:max-w-2xl leading-relaxed mt-4 lg:mt-2 2xl:mt-4">
                  ToolHub brings 150+ powerful utilities, AI tools, PDF solutions, QR & Barcode, Calculators and more. Fast, secure, offline and 100% free to use.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-3 2xl:gap-6 pt-4 lg:pt-2 2xl:pt-4">
                  <Link to="/download" className="inline-flex items-center justify-center gap-2 bg-neo-blue text-white font-black uppercase text-base lg:text-sm 2xl:text-2xl border-4 border-black rounded-xl px-6 py-4 lg:px-4 lg:py-3 2xl:px-8 2xl:py-5 shadow-[4px_4px_0px_0px_#000] 2xl:shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all w-full sm:w-auto">
                    DOWNLOAD NOW <Download className="w-5 h-5 lg:w-4 lg:h-4 2xl:w-8 2xl:h-8" />
                  </Link>
                  <Link to="/tools" className="inline-flex items-center justify-center gap-2 bg-white text-black font-black uppercase text-base lg:text-sm 2xl:text-2xl border-4 border-black rounded-xl px-6 py-4 lg:px-4 lg:py-3 2xl:px-8 2xl:py-5 shadow-[4px_4px_0px_0px_#000] 2xl:shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all w-full sm:w-auto">
                    EXPLORE TOOLS <ArrowRight className="w-5 h-5 lg:w-4 lg:h-4 2xl:w-8 2xl:h-8" />
                  </Link>
                </div>
                <div className="pt-6 lg:pt-4 2xl:pt-4">
                  <p className="font-bold text-sm lg:text-xs 2xl:text-base uppercase mb-2 lg:mb-1 2xl:mb-2">AVAILABLE ON</p>
                  <a href="#" className="inline-block hover:translate-y-[2px] hover:translate-x-[2px] transition-transform cursor-pointer">
                    <img src="/assets/images/play.png" alt="Get it on Google Play" className="h-[45px] lg:h-[40px] 2xl:h-[70px] w-auto object-contain" />
                  </a>
                </div>
              </div>

              {/* Mockup Slider */}
              <div className="relative flex justify-center lg:justify-end z-10 pt-6 lg:pt-0 lg:pr-8 2xl:pr-16">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: [0, -15, 0], opacity: 1 }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.6 }
                  }}
                  className="relative aspect-[738/1600] w-full max-w-[220px] md:max-w-[260px] lg:max-w-[280px] 2xl:max-w-[340px] bg-white border-[4px] 2xl:border-8 border-black shadow-2xl shadow-black/40 overflow-hidden flex flex-col rounded-xl 2xl:rounded-[2rem]"
                >
                  {/* Dynamic Island */}
                  <div className="absolute top-1.5 2xl:top-2 inset-x-0 mx-auto w-12 h-4 2xl:w-16 2xl:h-5 bg-black rounded-full z-50 shadow-md"></div>

                  {/* Image Carousel */}
                  <div className="relative w-full h-full bg-white">
                    <AnimatePresence>
                      <motion.img
                        key={currentImage}
                        src={APP_SCREENSHOTS[currentImage]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={`App Screenshot ${currentImage + 1}`}
                      />
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS BAR */}
        <section className="bg-white border-b-4 border-black py-4">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 justify-center md:border-r-4 md:border-black pr-4 py-2">
                <div className="w-12 h-12 bg-neo-purple border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black leading-none">150+</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Powerful Tools</div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-1 justify-center md:border-r-4 md:border-black pr-4 py-2">
                <div className="w-12 h-12 bg-neo-pink border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black leading-none">50K+</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Happy Users</div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-1 justify-center md:border-r-4 md:border-black pr-4 py-2">
                <div className="w-12 h-12 bg-neo-green border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black leading-none">100%</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Safe & Secure</div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-1 justify-center py-2">
                <div className="w-12 h-12 bg-neo-yellow border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                  <Star className="w-6 h-6 fill-black" />
                </div>
                <div>
                  <div className="text-3xl font-black leading-none">4.9★</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Play Store Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOANDESK PROMO BANNER */}
        <section className="bg-neo-blue border-b-4 border-black py-12 lg:py-16 relative overflow-hidden">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white">
                <span className="inline-block bg-neo-yellow text-black border-4 border-black rounded-xl font-black px-4 py-1 text-sm uppercase mb-4 shadow-[2px_2px_0px_0px_#000]">
                  New Module
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-4 leading-none">
                  Introducing<br />LoanDesk
                </h2>
                <p className="text-lg md:text-xl font-bold max-w-xl text-blue-50">
                  The ultimate Banking Verification & Document Intelligence Platform designed exclusively for loan officers and financial consultants.
                </p>
              </div>
              <div className="shrink-0 w-full lg:w-auto">
                <Link
                  to="/loandesk"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black font-black uppercase text-xl border-4 border-black rounded-xl px-8 py-5 shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                >
                  Explore Features <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="py-20 bg-neo-bg border-b-4 border-black" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: 'center' }} >
          <div className="w-full max-w-[1536px] mx-auto flex justify-center px-4">
            {/* Left Ad */}
            <div className="hidden xl:block w-[160px] shrink-0 mr-4 2xl:mr-8 mt-24">
              <div className="sticky top-24">
                <AdSenseBanner slot="9385720759" format="rectangle" style={{ minHeight: '600px', width: '160px' }} />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-6xl w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 bg-neo-bg py-4 px-2 -ml-2 md:p-4 md:-ml-4 md:flex w-full">
                <div>
                  <span className="inline-block bg-neo-yellow border-4 border-black rounded-xl font-black px-3 py-1 text-sm uppercase mb-2 shadow-[2px_2px_0px_0px_#000]"> Explore </span>
                  <h2 className="text-5xl font-black uppercase">Categories</h2>
                </div>
                <Link to="/tools" className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-white border-4 border-black rounded-xl font-black uppercase px-6 py-3 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  VIEW ALL TOOLS <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {CATEGORIES.map((cat, idx) => (
                  <Link key={idx} to={`/tools/${cat.id}`} className={`${cat.color} border-4 border-black rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#000] transition-all aspect-square`}>
                    <div className="bg-white border-4 border-black rounded-xl p-3 mb-4 shadow-[4px_4px_0px_0px_#000]">
                      {cat.icon}
                    </div>
                    <h3 className="font-black text-sm uppercase leading-tight mb-1">{cat.name}</h3>
                    <p className="font-bold text-[10px] uppercase bg-white/50 px-2 border-2 border-black rounded-lg">
                      {ALL_TOOLS.filter(t => t.category === cat.id).length} Tools
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Ad */}
            <div className="hidden xl:block w-[160px] shrink-0 ml-4 2xl:ml-8 mt-24">
              <div className="sticky top-24">
                <AdSenseBanner slot="9385720759" format="rectangle" style={{ minHeight: '600px', width: '160px' }} />
              </div>
            </div>
          </div>
        </section>

        {/* PDF TOOLS PROMO BANNER */}
        <section className="bg-neo-purple border-b-4 border-black py-12 lg:py-16 relative overflow-hidden">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white">
                <span className="inline-block bg-neo-yellow text-black border-4 border-black rounded-xl font-black px-4 py-1 text-sm uppercase mb-4 shadow-[2px_2px_0px_0px_#000]">
                  PDF Suite
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-4 leading-none">
                  DocuForge<br />PDF Tools
                </h2>
                <p className="text-lg md:text-xl font-bold max-w-xl text-purple-50">
                  Split, merge, edit, compress, and scan PDF documents right in your browser. Fast, secure, and offline-capable.
                </p>
              </div>
              <div className="shrink-0 w-full lg:w-auto">
                <Link
                  to="/tools/pdf-tools"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black font-black uppercase text-xl border-4 border-black rounded-xl px-8 py-5 shadow-[6px_6px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                >
                  Explore Tools <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </section>

        {/* COMPANY PROMO BANNER */}
        <CompanyPromoBanner />

        {/* FEATURED TOOLS */}
        <section className="py-20 border-b-4 border-black bg-neo-bg">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <div className="mb-12 inline-block">
              <span className="inline-block bg-neo-yellow border-4 border-black rounded-xl font-black px-3 py-1 text-sm uppercase mb-2 shadow-[2px_2px_0px_0px_#000]"> Trending </span>
              <h2 className="text-5xl font-black uppercase">Featured Tools</h2>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {featuredTools.slice(currentSlide * 4, currentSlide * 4 + 4).map((tool, idx) => (
                  <Link
                    key={tool.name}
                    to={tool.customUrl || `/tool/${tool.id}`}
                    className="bg-white border-4 border-black rounded-xl p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000] transition-all relative group cursor-pointer block"
                  >
                    <div className="flex gap-4 mb-4 items-start">
                      <div className={`${getToolColor(tool.category)} border-4 border-black rounded-xl p-2 shadow-[2px_2px_0px_0px_#000] shrink-0`}>
                        {tool.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-lg uppercase leading-tight mb-1 break-words">{tool.name}</h3>
                        <p className="font-bold text-[10px] uppercase bg-gray-100 px-2 py-0.5 border-2 border-black rounded-lg inline-block text-gray-700 leading-tight">
                          {getCategoryName(tool.category)}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className={`bg-black text-white border-4 border-black rounded-xl w-10 h-10 flex items-center justify-center shadow-[2px_2px_0px_0px_#000] group-hover:translate-y-[2px] group-hover:translate-x-[2px] group-hover:shadow-none transition-all`}>
                        <ArrowRight className="w-5 h-5 font-black" />
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-12 gap-2">
              {[0, 1, 2].map((dot) => (
                <button
                  key={dot}
                  onClick={() => setCurrentSlide(dot)}
                  className={`w-3 h-3 rounded-full transition-all ${currentSlide === dot
                    ? 'bg-black scale-125'
                    : 'bg-gray-300 border-2 border-black hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="bg-neo-bg">
          <div className="flex flex-col lg:flex-row border-b-4 border-black">
            <div className="lg:w-1/3 bg-neo-blue p-12 lg:p-20 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-center">
              <div className="inline-block bg-neo-yellow border-4 border-black rounded-xl font-black px-3 py-1 text-sm uppercase mb-4 shadow-[2px_2px_0px_0px_#000] w-max">
                Why Choose
              </div>
              <h2 className="text-5xl font-black uppercase mb-6 leading-none">TOOLHUB?</h2>
              <p className="font-bold text-lg">We provide a clean, fast and reliable experience with offline support and regular updates.</p>
            </div>
            <div className="lg:w-2/3 p-8 lg:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                {[
                  { title: "100% OFFLINE", desc: "Most tools work without internet.", icon: <WifiOff className="w-10 h-10" />, color: "bg-neo-purple" },
                  { title: "SECURE", desc: "Your data is safe and private.", icon: <Shield className="w-10 h-10" />, color: "bg-neo-green" },
                  { title: "FAST & LIGHT", desc: "Optimized for speed and performance.", icon: <Zap className="w-10 h-10" />, color: "bg-neo-pink" },
                  { title: "EASY TO USE", desc: "Simple, clean and user-friendly.", icon: <CheckCircle2 className="w-10 h-10" />, color: "bg-neo-yellow" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border-4 border-black rounded-xl p-6 flex flex-col items-center text-center shadow-[6px_6px_0px_0px_#000] h-full justify-center hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#000] transition-all">
                    <div className={`${item.color} border-4 border-black rounded-xl p-4 mb-6 shadow-[2px_2px_0px_0px_#000]`}>
                      {item.icon}
                    </div>
                    <h3 className="font-black text-lg uppercase mb-2 leading-tight">{item.title}</h3>
                    <p className="font-bold text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS TOOLHUB SECTION */}
        <section className="py-20 bg-white border-b-4 border-black">
          <div className="container mx-auto px-6 sm:px-8 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-8 inline-block bg-neo-yellow border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_#000] rotate-[-1deg]">What is ToolHub?</h2>
            <div className="prose prose-lg mx-auto text-left prose-headings:font-black prose-p:font-bold prose-p:text-gray-800 space-y-6">
              <p>
                ToolHub is a comprehensive suite of over 150 free, online and offline utilities designed to make your digital life easier. Whether you are a student, developer, designer, or business professional, our platform provides instant access to essential tools without the need for multiple apps or expensive subscriptions.
              </p>
              <p>
                From advanced PDF manipulation (splitting, merging, compressing) to everyday calculators (BMI, Age, EMI) and developer utilities (JSON formatter, Base64 encoder), ToolHub centralizes your workflow. We believe in high-performance, privacy-first software, which is why most of our tools run entirely in your browser using Progressive Web App (PWA) technology. Your data never leaves your device.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 bg-neo-purple border-b-4 border-black">
          <div className="container mx-auto px-6 sm:px-8 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-12 text-white text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is ToolHub completely free to use?", a: "Yes! All tools on our platform are 100% free. We sustain the platform through non-intrusive advertisements." },
                { q: "Do I need an internet connection?", a: "Many of our tools, including calculators and converters, work entirely offline once the site is loaded, thanks to our PWA architecture." },
                { q: "Is my data safe and private?", a: "Absolutely. Most file processing, such as PDF editing and image conversion, happens locally on your device. We do not upload your sensitive files to our servers." },
                { q: "Can I use ToolHub on my mobile phone?", a: "Yes, ToolHub is fully responsive and can be installed as an app on your iOS or Android device directly from your browser." },
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] rounded-xl hover:-translate-y-1 transition-transform">
                  <h3 className="font-black text-xl uppercase mb-2">{faq.q}</h3>
                  <p className="font-bold text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ADVERTISEMENT SECTION */}
        <section className="py-8 bg-neo-bg">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <AdSenseBanner slot="9385720759" style={{ minHeight: '90px' }} />
          </div>
        </section>
      </main>
    </div>
  );
}
