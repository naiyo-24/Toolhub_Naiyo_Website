import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { Plus, Loader2, PieChart } from 'lucide-react';

export function ExpenseManager() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Operations',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    payment_method: 'Cash',
    receipt_url: ''
  });

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/business-tools/expense-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          expenses: [{
            ...newExpense,
            amount: Number(newExpense.amount)
          }]
        })
      });
      if (res.ok) {
        setIsAddingExpense(false);
        setNewExpense({
          category: 'Operations', amount: '', date: new Date().toISOString().split('T')[0],
          description: '', payment_method: 'Cash', receipt_url: ''
        });
        alert('Expense recorded successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase flex items-center gap-2">
          <PieChart className="w-6 h-6" /> Expense Manager
        </h3>
        <button 
          onClick={() => setIsAddingExpense(!isAddingExpense)}
          className="bg-neo-pink text-white font-black uppercase px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Expense
        </button>
      </div>

      {isAddingExpense && (
        <form onSubmit={handleAddExpense} className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Category *</label>
              <select required value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold">
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Payroll">Payroll</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Amount *</label>
              <input type="number" required min="0" step="0.01" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Date *</label>
              <input type="date" required value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Payment Method</label>
              <select value={newExpense.payment_method} onChange={e => setNewExpense({...newExpense, payment_method: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold">
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">Description</label>
              <input type="text" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg px-4 py-2 font-bold" />
            </div>
          </div>
          <button type="submit" disabled={isLoading || !newExpense.amount} className="w-full bg-neo-yellow border-4 border-black font-black uppercase py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Save Expense'}
          </button>
        </form>
      )}

      {!isAddingExpense && (
        <div className="bg-white border-4 border-black p-12 text-center rounded-2xl shadow-[6px_6px_0px_0px_#000]">
          <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-2xl font-black uppercase mb-2">Track Expenses</h4>
          <p className="text-gray-500 font-bold">Use the "Add Expense" button to log outgoing payments and monitor your cash flow.</p>
        </div>
      )}
    </div>
  );
}
