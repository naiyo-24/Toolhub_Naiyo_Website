import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { ShoppingCart, Plus, Minus, Search, Trash2, Printer, CreditCard } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  gst_rate: number;
}

export function POSBilling() {
  const { token } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'AMOUNT' | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [receiptSize, setReceiptSize] = useState<'Thermal' | 'A4'>('Thermal');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      addToCart(product);
    } else {
      alert('Product not found in inventory!');
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => {
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
        name: product.name,
        sku: product.barcode || product.sku || '',
        quantity: 1,
        unit_price: product.selling_price || product.mrp || 0,
        gst_rate: product.gst_rate || 0
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  
    // Calculate discount
    let discountAmount = 0;
    if (discountType === 'PERCENTAGE') {
      discountAmount = subtotal * (discountValue / 100);
    } else if (discountType === 'AMOUNT') {
      discountAmount = discountValue;
    }
    
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    
    // Calculate GST on discounted subtotal proportionally
    const totalGst = cart.reduce((sum, item) => {
      const itemRatio = subtotal > 0 ? (item.unit_price * item.quantity) / subtotal : 0;
      const itemDiscount = discountAmount * itemRatio;
      const discountedItemTotal = (item.unit_price * item.quantity) - itemDiscount;
      return sum + (discountedItemTotal * (item.gst_rate / 100));
    }, 0);
    
    const grandTotal = discountedSubtotal + totalGst;
    
    return { subtotal, discountAmount, totalGst, grandTotal };
  };

  const { subtotal, discountAmount, totalGst, grandTotal } = calculateTotals();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const salesData = cart.map(item => {
        const itemRatio = subtotal > 0 ? (item.unit_price * item.quantity) / subtotal : 0;
        const itemDiscount = discountAmount * itemRatio;
        const discountedItemTotal = (item.unit_price * item.quantity) - itemDiscount;
        const finalUnitPrice = item.quantity > 0 ? discountedItemTotal / item.quantity : 0;
        
        return {
          item_name: item.name,
          sku: item.sku,
          quantity_sold: item.quantity,
          unit_price: finalUnitPrice + (finalUnitPrice * (item.gst_rate/100))
        };
      });

      // 1. Generate Receipt PDF
      const receiptPayload = {
        receipt_number: `POS-${Math.floor(Math.random() * 10000000)}`,
        items: cart.map(item => ({
          description: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          gst_rate: item.gst_rate
        })),
        payment_mode: 'Cash',
        receipt_size: receiptSize,
        customer_name: customerName,
        customer_phone: customerPhone,
        invoice_discount_type: discountType,
        invoice_discount_value: discountValue
      };

      const receiptRes = await fetch(`${API_BASE_URL}/business-tools/pos-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(receiptPayload)
      });

      if (receiptRes.ok) {
        const receiptData = await receiptRes.json();
        if (receiptData.pdf_url) {
          window.open(`${API_BASE_URL}${receiptData.pdf_url}`, '_blank');
        }
      }

      // 2. Record Sale in DB
      const res = await fetch(`${API_BASE_URL}/business-tools/sales-tracker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sales: salesData })
      });

      if (res.ok) {
        alert('Sale recorded successfully!');
        setCart([]);
        fetchInventory(); // Refresh stock
      } else {
        alert('Failed to process checkout.');
      }
    } catch (err) {
      console.error(err);
      alert('Error during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredInventory = Array.isArray(inventory) ? inventory.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.barcode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8) : []; // Limit to 8 for fast POS

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      {/* Left side: Products */}
      <div className="lg:col-span-2 flex flex-col h-full space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products by name or barcode..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-4 border-black rounded-xl py-3 pl-12 pr-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-shadow"
            />
          </div>
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="bg-neo-blue text-white font-black uppercase px-6 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            SCAN
          </button>
        </div>

        <div className="flex-1 bg-white border-4 border-black rounded-2xl p-4 overflow-y-auto shadow-[8px_8px_0px_0px_#000]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredInventory.map(p => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="bg-gray-50 border-4 border-black rounded-xl p-4 cursor-pointer hover:bg-neo-yellow hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <h4 className="font-black leading-tight text-lg mb-1 line-clamp-2">{p.name}</h4>
                  <p className="text-sm font-mono text-gray-500">{p.barcode || p.sku || 'No SKU'}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="font-bold text-gray-500 text-sm">Stock: {p.current_stock ?? 0}</span>
                  <span className="font-black text-lg">₹{Number(p.selling_price || p.mrp || 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
            {filteredInventory.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-12">
                <Search className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-bold text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Cart */}
      <div className="bg-white border-4 border-black rounded-2xl flex flex-col shadow-[8px_8px_0px_0px_#000] h-full overflow-hidden">
        <div className="bg-neo-yellow p-4 border-b-4 border-black flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          <h3 className="font-black text-xl uppercase">Current Order</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-400 h-full">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-bold text-lg">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white border-2 border-black rounded-xl p-3 flex flex-col gap-2 shadow-[2px_2px_0px_0px_#000]">
                <div className="flex justify-between font-bold">
                  <span className="truncate pr-2">{item.name}</span>
                  <span>₹{(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1 border-2 border-black">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded border-2 border-transparent hover:border-black"><Minus className="w-4 h-4"/></button>
                    <span className="font-black w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded border-2 border-transparent hover:border-black"><Plus className="w-4 h-4"/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border-t-4 border-black p-4 space-y-3">
          {/* Customer Details Section */}
          <div className="bg-gray-50 border-2 border-black rounded-xl p-3 space-y-2 shadow-[2px_2px_0px_0px_#000]">
            <label className="text-sm font-bold uppercase">Customer Details (Optional)</label>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="bg-white border-2 border-black rounded-lg px-2 py-1.5 font-bold text-sm w-full"
              />
              <input 
                type="text" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone Number"
                className="bg-white border-2 border-black rounded-lg px-2 py-1.5 font-bold text-sm w-full"
              />
            </div>
          </div>

          {/* Discount Section */}
          <div className="bg-gray-50 border-2 border-black rounded-xl p-3 space-y-2 shadow-[2px_2px_0px_0px_#000]">
            <label className="text-sm font-bold uppercase">Discount</label>
            <div className="flex gap-2">
              <select 
                value={discountType || ''} 
                onChange={(e) => setDiscountType(e.target.value as any || null)}
                className="bg-white border-2 border-black rounded-lg px-2 py-1 font-bold text-sm w-1/2"
              >
                <option value="">None</option>
                <option value="PERCENTAGE">% Percentage</option>
                <option value="AMOUNT">₹ Amount</option>
              </select>
              {discountType && (
                <input 
                  type="number" 
                  min="0"
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  placeholder="Value"
                  className="bg-white border-2 border-black rounded-lg px-2 py-1 font-bold text-sm w-1/2"
                />
              )}
            </div>
          </div>

          <div className="flex justify-between font-bold text-gray-600 mt-4">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between font-bold text-neo-pink">
              <span>Discount</span>
              <span>- ₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-600">
            <span>GST Amount</span>
            <span>₹{totalGst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-black text-2xl pt-2 border-t-2 border-dashed border-gray-300">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl border-2 border-black">
            <button 
              onClick={() => setReceiptSize('Thermal')}
              className={`flex-1 py-2 font-bold text-sm uppercase rounded-lg transition-all ${receiptSize === 'Thermal' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            >
              Thermal Receipt
            </button>
            <button 
              onClick={() => setReceiptSize('A4')}
              className={`flex-1 py-2 font-bold text-sm uppercase rounded-lg transition-all ${receiptSize === 'A4' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            >
              A4 Invoice
            </button>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full font-black uppercase py-4 rounded-xl flex items-center justify-center gap-2 border-4 border-black transition-all ${cart.length === 0 ? 'bg-gray-200 text-gray-400' : 'bg-neo-green text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]'}`}
          >
            {isProcessing ? 'Processing...' : (
              <>
                <CreditCard className="w-6 h-6" /> Checkout
              </>
            )}
          </button>
        </div>
      </div>

      <BarcodeScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={(code) => {
          handleScan(code);
        }} 
      />
    </div>
  );
}
