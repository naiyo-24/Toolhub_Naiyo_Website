import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { FileText, Plus, Minus, Search, Trash2, CheckCircle } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';

interface PurchaseItem {
  id: string; // product id in our DB, or empty if new
  description: string;
  quantity: number;
  unit_price: number; // this is the purchase price
  sku?: string;
}

export function PurchaseInvoice() {
  const { token } = useAuth();
  const [supplierName, setSupplierName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [uploadedInvoiceUrl, setUploadedInvoiceUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleInvoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/business-tools/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedInvoiceUrl(data.url);
      } else {
        alert('Failed to upload invoice file');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading invoice file');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/business-tools/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(data.items || data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScan = (code: string) => {
    const product = inventory.find(p => p.barcode === code || p.sku === code);
    if (product) {
      addItemFromInventory(product);
    } else {
      // Add as unknown item
      setItems(prev => [...prev, {
        id: '',
        description: 'Unknown Item',
        quantity: 1,
        unit_price: 0,
        sku: code
      }]);
    }
  };

  const addItemFromInventory = (product: any) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.product_id.toString());
      if (existing) {
        return prev.map(item => 
          item.id === product.product_id.toString() 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.product_id.toString(),
        description: product.name,
        quantity: 1,
        unit_price: product.purchase_price || 0,
        sku: product.barcode || product.sku
      }];
    });
  };

  const addCustomItem = () => {
    setItems(prev => [...prev, { id: '', description: '', quantity: 1, unit_price: 0 }]);
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert('Please add at least one item');
    setIsProcessing(true);

    try {
      const res = await fetch(`${API_BASE_URL}/business-tools/purchase-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          supplier_name: supplierName,
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          total_amount: totalAmount,
          pdf_url: uploadedInvoiceUrl,
          items: items.map(i => ({
            description: i.description,
            quantity: i.quantity,
            unit_price: i.unit_price,
            total_price: i.quantity * i.unit_price
          }))
        })
      });

      if (res.ok) {
        alert('Purchase invoice recorded and stock updated!');
        setSupplierName('');
        setInvoiceNumber('');
        setItems([]);
        setUploadedInvoiceUrl('');
        fetchInventory();
      } else {
        alert('Failed to record purchase invoice');
      }
    } catch (err) {
      console.error(err);
      alert('Error during submission');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase flex items-center gap-2">
          <FileText className="w-8 h-8" /> Purchase Invoice
        </h3>
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="bg-neo-blue text-white font-black uppercase px-6 py-2 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          Scan Item
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">Supplier Name *</label>
            <input required type="text" value={supplierName} onChange={e => setSupplierName(e.target.value)} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Invoice Number (Optional)</label>
            <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Invoice Date *</label>
            <input required type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-bold mb-2">Upload Bill / Invoice (Optional)</label>
            <div className="flex items-center gap-4">
              <label className="bg-neo-blue text-white px-4 py-2 border-2 border-black rounded-lg font-bold cursor-pointer hover:bg-blue-600 transition-colors shadow-[2px_2px_0px_0px_#000]">
                {isUploading ? 'Uploading...' : (uploadedInvoiceUrl ? 'Change File' : 'Upload File or Capture Photo')}
                <input type="file" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={handleInvoiceUpload} />
              </label>
              {uploadedInvoiceUrl && (
                <a href={`${API_BASE_URL}${uploadedInvoiceUrl}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 underline">
                  View Uploaded File
                </a>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-black uppercase text-xl">Items</h4>
            <button type="button" onClick={addCustomItem} className="flex items-center gap-2 bg-neo-yellow px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-xl border-4 border-black">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold mb-1">Description</label>
                  <input required type="text" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold" />
                </div>
                <div className="w-full md:w-24">
                  <label className="block text-xs font-bold mb-1">Qty</label>
                  <input required type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', Number(e.target.value))} className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold" />
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-xs font-bold mb-1">Unit Cost (₹)</label>
                  <input required type="number" min="0" step="0.01" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', Number(e.target.value))} className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold" />
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-xs font-bold mb-1">Total</label>
                  <div className="px-3 py-2 font-black text-lg">₹{(item.quantity * item.unit_price).toFixed(2)}</div>
                </div>
                <button type="button" onClick={() => removeItem(index)} className="p-3 bg-red-100 text-red-600 border-2 border-red-300 rounded-lg hover:bg-red-200">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500 font-bold border-4 border-dashed border-gray-300 rounded-xl">
                No items added. Scan a product or add a row manually.
              </div>
            )}
          </div>
        </div>

        <div className="border-t-4 border-black pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black">
            Total Amount: <span className="text-3xl text-neo-green ml-2">₹{totalAmount.toFixed(2)}</span>
          </div>
          <button 
            type="submit" 
            disabled={isProcessing || items.length === 0}
            className="w-full md:w-auto bg-neo-green border-4 border-black font-black uppercase text-xl px-8 py-4 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Processing...' : <><CheckCircle className="w-6 h-6"/> Record Purchase</>}
          </button>
        </div>
      </form>

      <BarcodeScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScan} 
      />
    </div>
  );
}
