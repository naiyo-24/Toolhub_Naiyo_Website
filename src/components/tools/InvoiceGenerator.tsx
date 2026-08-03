import React, { useState, useEffect } from 'react';
import { CompanyInfo, CompanyProfileForm } from './CompanyProfileForm';
import { Plus, Trash2, FileText, Download, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../lib/AuthContext';

export function InvoiceGenerator({ defaultIsGst = false }: { defaultIsGst?: boolean }) {
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGst, setIsGst] = useState(defaultIsGst);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name: '',
    company_address: '',
    company_phone: '',
    company_gstin: '',
    company_logo_url: ''
  });
  
  const [inventory, setInventory] = useState<any[]>([]);

  // Fetch profile to populate default details
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
        
        if (data.pricing_mode === 'WITHOUT_GST') {
          setIsGst(false);
        } else if (data.pricing_mode === 'EXCLUSIVE') {
          setIsGst(true);
        }
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
    client_company_name: '',
    client_address: '',
    client_gstin: '',
    client_phone: ''
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoice_number: `INV-${Math.floor(Date.now() / 1000)}`,
    invoice_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [items, setItems] = useState<any[]>([{
    description: '',
    quantity: 1,
    unit: 'Piece',
    unit_price: 0,
    gst_rate: isGst ? 18 : 0,
    discount_type: null,
    discount_value: 0
  }]);

  const [invoiceDiscountType, setInvoiceDiscountType] = useState<'PERCENTAGE' | 'AMOUNT' | null>(null);
  const [invoiceDiscountValue, setInvoiceDiscountValue] = useState<number>(0);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInvoiceDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newItems = [...items];
    const { name, value } = e.target;
    
    if (name === 'discount_type') {
      newItems[idx].discount_type = value === '' ? null : value;
    } else {
      newItems[idx] = { ...newItems[idx], [name]: (name === 'description' || name === 'unit') ? value : Number(value) };
    }
    
    // Auto-fill from inventory if description exactly matches
    if (name === 'description') {
      const matchedItem = inventory.find(p => p.name === value);
      if (matchedItem) {
        newItems[idx].unit_price = Number(matchedItem.selling_price || matchedItem.mrp || 0);
        if (matchedItem.gst_rate !== undefined && matchedItem.gst_rate !== null) {
          newItems[idx].gst_rate = Number(matchedItem.gst_rate);
        }
      }
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit: 'Piece', unit_price: 0, gst_rate: isGst ? 18 : 0, discount_type: null, discount_value: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    let totalBase = 0;
    let totalGst = 0;
    
    items.forEach(item => {
      const qty = item.quantity || 0;
      const price = item.unit_price || 0;
      let itemDiscount = 0;
      if (item.discount_type === 'PERCENTAGE') {
        itemDiscount = (qty * price) * ((item.discount_value || 0) / 100);
      } else if (item.discount_type === 'AMOUNT') {
        itemDiscount = (item.discount_value || 0);
      }
      const base = (qty * price) - itemDiscount;
      totalBase += base;
      if (isGst) {
        totalGst += base * ((item.gst_rate || 0) / 100);
      }
    });

    let invoiceDiscount = 0;
    if (invoiceDiscountType === 'PERCENTAGE') {
      invoiceDiscount = totalBase * (invoiceDiscountValue / 100);
    } else if (invoiceDiscountType === 'AMOUNT') {
      invoiceDiscount = invoiceDiscountValue;
    }

    return (totalBase - invoiceDiscount) + totalGst;
  };

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...companyInfo,
        ...clientInfo,
        ...invoiceDetails,
        items,
        is_gst_invoice: isGst,
        pricing_mode: isGst ? 'EXCLUSIVE' : 'WITHOUT_GST',
        invoice_discount_type: invoiceDiscountType,
        invoice_discount_value: invoiceDiscountValue
      };

      const res = await fetch(`${API_BASE_URL}/business-tools/invoice-generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to generate invoice');

      const data = await res.json();
      
      const pdfRes = await fetch(`${API_BASE_URL}${data.pdf_url}`);
      const blob = await pdfRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoiceDetails.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Sync with Sales Tracker
      let totalBase = 0;
      items.forEach(item => {
        const qty = item.quantity || 0;
        const price = item.unit_price || 0;
        let itemDiscount = 0;
        if (item.discount_type === 'PERCENTAGE') {
          itemDiscount = (qty * price) * ((item.discount_value || 0) / 100);
        } else if (item.discount_type === 'AMOUNT') {
          itemDiscount = (item.discount_value || 0);
        }
        totalBase += ((qty * price) - itemDiscount);
      });

      let invoiceDiscount = 0;
      if (invoiceDiscountType === 'PERCENTAGE') {
        invoiceDiscount = totalBase * (invoiceDiscountValue / 100);
      } else if (invoiceDiscountType === 'AMOUNT') {
        invoiceDiscount = invoiceDiscountValue;
      }

      const salesData = items.map(item => {
        const qty = item.quantity || 0;
        const price = item.unit_price || 0;
        let itemDiscount = 0;
        if (item.discount_type === 'PERCENTAGE') {
          itemDiscount = (qty * price) * ((item.discount_value || 0) / 100);
        } else if (item.discount_type === 'AMOUNT') {
          itemDiscount = (item.discount_value || 0);
        }
        
        const itemBase = (qty * price) - itemDiscount;
        const itemRatio = totalBase > 0 ? itemBase / totalBase : 0;
        const itemInvoiceDiscount = invoiceDiscount * itemRatio;
        
        const finalBase = itemBase - itemInvoiceDiscount;
        
        let finalUnitPrice = qty > 0 ? finalBase / qty : 0;
        
        const pricing_mode = isGst ? 'EXCLUSIVE' : 'WITHOUT_GST';
        if (isGst && pricing_mode === 'EXCLUSIVE') {
           finalUnitPrice = finalUnitPrice + (finalUnitPrice * ((item.gst_rate || 0)/100));
        }

        return {
          item_name: item.description,
          sku: item.sku,
          quantity_sold: qty,
          unit_price: finalUnitPrice
        };
      });

      const syncRes = await fetch(`${API_BASE_URL}/business-tools/sales-tracker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sales: salesData })
      });
      
      if (syncRes.ok) {
        // Just silent success, or optionally notify user
      }
      
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CompanyProfileForm companyInfo={companyInfo} onChange={handleCompanyChange} />

      {/* Client Details */}
      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">Client Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Client Name *</label>
            <input type="text" name="client_name" required value={clientInfo.client_name} onChange={handleClientChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Client Company (Optional)</label>
            <input type="text" name="client_company_name" value={clientInfo.client_company_name} onChange={handleClientChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Client Address *</label>
            <input type="text" name="client_address" required value={clientInfo.client_address} onChange={handleClientChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          {isGst && (
            <div>
              <label className="block text-sm font-bold mb-2">Client GSTIN</label>
              <input type="text" name="client_gstin" value={clientInfo.client_gstin} onChange={handleClientChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-2">Client Phone</label>
            <input type="text" name="client_phone" value={clientInfo.client_phone} onChange={handleClientChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">Invoice Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Invoice Number *</label>
            <input type="text" name="invoice_number" required value={invoiceDetails.invoice_number} onChange={handleInvoiceChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Invoice Date *</label>
            <input type="date" name="invoice_date" required value={invoiceDetails.invoice_date} onChange={handleInvoiceChange} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t-2 border-gray-200 flex items-center gap-3">
          <input 
            type="checkbox" 
            id="gst_toggle" 
            checked={isGst} 
            onChange={(e) => setIsGst(e.target.checked)} 
            className="w-5 h-5 accent-black border-2 border-black"
          />
          <label htmlFor="gst_toggle" className="font-black text-sm uppercase cursor-pointer">Enable Tax / GST Calculation</label>
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
                  value={item.description} 
                  onChange={(e) => handleItemChange(idx, e)} 
                  className="w-full bg-white border-2 border-black rounded-md px-2 py-1 text-sm font-bold" 
                  placeholder="Item Name" 
                  list="inventory-options"
                  autoComplete="off"
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
              <div className="w-24">
                <label className="block text-xs font-bold mb-1">Disc Type</label>
                <select name="discount_type" value={item.discount_type || ''} onChange={(e) => handleItemChange(idx, e)} className="w-full bg-white border-2 border-black rounded-md px-2 py-1 text-sm font-bold">
                  <option value="">None</option>
                  <option value="PERCENTAGE">%</option>
                  <option value="AMOUNT">₹</option>
                </select>
              </div>
              {item.discount_type && (
                <div className="w-20">
                  <label className="block text-xs font-bold mb-1">Disc Val</label>
                  <input type="number" name="discount_value" value={item.discount_value} onChange={(e) => handleItemChange(idx, e)} className="w-full bg-white border-2 border-black rounded-md px-2 py-1 text-sm font-bold" min="0" step="0.01" />
                </div>
              )}
              {isGst && (
                <div className="w-20">
                  <label className="block text-xs font-bold mb-1">GST %</label>
                  <input type="number" name="gst_rate" value={item.gst_rate} onChange={(e) => handleItemChange(idx, e)} className="w-full bg-white border-2 border-black rounded-md px-2 py-1 text-sm font-bold" min="0" />
                </div>
              )}
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

        <div className="border-t-4 border-black pt-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-bold mb-2">Invoice Discount</label>
                <select value={invoiceDiscountType || ''} onChange={(e) => setInvoiceDiscountType(e.target.value === '' ? null : e.target.value as any)} className="w-32 bg-white border-2 border-black rounded-lg px-3 py-2 font-bold">
                  <option value="">None</option>
                  <option value="PERCENTAGE">% Percentage</option>
                  <option value="AMOUNT">₹ Amount</option>
                </select>
              </div>
              {invoiceDiscountType && (
                <div>
                  <label className="block text-sm font-bold mb-2">Value</label>
                  <input type="number" value={invoiceDiscountValue} onChange={(e) => setInvoiceDiscountValue(Number(e.target.value))} className="w-32 bg-white border-2 border-black rounded-lg px-3 py-2 font-bold" min="0" step="0.01" />
                </div>
              )}
            </div>
            <p className="text-xl shrink-0">Total: <span className="font-black text-2xl ml-2">₹{calculateTotal().toFixed(2)}</span></p>
          </div>
        </div>
      </div>

      <button 
        onClick={generatePDF}
        disabled={isLoading || !companyInfo.company_name || !clientInfo.client_name}
        className="w-full bg-neo-pink text-white font-black uppercase text-xl py-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
        {isLoading ? 'Generating PDF...' : 'Download Invoice'}
      </button>

      <datalist id="inventory-options">
        {inventory.map(item => (
          <option key={item.id} value={item.name} />
        ))}
      </datalist>
    </div>
  );
}
