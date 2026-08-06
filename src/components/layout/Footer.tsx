import React from "react";
import { Link } from "react-router-dom";

export function Footer() { 
  return ( 
    <footer className="w-full border-t-4 border-black bg-neo-pink text-black"> 
      <div className="container mx-auto px-4 py-12"> 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8"> 
          
          <div className="col-span-1 md:col-span-2 space-y-4"> 
            <div className="flex items-center gap-3">
              <img src="/assets/logos/toolhub_logo.png" alt="ToolHub Logo" className="h-10 w-auto object-contain" />
              <h2 className="text-3xl font-black uppercase tracking-tight">Tool<span className="text-[#3801e8]">Hub</span></h2>
            </div> 
            <p className="font-bold text-lg max-w-sm"> 
              The ultimate all-in-one utility toolkit. Over 150 tools perfectly crafted for everyday productivity. 
            </p> 
          </div> 
          
          <div className="space-y-4"> 
            <h3 className="font-black text-xl uppercase">Links</h3> 
            <ul className="space-y-2 font-bold"> 
              <li><Link to="/tools" className="hover:underline underline-offset-4 decoration-4">Tools</Link></li> 
              <li><Link to="/features" className="hover:underline underline-offset-4 decoration-4">Features</Link></li> 
              <li><Link to="/download" className="hover:underline underline-offset-4 decoration-4">Download App</Link></li> 
            </ul> 
          </div> 
          
          <div className="space-y-4"> 
            <h3 className="font-black text-xl uppercase">Company</h3> 
            <ul className="space-y-2 font-bold"> 
              <li><Link to="/about" className="hover:underline underline-offset-4 decoration-4">About Us</Link></li> 
              <li><Link to="/privacypolicy" className="hover:underline underline-offset-4 decoration-4">Privacy Policy</Link></li> 
              <li><Link to="/terms" className="hover:underline underline-offset-4 decoration-4">Terms of Service</Link></li> 
              <li><Link to="/contact" className="hover:underline underline-offset-4 decoration-4">Contact Us</Link></li> 
              <li><Link to="/delete-account" className="hover:underline underline-offset-4 decoration-4 text-red-900">Delete Account</Link></li> 
            </ul> 
          </div> 
          
        </div> 
        
        <div className="mt-12 pt-8 border-t-3 border-black text-center font-bold"> 
          <p>&copy; {new Date().getFullYear()} ToolHub. All rights reserved.</p> 
        </div> 
      </div> 
    </footer> 
  ); 
}
