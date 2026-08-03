import React from 'react';

export interface CompanyInfo {
  company_name: string;
  company_address: string;
  company_phone: string;
  company_gstin: string;
  company_logo_url?: string;
}

interface CompanyProfileFormProps {
  companyInfo: CompanyInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyProfileForm({ companyInfo, onChange }: CompanyProfileFormProps) {
  return (
    <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4 relative">
      {companyInfo.company_logo_url && (
        <img src={companyInfo.company_logo_url} alt="Logo" className="absolute top-6 right-6 w-16 h-16 rounded-xl border-2 border-black object-cover" />
      )}
      <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">Your Company Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-2">Company Name *</label>
          <input 
            type="text" 
            name="company_name"
            required
            value={companyInfo.company_name}
            onChange={onChange}
            className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-pink"
            placeholder="e.g. Acme Corp"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-2">GSTIN (Optional)</label>
          <input 
            type="text" 
            name="company_gstin"
            value={companyInfo.company_gstin}
            onChange={onChange}
            className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-pink"
            placeholder="e.g. 22AAAAA0000A1Z5"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold mb-2">Company Address *</label>
          <input 
            type="text" 
            name="company_address"
            required
            value={companyInfo.company_address}
            onChange={onChange}
            className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-pink"
            placeholder="123 Business Rd, City"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Phone Number</label>
          <input 
            type="text" 
            name="company_phone"
            value={companyInfo.company_phone}
            onChange={onChange}
            className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-pink"
            placeholder="e.g. +91 9876543210"
          />
        </div>
      </div>
    </div>
  );
}
