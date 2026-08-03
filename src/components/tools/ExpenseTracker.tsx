import React, { useState } from 'react';
import { Activity, Loader2, Plus, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const EXPENSE_CATEGORIES = [
  "Housing", "Food & Dining", "Transportation", "Utilities & Bills", 
  "Entertainment", "Healthcare", "Shopping", "Travel", "Education", "Other"
];

interface ExpenseItem {
  category: string;
  amount: number | '';
  description: string;
  date: string;
}

export function ExpenseTracker() {
  const [monthlyBudget, setMonthlyBudget] = useState<string>('');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { category: 'Food & Dining', amount: '', description: '', date: new Date().toISOString().split('T')[0] }
  ]);

  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExpense = () => {
    setExpenses([...expenses, { category: 'Other', amount: '', description: '', date: new Date().toISOString().split('T')[0] }]);
  };

  const removeExpense = (index: number) => {
    const newExp = [...expenses];
    newExp.splice(index, 1);
    setExpenses(newExp);
  };

  const updateExpense = (index: number, field: keyof ExpenseItem, value: any) => {
    const newExp = [...expenses];
    newExp[index] = { ...newExp[index], [field]: value };
    setExpenses(newExp);
  };

  const calculate = async () => {
    if (!monthlyBudget) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formattedExpenses = expenses.map(e => ({
        ...e,
        amount: Number(e.amount) || 0
      }));

      const response = await fetch(`${API_BASE_URL}/finance-tools/expense-tracker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_budget: Number(monthlyBudget),
          expenses: formattedExpenses
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate. Please check inputs.');
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <Activity className="w-8 h-8" />
          Expense Tracker
        </h3>
        
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-lg font-black uppercase mb-2">Monthly Budget (₹)</label>
            <input 
              type="number" 
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            />
          </div>

          <div className="border-t-4 border-black pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-black uppercase">Expenses</h4>
              <button 
                onClick={addExpense}
                className="bg-neo-blue text-white px-4 py-2 border-2 border-black rounded-lg font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-4">
              {expenses.map((exp, idx) => (
                <div key={idx} className="bg-gray-50 border-4 border-black p-4 rounded-xl relative group flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => updateExpense(idx, 'description', e.target.value)}
                      className="w-full bg-white border-2 border-black p-2 rounded font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <div className="flex gap-2">
                      <select 
                        value={exp.category}
                        onChange={(e) => updateExpense(idx, 'category', e.target.value)}
                        className="flex-1 bg-white border-2 border-black p-2 rounded font-bold text-sm focus:outline-none appearance-none"
                      >
                        {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input 
                        type="date"
                        value={exp.date}
                        onChange={(e) => updateExpense(idx, 'date', e.target.value)}
                        className="bg-white border-2 border-black p-2 rounded font-bold text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black">₹</span>
                      <input 
                        type="number"
                        placeholder="Amount"
                        value={exp.amount}
                        onChange={(e) => updateExpense(idx, 'amount', e.target.value)}
                        className="w-full md:w-32 bg-white border-2 border-black p-2 pl-8 rounded font-black focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    {expenses.length > 1 && (
                      <button 
                        onClick={() => removeExpense(idx)}
                        className="bg-red-500 text-white p-2 border-2 border-black rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={calculate}
          disabled={isLoading || !monthlyBudget}
          className="w-full bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Analyze Expenses'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-8 bg-black text-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] animate-in slide-in-from-bottom-4">
            <h4 className="text-2xl font-black uppercase mb-4 text-neo-yellow">Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm font-bold uppercase mb-1">Total Expenses</div>
                <div className="text-2xl font-black text-white">₹ {result.total_expenses?.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm font-bold uppercase mb-1">Remaining Budget</div>
                <div className={`text-2xl font-black ${result.is_over_budget ? 'text-red-500' : 'text-green-500'}`}>
                  ₹ {result.remaining_budget?.toLocaleString()}
                </div>
              </div>
            </div>

            {result.category_breakdown && Object.keys(result.category_breakdown).length > 0 && (
              <div>
                <h5 className="font-bold uppercase text-gray-400 mb-3">Breakdown by Category</h5>
                <div className="space-y-2">
                  {Object.entries(result.category_breakdown).map(([cat, amt]: any) => (
                    <div key={cat} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                      <span className="font-bold">{cat}</span>
                      <span className="font-black">₹ {amt.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
