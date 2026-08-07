import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { Plus, Loader2, Package, Search, Download, Printer, ArrowLeft } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';
import { Link } from 'react-router-dom';

export function InventoryManager() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<any | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', category: '', description: '', barcode: '',
    purchase_price: 0, selling_price: 0, gst_rate: 0, hsn_code: '', 
    initial_stock: 0, reminder_stock: 0, batch_number: '', expiry_date: '',
    product_type: 'Finished Good', image_url: ''
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingImage(true);
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
        setNewProduct(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert('Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/business-tools/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.items || data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async (url: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}${url}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.pdf_url) {
          window.open(`${API_BASE_URL}${data.pdf_url}`, '_blank');
        }
      } else {
        alert('Failed to generate PDF');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating PDF');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create Product first
      const productRes = await fetch(`${API_BASE_URL}/business-tools/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProduct.name,
          barcode: newProduct.barcode || newProduct.sku,
          brand: 'Generic',
          category: newProduct.category,
          description: newProduct.description,
          hsn_code: newProduct.hsn_code,
          gst_rate: newProduct.gst_rate,
          mrp: newProduct.selling_price,
          product_type: newProduct.product_type,
          image_url: newProduct.image_url
        })
      });

      if (!productRes.ok) throw new Error('Failed to create product');
      
      const productData = await productRes.json();
      const actualBarcode = productData.barcode || newProduct.barcode || newProduct.sku;

      // Add to Inventory
      const invRes = await fetch(`${API_BASE_URL}/business-tools/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          barcode: actualBarcode,
          purchase_price: newProduct.purchase_price,
          selling_price: newProduct.selling_price,
          available_stock: newProduct.initial_stock,
          initial_stock: newProduct.initial_stock,
          reminder_stock: newProduct.reminder_stock,
          batch_number: newProduct.batch_number,
          expiry_date: newProduct.expiry_date || null
        })
      });

      if (invRes.ok) {
        setIsAddingProduct(false);
        fetchProducts();
        setNewProduct({
          name: '', sku: '', category: '', description: '', barcode: '',
          purchase_price: 0, selling_price: 0, gst_rate: 0, hsn_code: '', 
          initial_stock: 0, reminder_stock: 0, batch_number: '', expiry_date: '',
          product_type: 'Finished Good', image_url: ''
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.barcode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (isAddingProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddingProduct(false)}
            className="bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h3 className="text-3xl font-black uppercase">Add New Product</h3>
        </div>

        <form onSubmit={handleAddProduct} className="bg-white border-4 border-black p-6 md:p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000] space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h4 className="font-black uppercase text-xl border-b-4 border-black pb-2 mb-4">Basic Details</h4>
            </div>

            <div className="md:col-span-2 flex items-center justify-center gap-4 border-4 border-dashed border-black rounded-xl p-6 bg-gray-50">
              {newProduct.image_url ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <img src={`${API_BASE_URL}${newProduct.image_url}`} alt="Product" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setNewProduct(prev => ({ ...prev, image_url: '' }))} className="absolute top-1 right-1 bg-black text-white rounded-full p-1 w-6 h-6 flex justify-center items-center text-xs font-bold shadow-[2px_2px_0px_0px_#fff]">X</button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                   <Package className="w-10 h-10 text-gray-400 mb-3" />
                   <label className="bg-neo-blue text-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl font-black uppercase text-sm cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                     {isUploadingImage ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Upload / Capture Photo'}
                     <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                   </label>
                   <p className="text-xs text-gray-500 mt-3 font-bold">Use camera on mobile</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Product Name *</label>
              <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Category</label>
              <input type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <input type="text" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Product Type *</label>
              <select value={newProduct.product_type} onChange={e => setNewProduct({...newProduct, product_type: e.target.value})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors appearance-none cursor-pointer">
                <option value="Finished Good">Finished Good</option>
                <option value="Raw Material">Raw Material</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-4">
              <h4 className="font-black uppercase text-xl border-b-4 border-black pb-2 mb-4">Pricing & Stock</h4>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Purchase Price (₹)</label>
              <input type="number" min="0" step="0.01" value={newProduct.purchase_price} onChange={e => setNewProduct({...newProduct, purchase_price: Number(e.target.value)})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Selling Price (₹) *</label>
              <input type="number" required min="0" step="0.01" value={newProduct.selling_price} onChange={e => setNewProduct({...newProduct, selling_price: Number(e.target.value)})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Initial Stock *</label>
              <input type="number" required min="0" value={newProduct.initial_stock} onChange={e => setNewProduct({...newProduct, initial_stock: Number(e.target.value)})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Reminder Stock Level</label>
              <input type="number" min="0" value={newProduct.reminder_stock} onChange={e => setNewProduct({...newProduct, reminder_stock: Number(e.target.value)})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            
            <div className="md:col-span-2 mt-4">
              <h4 className="font-black uppercase text-xl border-b-4 border-black pb-2 mb-4">Other Details</h4>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Batch Number</label>
              <input type="text" value={newProduct.batch_number} onChange={e => setNewProduct({...newProduct, batch_number: e.target.value})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Expiry Date</label>
              <input type="date" value={newProduct.expiry_date} onChange={e => setNewProduct({...newProduct, expiry_date: e.target.value})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">GST Rate (%)</label>
              <input type="number" min="0" step="0.1" value={newProduct.gst_rate} onChange={e => setNewProduct({...newProduct, gst_rate: Number(e.target.value)})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">HSN Code</label>
              <input type="text" value={newProduct.hsn_code} onChange={e => setNewProduct({...newProduct, hsn_code: e.target.value})} className="w-full bg-gray-50 border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-white transition-colors" />
            </div>
          </div>

          <button type="submit" className="w-full bg-neo-green border-4 border-black font-black uppercase text-xl py-4 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-8">
            Save Product to Inventory
          </button>
        </form>

        <BarcodeScanner 
          isOpen={isScannerOpen} 
          onClose={() => setIsScannerOpen(false)} 
          onScan={(code) => setNewProduct({...newProduct, barcode: code, sku: code})} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-black uppercase flex items-center gap-2">
          <Package className="w-8 h-8" /> Inventory list
        </h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => downloadPDF('/business-tools/inventory/barcodes')}
            className="bg-white font-black uppercase px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            <Printer className="w-5 h-5" /> Barcodes
          </button>
          <button 
            onClick={() => downloadPDF('/business-tools/inventory/report')}
            className="bg-white font-black uppercase px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" /> Report
          </button>
          <button 
            onClick={() => setIsAddingProduct(true)}
            className="bg-neo-pink text-white font-black uppercase px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by name, SKU, or barcode..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-4 border-black rounded-2xl py-4 pl-12 pr-4 font-bold text-lg shadow-[4px_4px_0px_0px_#000] focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000]"><Loader2 className="w-12 h-12 animate-spin" /></div>
      ) : (
        <div className="bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bold">
              <thead className="bg-gray-100 border-b-4 border-black uppercase text-sm">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Barcode / SKU</th>
                  <th className="p-4">Category & Type</th>
                  <th className="p-4 text-right">Stock</th>
                  <th className="p-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {!Array.isArray(products) || products.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-gray-500 text-lg">No products found. Add one to get started!</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-gray-500 text-lg">No products match your search.</td></tr>
                ) : (
                  filteredProducts.map(p => (
                    <tr key={p.id} onClick={() => setSelectedProductDetails(p)} className="hover:bg-neo-yellow/20 cursor-pointer transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg border-2 border-black flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-black leading-tight">{p.name}</p>
                            {p.batch_number && <p className="text-xs text-gray-500">Batch: {p.batch_number}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 font-mono text-sm">{p.barcode || p.sku || '-'}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2 items-start">
                          {p.category && (
                            <span className="bg-blue-100 text-blue-800 border-2 border-blue-300 px-2 py-1 rounded text-xs uppercase tracking-wide">
                              {p.category}
                            </span>
                          )}
                          {p.product_type && (
                            <span className={`px-2 py-1 rounded text-xs uppercase tracking-wide border-2 ${
                              p.product_type === 'Raw Material' 
                                ? 'bg-orange-100 text-orange-800 border-orange-300' 
                                : 'bg-purple-100 text-purple-800 border-purple-300'
                            }`}>
                              {p.product_type}
                            </span>
                          )}
                          {!p.category && !p.product_type && '-'}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-1 rounded border-2 ${
                          (p.current_stock ?? 0) <= (p.reminder_stock ?? 0) 
                            ? 'bg-red-100 text-red-800 border-red-300' 
                            : 'bg-green-100 text-green-800 border-green-300'
                        }`}>
                          {p.current_stock ?? 0}
                        </span>
                      </td>
                      <td className="p-4 text-right text-lg">₹{Number(p.selling_price || p.mrp || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Details & Barcode Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 print:bg-white print:p-0 overflow-y-auto">
          <div className="bg-white border-4 border-black rounded-2xl w-full max-w-2xl shadow-[12px_12px_0px_0px_#000] print:border-none print:shadow-none flex flex-col my-8">
            <div className="bg-neo-yellow border-b-4 border-black p-6 flex justify-between items-center print:hidden">
              <h3 className="font-black text-2xl uppercase">Product Details</h3>
              <button onClick={() => window.print()} className="bg-white p-2 border-2 border-black rounded-full hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000]">
                <Printer className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-8 flex-1">
              
              {/* Printable Barcode Area */}
              <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-300 p-6 rounded-xl print:border-none print:p-0 w-full bg-gray-50 print:bg-white">
                <p className="font-black text-2xl mb-1">{selectedProductDetails.name}</p>
                <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">{selectedProductDetails.category || 'ToolHub'}</p>
                
                <img 
                  src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(selectedProductDetails.barcode || selectedProductDetails.sku || selectedProductDetails.id)}&code=Code128&translate-esc=on`} 
                  alt="Barcode" 
                  className="my-2 h-20 md:h-24 object-contain mix-blend-multiply"
                />
                <p className="font-black text-3xl mt-4">₹{Number(selectedProductDetails.selling_price || selectedProductDetails.mrp || 0).toFixed(2)}</p>
              </div>

              {/* Extended Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:hidden">
                <div className="space-y-4">
                  <h4 className="font-black text-lg border-b-2 border-gray-200 pb-2">Basic Info</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-gray-500">Name:</span> {selectedProductDetails.name}</p>
                    <p><span className="font-bold text-gray-500">SKU / Barcode:</span> <span className="font-mono bg-gray-100 px-1 rounded">{selectedProductDetails.barcode || selectedProductDetails.sku || '-'}</span></p>
                    <p><span className="font-bold text-gray-500">Category:</span> {selectedProductDetails.category || '-'}</p>
                    <p><span className="font-bold text-gray-500">Type:</span> {selectedProductDetails.product_type || '-'}</p>
                    {selectedProductDetails.description && (
                      <p><span className="font-bold text-gray-500">Desc:</span> {selectedProductDetails.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-black text-lg border-b-2 border-gray-200 pb-2">Pricing & Stock</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-gray-500">Purchase Price:</span> ₹{Number(selectedProductDetails.purchase_price || 0).toFixed(2)}</p>
                    <p><span className="font-bold text-gray-500">Selling Price:</span> ₹{Number(selectedProductDetails.selling_price || 0).toFixed(2)}</p>
                    <p><span className="font-bold text-gray-500">GST Rate:</span> {selectedProductDetails.gst_rate || 0}%</p>
                    <p><span className="font-bold text-gray-500">HSN Code:</span> {selectedProductDetails.hsn_code || '-'}</p>
                    <div className="border-t border-dashed border-gray-300 my-2 pt-2"></div>
                    <p><span className="font-bold text-gray-500">Current Stock:</span> <span className="font-black text-lg">{selectedProductDetails.current_stock ?? 0}</span></p>
                    <p><span className="font-bold text-gray-500">Low Stock Reminder:</span> {selectedProductDetails.reminder_stock ?? 0}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t-4 border-black print:hidden">
              <button 
                onClick={() => setSelectedProductDetails(null)}
                className="w-full bg-gray-200 text-black font-black uppercase py-4 rounded-xl border-4 border-black hover:bg-gray-300 transition-colors shadow-[4px_4px_0px_0px_#000]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
