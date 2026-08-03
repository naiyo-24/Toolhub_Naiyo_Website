import React, { useState, useEffect } from 'react';
import { CompanyInfo, CompanyProfileForm } from './CompanyProfileForm';
import { Download, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../lib/AuthContext';

export function ReceiptGenerator() {
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name: '',
    company_address: '',
    company_phone: '',
    company_gstin: '',
    company_logo_url: ''
  });

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setCompanyInfo({
          company_name: data.company_name || user?.full_name + "'s Business",
          company_address: data.company_address || '',
          company_phone: data.phone_number || '',
          company_gstin: data.gst_number || '',
          company_logo_url: data.company_logo_url || ''
        });
      })
      .catch(console.error);
    }
  }, [token, user]);

  const [receiptDetails, setReceiptDetails] = useState({
    receipt_number: `REC-${Math.floor(Date.now() / 1000)}`,
    receipt_date: new Date().toISOString().split('T')[0],
    received_from: '',
    amount: '',
    payment_mode: 'Cash',
    transaction_id: '',
    purpose: ''
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setReceiptDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const payload = {
        company_name: companyInfo.company_name,
        company_address: companyInfo.company_address,
        company_phone: companyInfo.company_phone,
        company_gstin: companyInfo.company_gstin,
        company_logo_url: companyInfo.company_logo_url,
        receipt_number: receiptDetails.receipt_number,
        receipt_date: receiptDetails.receipt_date,
        received_from: receiptDetails.received_from,
        amount: Number(receiptDetails.amount),
        payment_mode: receiptDetails.payment_mode,
        transaction_id: receiptDetails.transaction_id || undefined,
        purpose: receiptDetails.purpose
      };

      const res = await fetch(`${API_BASE_URL}/business-tools/receipt-gen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to generate receipt');

      const data = await res.json();
      const pdfRes = await fetch(`${API_BASE_URL}${data.pdf_url}`);
      const blob = await pdfRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt_${receiptDetails.receipt_number}.pdf`;
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
      <CompanyProfileForm companyInfo={companyInfo} onChange={handleCompanyChange} />

      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">Receipt Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Receipt Number *</label>
            <input type="text" name="receipt_number" required value={receiptDetails.receipt_number} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Date *</label>
            <input type="date" name="receipt_date" required value={receiptDetails.receipt_date} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Received From *</label>
            <input type="text" name="received_from" required value={receiptDetails.received_from} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" placeholder="Customer or Company Name" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Amount *</label>
            <input type="number" name="amount" required value={receiptDetails.amount} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" placeholder="e.g. 5000" min="0" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Payment Mode *</label>
            <select name="payment_mode" value={receiptDetails.payment_mode} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold">
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          {receiptDetails.payment_mode !== 'Cash' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">Transaction ID / Cheque No (Optional)</label>
              <input type="text" name="transaction_id" value={receiptDetails.transaction_id} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Purpose / For *</label>
            <input type="text" name="purpose" required value={receiptDetails.purpose} onChange={handleChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" placeholder="e.g. Advance payment for services" />
          </div>
        </div>
      </div>

      <button 
        onClick={generatePDF}
        disabled={isLoading || !companyInfo.company_name || !receiptDetails.received_from || !receiptDetails.amount}
        className="w-full bg-neo-pink text-white font-black uppercase text-xl py-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
        {isLoading ? 'Generating PDF...' : 'Download Receipt'}
      </button>

    </div>
  );
}
