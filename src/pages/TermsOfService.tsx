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
            <p><strong>Effective Date:</strong> August 4, 2026<br/>
            <strong>Last Updated:</strong> August 4, 2026</p>
            
            <h2 className="text-2xl mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By downloading, accessing, or using ToolHub, you agree to these Terms of Service. If you do not agree, please do not use the application or website.
            </p>

            <h2 className="text-2xl mt-8 mb-4">2. Description of Service</h2>
            <p>
              ToolHub provides productivity, utility, AI, business, student, document, image, QR & barcode, calculator, travel, health, and file management tools. Features may change or be updated without prior notice.
            </p>

            <h2 className="text-2xl mt-8 mb-4">3. User Accounts</h2>
            <p>
              Some features require Google Sign-In. You are responsible for maintaining the security of your account and for all activities performed using your account.
            </p>

            <h2 className="text-2xl mt-8 mb-4">4. Acceptable Use</h2>
            <p>
              You agree not to misuse ToolHub, upload malicious content, attempt unauthorized access, reverse engineer the service, distribute malware, violate applicable laws, or infringe the rights of others.
            </p>

            <h2 className="text-2xl mt-8 mb-4">6. File Processing</h2>
            <p>
              Files uploaded for conversion or processing are handled only to perform the requested task. Users are responsible for ensuring they have the rights to upload and process their files.
            </p>

            <h2 className="text-2xl mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              All trademarks, branding, logos, designs, software, and content related to ToolHub remain the property of ToolHub or its licensors. You may not copy, redistribute, or modify them without permission.
            </p>

            <h2 className="text-2xl mt-8 mb-4">8. Privacy</h2>
            <p>
              Your use of ToolHub is also governed by our Privacy Policy, which explains how your information is collected, used, and protected.
            </p>

            <h2 className="text-2xl mt-8 mb-4">9. Third-Party Services</h2>
            <p>
              ToolHub may integrate with third-party services such as Google Sign-In, Firebase, Google Play Services, AI providers, and cloud services. Their use is subject to the respective providers' terms and policies.
            </p>

            <h2 className="text-2xl mt-8 mb-4">10. Limitation of Liability</h2>
            <p>
              ToolHub is provided on an 'as is' and 'as available' basis. We do not guarantee uninterrupted service or error-free operation. To the maximum extent permitted by law, ToolHub shall not be liable for indirect, incidental, or consequential damages arising from the use of the service.
            </p>

            <h2 className="text-2xl mt-8 mb-4">11. Suspension or Termination</h2>
            <p>
              We reserve the right to suspend or terminate access to ToolHub if these Terms are violated or if required by law.
            </p>

            <h2 className="text-2xl mt-8 mb-4">12. Changes to the Terms</h2>
            <p>
              We may update these Terms of Service at any time. Continued use of ToolHub after updates constitutes acceptance of the revised Terms.
            </p>

            <h2 className="text-2xl mt-8 mb-4">13. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws applicable in the jurisdiction where ToolHub operates, unless otherwise required by applicable law.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-none font-bold text-gray-800 space-y-2 mt-4">
              <li><strong>Contact Person:</strong> Debasish Baidya</li>
              <li><strong>Email:</strong> <a href="mailto:services.naiyo@gmail.com" className="text-neo-blue hover:underline">services.naiyo@gmail.com</a></li>
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
