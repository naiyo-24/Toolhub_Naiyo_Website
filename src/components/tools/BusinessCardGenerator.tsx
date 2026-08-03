import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../lib/AuthContext';

export function BusinessCardGenerator() {
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: user?.full_name || '',
    job_title: '',
    company_name: '',
    phone: '',
    email: user?.email || '',
    website: '',
    address: '',
    logo_url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/business-tools/business-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cardDetails)
      });

      if (!res.ok) throw new Error('Failed to generate business card');

      const data = await res.json();
      const pdfRes = await fetch(`${API_BASE_URL}${data.pdf_url}`);
      const blob = await pdfRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BusinessCard_${cardDetails.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">Business Card Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Full Name *</label>
            <input type="text" name="name" required value={cardDetails.name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Job Title *</label>
            <input type="text" name="job_title" required value={cardDetails.job_title} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" placeholder="e.g. CEO, Developer" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Company Name *</label>
            <input type="text" name="company_name" required value={cardDetails.company_name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Phone Number *</label>
            <input type="text" name="phone" required value={cardDetails.phone} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Email Address *</label>
            <input type="email" name="email" required value={cardDetails.email} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Website (Optional)</label>
            <input type="text" name="website" value={cardDetails.website} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" placeholder="e.g. www.example.com" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Address (Optional)</label>
            <input type="text" name="address" value={cardDetails.address} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
        </div>
      </div>

      <button 
        onClick={generatePDF}
        disabled={isLoading || !cardDetails.name || !cardDetails.company_name || !cardDetails.job_title || !cardDetails.phone || !cardDetails.email}
        className="w-full bg-neo-pink text-white font-black uppercase text-xl py-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
        {isLoading ? 'Generating PDF...' : 'Download Business Card'}
      </button>
    </div>
  );
}
