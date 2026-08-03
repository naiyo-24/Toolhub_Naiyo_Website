import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { Loader2, TrendingUp } from 'lucide-react';

export function BusinessAnalytics() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/business-tools/business-analytics?start_date=2000-01-01&end_date=2100-01-01`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-12 h-12 animate-spin" /></div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase flex items-center gap-2">
          <TrendingUp className="w-6 h-6" /> Business Analytics
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-1">Total Sales</h4>
          <p className="text-2xl font-black">₹{Number(data.total_historical_revenue || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-1">Total Expenses</h4>
          <p className="text-2xl font-black text-red-500">₹{Number(data.total_historical_expenses || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-1">Net Profit</h4>
          <p className="text-2xl font-black text-green-500">₹{Number(data.net_profit_margin || 0).toFixed(2)}</p>
        </div>
        <div className="bg-neo-yellow border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
          <h4 className="text-sm font-bold uppercase mb-1">Sales Count</h4>
          <p className="text-2xl font-black">{data.total_sales_transactions_recorded || 0} Transactions</p>
        </div>
      </div>
    </div>
  );
}
