import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
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
          <div className="inline-block bg-neo-blue text-white px-4 py-2 border-4 border-black font-black text-xl mb-6 shadow-[4px_4px_0px_0px_#000] rotate-2">
            AGREEMENT
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-tight tracking-tighter">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-p:font-bold prose-p:text-gray-800 space-y-6">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ToolHub (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you do not have permission to access the Service.
            </p>

            <h2 className="text-2xl mt-8 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on ToolHub for personal, non-commercial transitory viewing only.
            </p>
            <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>Attempt to decompile or reverse engineer any software contained on ToolHub;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>

            <h2 className="text-2xl mt-8 mb-4">3. Disclaimer</h2>
            <p>
              The materials on ToolHub are provided on an 'as is' basis. ToolHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl mt-8 mb-4">4. Limitations</h2>
            <p>
              In no event shall ToolHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ToolHub, even if ToolHub or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="text-2xl mt-8 mb-4">5. Revisions and Errata</h2>
            <p>
              The materials appearing on ToolHub could include technical, typographical, or photographic errors. ToolHub does not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
            </p>

            <h2 className="text-2xl mt-8 mb-4">6. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which ToolHub operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

            <h2 className="text-2xl mt-8 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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
