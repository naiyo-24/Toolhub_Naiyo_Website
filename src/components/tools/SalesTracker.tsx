import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { Activity, Loader2, ArrowUpRight, TrendingUp } from 'lucide-react';

export function SalesTracker() {
  const { token } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/business-tools/sales-tracker/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSales(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalItemsSold = sales.reduce((sum, s) => sum + (s.quantity_sold || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase flex items-center gap-2">
          <Activity className="w-8 h-8" /> Sales History
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neo-blue text-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000]">
          <p className="font-bold uppercase text-blue-200">Total Revenue</p>
          <p className="text-4xl font-black mt-2">₹{totalRevenue.toFixed(2)}</p>
          <TrendingUp className="w-8 h-8 mt-4 opacity-50" />
        </div>
        <div className="bg-neo-pink text-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000]">
          <p className="font-bold uppercase text-pink-200">Items Sold</p>
          <p className="text-4xl font-black mt-2">{totalItemsSold}</p>
          <ArrowUpRight className="w-8 h-8 mt-4 opacity-50" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000]"><Loader2 className="w-12 h-12 animate-spin" /></div>
      ) : (
        <div className="bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bold">
              <thead className="bg-gray-100 border-b-4 border-black uppercase text-sm">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Item Name</th>
                  <th className="p-4 text-right">Qty</th>
                  <th className="p-4 text-right">Unit Price</th>
                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {sales.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-gray-500 text-lg">No sales recorded yet. Use POS Billing to make a sale!</td></tr>
                ) : (
                  sales.map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-500">{s.sale_date ? new Date(s.sale_date).toLocaleDateString() : '-'}</td>
                      <td className="p-4 font-black">{s.item_name}</td>
                      <td className="p-4 text-right">{s.quantity_sold}</td>
                      <td className="p-4 text-right">₹{Number(s.unit_price).toFixed(2)}</td>
                      <td className="p-4 text-right text-lg text-green-600">₹{Number(s.total_amount).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
