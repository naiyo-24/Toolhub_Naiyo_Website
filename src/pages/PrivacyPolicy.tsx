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
            <p><strong>Effective Date:</strong> August 4, 2026<br/>
            <strong>Last Updated:</strong> August 4, 2026</p>
            
            <h2 className="text-2xl mt-8 mb-4">Introduction</h2>
            <p>
              At ToolHub, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and website. By using ToolHub, you agree to this Privacy Policy.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Information We Collect</h2>
            <p>
              Account information (Google Sign-In), uploaded files and documents, device information, and permissions such as Camera, Notifications, File Picker, Internet, and Exact Alarm Scheduling when required.
            </p>

            <h2 className="text-2xl mt-8 mb-4">How We Use Information</h2>
            <p>
              To authenticate users, provide requested tools, synchronize preferences, generate AI responses, improve performance, send reminders, fix technical issues, and enhance user experience.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Data Security</h2>
            <p>
              We use reasonable security measures to protect your information. No system can guarantee complete security.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Third-Party Services</h2>
            <p>
              Google Sign-In, Firebase Authentication, Firebase Analytics, Firebase Crashlytics, Google Play Services, and other trusted providers.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Children's Privacy</h2>
            <p>
              ToolHub is not intended for children under 13 years of age.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Your Rights</h2>
            <p>
              You may request access, correction, deletion of your personal data, or withdraw consent where applicable.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Changes</h2>
            <p>
              We may update this policy and publish revisions with an updated effective date.
            </p>

            <h2 className="text-2xl mt-8 mb-4">Contact</h2>
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

            <h2 className="text-2xl mt-8 mb-4">Disclaimer</h2>
            <p>
              ToolHub is a productivity and utility app. AI responses, calculations, and conversions should be verified before relying on them for important decisions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
