import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../lib/AuthContext";
import { GoogleLogin } from '@react-oauth/google';
import { BusinessOnboardingModal } from '../tools/BusinessOnboardingModal';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, loginWithGoogle, logout } = useAuth();
  
  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
        setIsMobileMenuOpen(false);
      } catch (err) {
        console.error("Google Login Failed", err);
      }
    }
  };
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || (path !== '/' && currentPath.startsWith(path));

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'LoanDesk', path: '/loandesk' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <BusinessOnboardingModal 
        isOpen={isProfileModalOpen} 
        onComplete={() => setIsProfileModalOpen(false)} 
        userEmail={user?.email || ''} 
      />
      <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-neo-bg">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/assets/logos/toolhub_logo.png" alt="ToolHub Logo" className="h-10 md:h-12 w-auto object-contain" />
          <div className="flex flex-col justify-center">
            <span className="text-xl md:text-2xl font-black leading-none uppercase tracking-tight">Tool<span className="text-[#3801e8]">Hub</span></span>
            <span className="text-[9px] md:text-[10px] font-bold leading-tight uppercase tracking-tight">All-In-One Utility App</span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden lg:flex items-center gap-6 font-black uppercase text-sm tracking-wide">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`px-4 py-2 transition-all rounded-xl border-2 border-transparent ${
                isActive(link.path) 
                  ? 'bg-neo-yellow border-black shadow-[4px_4px_0px_0px_#000]' 
                  : 'hover:bg-gray-200'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="font-bold text-sm bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1 rounded-lg border-2 border-black flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
              >
                {user.profile_pic ? (
                  <img src={user.profile_pic} alt="Profile" className="w-6 h-6 rounded-full border border-black object-cover shrink-0" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                {user.full_name}
              </button>
              <button 
                onClick={logout}
                className="flex items-center gap-2 bg-white text-black font-black uppercase text-sm border-4 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                Logout <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white border-2 border-black rounded-xl p-1 shadow-[4px_4px_0px_0px_#000]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_black"
                shape="pill"
                text="signin_with"
              />
            </div>
          )}

          <Link 
            to="/download" 
            className="flex items-center gap-2 bg-neo-blue text-white font-black uppercase text-sm border-4 border-black px-6 py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            Download App <Download className="w-5 h-5" />
          </Link>
        </div>

        {/* MOBILE HAMBURGER ICON */}
        <button 
          className="lg:hidden bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all z-[60]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden absolute top-20 left-0 w-full bg-neo-bg border-b-4 border-black overflow-hidden shadow-2xl z-40"
          >
            <div className="flex flex-col p-6 space-y-4 font-black uppercase text-lg tracking-wide">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full text-center px-4 py-4 rounded-xl border-4 ${
                    isActive(link.path) 
                      ? 'bg-neo-yellow border-black shadow-[4px_4px_0px_0px_#000]' 
                      : 'bg-white border-black shadow-[4px_4px_0px_0px_#000] hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
              <div className="flex flex-col gap-3 pt-6 border-t-2 border-gray-200 w-full">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="font-bold text-sm bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-2 rounded-lg border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] w-full"
                >
                  {user.profile_pic ? (
                    <img src={user.profile_pic} alt="Profile" className="w-6 h-6 rounded-full border border-black object-cover shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {user.full_name} (Edit Profile)
                </button>
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex justify-center items-center gap-2 bg-white text-black font-black uppercase border-4 border-black px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_#000] w-full"
                >
                  Logout <LogOut className="w-5 h-5" />
                </button>
              </div>
              ) : (
                <div className="w-full flex justify-center bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_#000]">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Login Failed')}
                    theme="filled_black"
                    shape="pill"
                  />
                </div>
              )}

              <Link 
                to="/download" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-neo-blue text-white w-full px-4 py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]"
              >
                Download App <Download className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </>
  );
}
