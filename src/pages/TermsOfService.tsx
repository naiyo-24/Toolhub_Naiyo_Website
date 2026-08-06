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
            <p><strong>Effective Date:</strong> August 6, 2026<br/>
            <strong>Last Updated:</strong> August 6, 2026</p>

            <h2 className="text-2xl mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By downloading, installing, or using ToolHub24, you agree to these Terms of Service.</p>
            <p>If you do not agree with these Terms, please discontinue use of the application.</p>

            <h2 className="text-2xl mt-8 mb-4">2. Description of Service</h2>
            <p>ToolHub24 provides productivity and utility tools including document tools, PDF tools, image tools, calculators, QR and barcode utilities, student tools, business tools, health utilities, travel tools, reminders, and other productivity features.</p>
            <p>Features may change or be updated at any time.</p>

            <h2 className="text-2xl mt-8 mb-4">3. User Accounts</h2>
            <p>Some features require Google Sign-In.</p>
            <p>You are responsible for maintaining the security of your account.</p>

            <h2 className="text-2xl mt-8 mb-4">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Upload malicious files</li>
              <li>Attempt unauthorized access</li>
              <li>Reverse engineer the application</li>
              <li>Violate applicable laws</li>
              <li>Interfere with other users</li>
              <li>Misuse the services</li>
            </ul>

            <h2 className="text-2xl mt-8 mb-4">5. File Processing</h2>
            <p>Files selected by users are processed only to perform the requested operation.</p>
            <p>Users remain responsible for the legality and ownership of all uploaded content.</p>

            <h2 className="text-2xl mt-8 mb-4">6. Intellectual Property</h2>
            <p>All trademarks, branding, logos, software, graphics, and content related to ToolHub24 remain the property of ToolHub24 or its licensors.</p>
            <p>Unauthorized copying, redistribution, or modification is prohibited.</p>

            <h2 className="text-2xl mt-8 mb-4">7. Privacy</h2>
            <p>Your use of ToolHub24 is also governed by our Privacy Policy.</p>

            <h2 className="text-2xl mt-8 mb-4">8. Third-Party Services</h2>
            <p>ToolHub24 integrates with services such as:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Google Sign-In</li>
              <li>Firebase Authentication</li>
              <li>Google Play Services</li>
            </ul>
            <p>These services operate under their own terms and privacy policies.</p>

            <h2 className="text-2xl mt-8 mb-4">9. Limitation of Liability</h2>
            <p>ToolHub24 is provided on an "AS IS" and "AS AVAILABLE" basis.</p>
            <p>We make no guarantees regarding uninterrupted service, accuracy, or availability.</p>
            <p>To the fullest extent permitted by law, ToolHub24 shall not be liable for indirect, incidental, consequential, or special damages arising from the use of the application.</p>

            <h2 className="text-2xl mt-8 mb-4">10. Suspension or Termination</h2>
            <p>We may suspend or terminate access to ToolHub24 if these Terms are violated or where required by applicable law.</p>

            <h2 className="text-2xl mt-8 mb-4">11. Changes to the Terms</h2>
            <p>We reserve the right to modify these Terms at any time.</p>
            <p>Continued use of ToolHub24 after updates constitutes acceptance of the revised Terms.</p>

            <h2 className="text-2xl mt-8 mb-4">12. Governing Law</h2>
            <p>These Terms shall be governed by the laws of the Republic of India.</p>
            <p>Any disputes shall be subject to the jurisdiction of the courts located in Kolkata, West Bengal.</p>

            <h2 className="text-2xl mt-8 mb-4">13. Contact Information</h2>
            <ul className="list-none font-bold text-gray-800 space-y-2 mt-4">
              <li><strong>Company:</strong> Naiyo24 Private Limited</li>
              <li><strong>Contact Person:</strong> Debasish Baidya</li>
              <li><strong>Email:</strong> <a href="mailto:naiyooffice@gmail.com" className="text-neo-blue hover:underline">naiyooffice@gmail.com</a></li>
              <li><strong>Phone:</strong> +91 62891 71798</li>
              <li>
                <strong>Address:</strong><br/>
                1/30B, Chittaranjan Colony<br/>
                Baghajatin<br/>
                Kolkata, West Bengal 700032<br/>
                India – 700032
              </li>
            </ul>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
