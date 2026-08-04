import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, CheckCircle, Mail, User, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function DeleteAccount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    reason: '',
    confirmText: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.confirmText !== 'DELETE') {
      alert("Please type 'DELETE' to confirm.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          reason: formData.reason
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("Failed to submit request. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting deletion request:", error);
      alert("An error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-neo-bg pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-8 border-black rounded-3xl p-8 shadow-[12px_12px_0px_0px_#000]"
        >
          {isSubmitted ? (
            <div className="text-center space-y-6 py-8">
              <div className="inline-block bg-neo-pink text-black p-6 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_#000] mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase">Request Received</h2>
              <div className="bg-neo-blue/10 border-4 border-black rounded-2xl p-6">
                <p className="text-xl font-bold">
                  Your account deletion request has been submitted successfully.
                </p>
                <p className="text-lg font-bold text-gray-700 mt-4">
                  Please allow 24 to 48 hours for our team to process the deletion. All your data will be permanently removed.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="inline-block bg-neo-pink px-4 py-2 border-4 border-black font-black text-xl mb-6 shadow-[4px_4px_0px_0px_#000] -rotate-2">
                DANGER ZONE
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 flex items-center gap-4">
                Delete Account
                <Trash2 className="w-10 h-10 text-neo-pink" />
              </h1>

              <div className="bg-red-100 border-4 border-black p-4 rounded-xl mb-8 flex gap-4 items-start shadow-[4px_4px_0px_0px_#000]">
                <AlertTriangle className="w-8 h-8 text-red-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-black text-xl uppercase text-red-700 mb-1">Warning: Irreversible Action</h3>
                  <p className="font-bold text-red-900">
                    Deleting your account will permanently remove all your data, settings, and history. This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-black uppercase text-lg mb-2">Registered Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full bg-white border-4 border-black rounded-xl py-4 pl-14 pr-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-pink/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-lg mb-2">Reason for leaving (Optional)</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="We'd love to know why you're leaving..."
                    className="w-full bg-white border-4 border-black rounded-xl p-4 font-bold text-lg h-32 resize-none focus:outline-none focus:ring-4 focus:ring-neo-pink/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-lg mb-2">
                    Type <span className="text-neo-pink bg-neo-pink/10 px-2 py-1 rounded">DELETE</span> to confirm *
                  </label>
                  <div className="relative">
                    <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                    <input
                      type="text"
                      name="confirmText"
                      required
                      value={formData.confirmText}
                      onChange={handleChange}
                      placeholder="Type DELETE"
                      className="w-full bg-white border-4 border-black rounded-xl py-4 pl-14 pr-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-pink/30 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || formData.confirmText !== 'DELETE' || !formData.email}
                  className="w-full bg-neo-pink text-black border-4 border-black font-black uppercase text-xl py-5 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                >
                  {isLoading ? 'Processing...' : 'Request Account Deletion'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
