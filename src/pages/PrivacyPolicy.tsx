import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-neo-bg pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-8 border-black rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_0px_#000]"
        >
          <div className="inline-block bg-neo-pink px-4 py-2 border-4 border-black font-black text-xl mb-6 shadow-[4px_4px_0px_0px_#000] -rotate-2">
            LEGAL
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-tight tracking-tighter">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-p:font-bold prose-p:text-gray-800 space-y-6">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to ToolHub ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and use our application.
            </p>

            <h2 className="text-2xl mt-8 mb-4">2. Data We Collect</h2>
            <p>
              ToolHub is designed to be privacy-first. The vast majority of our tools operate entirely locally on your device (offline-first). We do not collect, store, or transmit your personal files, images, or documents to our servers.
            </p>
            <p>
              If you create an account or contact us, we may collect:
            </p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Identity Data (such as your name or username)</li>
              <li>Contact Data (such as your email address)</li>
              <li>Technical Data (such as internet protocol (IP) address, browser type and version)</li>
            </ul>

            <h2 className="text-2xl mt-8 mb-4">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To monitor the usage of our Service</li>
            </ul>

            <h2 className="text-2xl mt-8 mb-4">4. Third-Party Links</h2>
            <p>
              Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
            </p>

            <h2 className="text-2xl mt-8 mb-4">5. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
            </p>

            <h2 className="text-2xl mt-8 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-none font-bold text-gray-800 space-y-2 mt-4">
              <li><strong>Contact Person:</strong> Debasish Baidya</li>
              <li><strong>Email:</strong> <a href="mailto:naiyooffice@gmail.com" className="text-neo-blue hover:underline">naiyooffice@gmail.com</a></li>
              <li><strong>Phone:</strong> +91 62891 71798</li>
              <li><strong>Address:</strong> Naiyo24 Private Limited, 1/30B, Chittaranjan Colony, Baghajatin, Kolkata, West Bengal 700032, India</li>
              <li><strong>Business Hours:</strong> Mon - Sat: 12:00 PM - 7:00 PM</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
