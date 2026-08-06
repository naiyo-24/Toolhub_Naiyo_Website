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
            <p><strong>Effective Date:</strong> August 6, 2026<br/>
            <strong>Last Updated:</strong> August 6, 2026</p>

            <p>Welcome to ToolHub24 ("ToolHub", "we", "our", or "us").</p>

            <p>Your privacy is important to us. This Privacy Policy explains how ToolHub24 collects, uses, processes, stores, and protects your information when you use our mobile application and related services.</p>

            <p>By using ToolHub24, you agree to the practices described in this Privacy Policy.</p>

            <h2 className="text-2xl mt-8 mb-4">1. Information We Collect</h2>
            <p>Depending on the features you use, ToolHub24 may collect or access the following information.</p>

            <h3 className="text-xl mt-6 mb-3">Account Information</h3>
            <p>When you sign in using Google Sign-In, we may receive:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Profile picture (if available)</li>
            </ul>
            <p>This information is used solely to authenticate your account.</p>

            <h3 className="text-xl mt-6 mb-3">Files and Documents</h3>
            <p>When you use document or image tools, you may select:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>PDF files</li>
              <li>Images</li>
              <li>Audio recordings</li>
              <li>Documents</li>
              <li>Other supported files</li>
            </ul>
            <p>These files are accessed only when you choose them.</p>

            <h3 className="text-xl mt-6 mb-3">Device Information</h3>
            <p>We may collect limited technical information such as:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Device model</li>
              <li>Android version</li>
              <li>App version</li>
              <li>Crash information (if enabled)</li>
            </ul>
            <p>This information helps improve app performance.</p>

            <h3 className="text-xl mt-6 mb-3">Permissions</h3>
            <p>ToolHub24 may request permissions including:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Camera</li>
              <li>Notifications</li>
              <li>Microphone</li>
              <li>File access</li>
              <li>Activity Recognition</li>
              <li>Alarm scheduling</li>
            </ul>
            <p>Permissions are requested only when required by a specific feature.</p>

            <h2 className="text-2xl mt-8 mb-4">2. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Authenticate your Google account</li>
              <li>Provide requested tools and utilities</li>
              <li>Process selected files</li>
              <li>Save user preferences</li>
              <li>Deliver notifications and reminders</li>
              <li>Improve app stability and performance</li>
              <li>Detect and fix technical issues</li>
              <li>Maintain app security</li>
            </ul>
            <p>We do not sell your personal information.</p>

            <h2 className="text-2xl mt-8 mb-4">3. Data Retention</h2>
            <p>ToolHub24 performs most operations locally on your device.</p>
            <p>We do not permanently store your uploaded files, documents, images, videos, audio recordings, or other user-generated content on our servers.</p>
            <p>Files are processed only to complete the requested operation and remain on your device unless you choose to save or share them.</p>
            <p>Google account information used for authentication is retained only for as long as necessary to provide the service.</p>
            <p>If crash reporting or analytics services are enabled, diagnostic information may be retained according to the respective service provider's retention policies.</p>
            <p>Users may request deletion of any account-related information by contacting us using the contact details below.</p>

            <h2 className="text-2xl mt-8 mb-4">4. Data Security</h2>
            <p>We use reasonable administrative, technical, and organizational safeguards to protect your information.</p>
            <p>Although we strive to protect your data, no system can guarantee absolute security.</p>

            <h2 className="text-2xl mt-8 mb-4">5. Third-Party Services</h2>
            <p>ToolHub24 may use trusted third-party services including:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Google Sign-In</li>
              <li>Firebase Authentication</li>
              <li>Google Play Services</li>
            </ul>
            <p>These providers process data according to their own privacy policies.</p>

            <h2 className="text-2xl mt-8 mb-4">6. Children's Privacy</h2>
            <p>ToolHub24 is not intended for children under the age of 13.</p>
            <p>We do not knowingly collect personal information from children.</p>
            <p>If you believe a child has provided personal information, please contact us so we can remove it.</p>

            <h2 className="text-2xl mt-8 mb-4">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 font-bold text-gray-800 space-y-2">
              <li>Access your information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p>To exercise these rights, contact us using the information below.</p>

            <h2 className="text-2xl mt-8 mb-4">8. Data Deletion</h2>
            <p>Users may request deletion of their account-related information by contacting us.</p>
            <p>Files processed locally remain on the user's device unless intentionally deleted by the user.</p>

            <h2 className="text-2xl mt-8 mb-4">9. Changes to this Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time.</p>
            <p>Any changes will be posted on this page with an updated "Last Updated" date.</p>

            <h2 className="text-2xl mt-8 mb-4">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
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

            <h2 className="text-2xl mt-8 mb-4">11. Disclaimer</h2>
            <p>ToolHub24 provides productivity and utility tools.</p>
            <p>Calculations, conversions, AI-generated content (if applicable), reminders, and other outputs should be independently verified before being relied upon for legal, medical, financial, or professional decisions.</p>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
