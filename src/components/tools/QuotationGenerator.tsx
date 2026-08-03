import React, { useState, useEffect } from 'react';
import { CompanyInfo, CompanyProfileForm } from './CompanyProfileForm';
import { Plus, Trash2, Download, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../lib/AuthContext';

export function QuotationGenerator() {
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name: '',
    company_address: '',
    company_phone: '',
    company_gstin: '',
    company_logo_url: ''
  });
  
  const [inventory, setInventory] = useState<any[]>([]);

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

      // Fetch inventory for autocomplete
      fetch(`${API_BASE_URL}/business-tools/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setInventory(data.items || data))
      .catch(console.error);
    }
  }, [token, user]);

  const [clientInfo, setClientInfo] = useState({
    client_name: '',
    client_address: ''
  });

  const [quoteDetails, setQuoteDetails] = useState({
    quotation_number: `QT-${Math.floor(Date.now() / 1000)}`,
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
    terms_and_conditions: '1. Quotation valid for 30 days.\n2. 50% advance payment required.'
  });

  const [items, setItems] = useState([{
    description: '',
    quantity: 1,
    unit: 'Piece',
    unit_price: 0,
    gst_rate: 0
  }]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuoteDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newItems = [...items];
    const { name, value } = e.target;
    (newItems[index] as any)[name] = (name === 'quantity' || name === 'unit_price') ? Number(value) : value;
    
    // Auto-fill from inventory if description exactly matches
    if (name === 'description') {
      const matchedItem = inventory.find(p => p.name === value);
      if (matchedItem) {
        newItems[index].unit_price = Number(matchedItem.selling_price || matchedItem.mrp || 0);
        if (matchedItem.gst_rate !== undefined && matchedItem.gst_rate !== null) {
          newItems[index].gst_rate = Number(matchedItem.gst_rate);
        }
      }
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit: 'Piece', unit_price: 0, gst_rate: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const payload = {
        company_name: companyInfo.company_name,
        company_address: companyInfo.company_address,
        company_phone: companyInfo.company_phone,
        company_gstin: companyInfo.company_gstin,
        company_logo_url: companyInfo.company_logo_url,
        client_name: clientInfo.client_name,
        client_address: clientInfo.client_address,
        quotation_number: quoteDetails.quotation_number,
        valid_until: quoteDetails.valid_until,
        terms_and_conditions: quoteDetails.terms_and_conditions,
        items
      };

      const res = await fetch(`${API_BASE_URL}/business-tools/quotation-gen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to generate quotation');

      const data = await res.json();
      const pdfRes = await fetch(`${API_BASE_URL}${data.pdf_url}`);
      const blob = await pdfRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quotation_${quoteDetails.quotation_number}.pdf`;
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
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">Client Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Client Name *</label>
            <input type="text" name="client_name" required value={clientInfo.client_name} onChange={handleClientChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Client Address *</label>
            <input type="text" name="client_address" required value={clientInfo.client_address} onChange={handleClientChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
        </div>
      </div>

      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">Quotation Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Quotation Number *</label>
            <input type="text" name="quotation_number" required value={quoteDetails.quotation_number} onChange={handleQuoteChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Valid Until *</label>
            <input type="date" name="valid_until" required value={quoteDetails.valid_until} onChange={handleQuoteChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Terms & Conditions</label>
            <textarea name="terms_and_conditions" rows={3} value={quoteDetails.terms_and_conditions} onChange={handleQuoteChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">Items</h3>
        
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-wrap items-end gap-2 border-2 border-gray-200 p-4 rounded-xl relative">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-bold mb-1">Description</label>
                <input 
                  type="text" 
                  name="description" 
                  required 
                  value={item.description} 
                  onChange={(e) => handleItemChange(idx, e)} 
                  list="inventory-items"
                  className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" 
                  placeholder="Item Name" 
                />
              </div>
              <div className="w-20">
                <label className="block text-xs font-bold mb-1">Qty</label>
                <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(idx, e)} className="w-full bg-white border-2 border-black rounded-md px-2 py-1 text-sm font-bold" min="1" />
              </div>
              <div className="w-24">
                <label className="block text-xs font-bold mb-1">Price</label>
                <input type="number" name="unit_price" value={item.unit_price} onChange={(e) => handleItemChange(idx, e)} className="w-full bg-white border-2 border-black rounded-md px-2 py-1 text-sm font-bold" min="0" step="0.01" />
              </div>
              {items.length > 1 && (
                <button onClick={() => removeItem(idx)} className="bg-red-500 text-white p-2 rounded-md border-2 border-black hover:bg-red-600 mb-[2px]">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button onClick={addItem} className="flex items-center gap-2 font-bold uppercase text-sm mt-4 bg-gray-100 px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-200">
          <Plus className="w-4 h-4" /> Add Item
        </button>

        <div className="border-t-4 border-black pt-4 mt-6 text-right">
          <p className="text-xl">Total: <span className="font-black text-2xl ml-2">₹{calculateTotal().toFixed(2)}</span></p>
        </div>
      </div>

      <button 
        onClick={generatePDF}
        disabled={isLoading || !companyInfo.company_name || !clientInfo.client_name}
        className="w-full bg-neo-pink text-white font-black uppercase text-xl py-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
        {isLoading ? 'Generating PDF...' : 'Download Quotation'}
      </button>

      <datalist id="inventory-items">
        {inventory.map((item, idx) => (
          <option key={idx} value={item.name} />
        ))}
      </datalist>
    </div>
  );
}
