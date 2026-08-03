import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { Loader2, Calculator } from 'lucide-react';

export function ProfitCalculator() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profitData, setProfitData] = useState({
    total_revenue: '',
    cost_of_goods_sold: '',
    operating_expenses: '',
    taxes_paid: ''
  });
  
  const [result, setResult] = useState<any>(null);

  const calculateProfit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/business-tools/profit-calculator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          total_revenue: Number(profitData.total_revenue),
          cost_of_goods_sold: Number(profitData.cost_of_goods_sold),
          operating_expenses: Number(profitData.operating_expenses),
          taxes_paid: Number(profitData.taxes_paid) || 0
        })
      });
      if (res.ok) {
        setResult(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
          <Calculator className="w-6 h-6" /> Profit Inputs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Total Revenue *</label>
            <input type="number" value={profitData.total_revenue} onChange={e => setProfitData({...profitData, total_revenue: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Cost of Goods Sold (COGS) *</label>
            <input type="number" value={profitData.cost_of_goods_sold} onChange={e => setProfitData({...profitData, cost_of_goods_sold: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Operating Expenses *</label>
            <input type="number" value={profitData.operating_expenses} onChange={e => setProfitData({...profitData, operating_expenses: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Taxes Paid (Optional)</label>
            <input type="number" value={profitData.taxes_paid} onChange={e => setProfitData({...profitData, taxes_paid: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
          </div>
        </div>
        <button 
          onClick={calculateProfit} 
          disabled={isLoading || !profitData.total_revenue || !profitData.cost_of_goods_sold || !profitData.operating_expenses}
          className="w-full bg-neo-pink text-white border-4 border-black font-black uppercase py-3 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Calculate Profit'}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-neo-yellow border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] text-center">
            <h4 className="text-lg font-black uppercase mb-2">Gross Profit</h4>
            <p className="text-3xl font-black">₹{Number(result.gross_profit || 0).toFixed(2)}</p>
          </div>
          <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] text-center">
            <h4 className="text-lg font-black uppercase mb-2">Gross Margin</h4>
            <p className="text-3xl font-black">{Number(result.gross_margin_percentage || 0).toFixed(2)}%</p>
          </div>
          <div className={`${result.net_profit >= 0 ? 'bg-green-400' : 'bg-red-400'} border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] text-center`}>
            <h4 className="text-lg font-black uppercase mb-2">Net Profit</h4>
            <p className="text-3xl font-black">₹{Number(result.net_profit || 0).toFixed(2)}</p>
          </div>
          <div className={`${result.net_profit >= 0 ? 'bg-green-400' : 'bg-red-400'} border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] text-center`}>
            <h4 className="text-lg font-black uppercase mb-2">Net Margin</h4>
            <p className="text-3xl font-black">{Number(result.net_margin_percentage || 0).toFixed(2)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
