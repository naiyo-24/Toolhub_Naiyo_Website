import React, { useState } from 'react';
import { Calculator, Plus, Trash2, RotateCcw, GraduationCap, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface Semester {
  id: string;
  sgpa: string;
  credits: string;
}

export function CGPACalculator() {
  // Initialize with 8 semesters by default
  const [semesters, setSemesters] = useState<Semester[]>(
    Array.from({ length: 8 }).map((_, index) => ({
      id: crypto.randomUUID(),
      sgpa: '',
      credits: '',
    }))
  );

  const handleUpdate = (id: string, field: 'sgpa' | 'credits', value: string) => {
    // Basic validation to only allow numbers and decimals
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    
    setSemesters(prev =>
      prev.map(sem => (sem.id === id ? { ...sem, [field]: value } : sem))
    );
  };

  const addSemester = () => {
    setSemesters(prev => [
      ...prev,
      { id: crypto.randomUUID(), sgpa: '', credits: '' }
    ]);
  };

  const removeSemester = (id: string) => {
    setSemesters(prev => prev.filter(sem => sem.id !== id));
  };

  const resetCalculator = () => {
    setSemesters(
      Array.from({ length: 8 }).map((_, index) => ({
        id: crypto.randomUUID(),
        sgpa: '',
        credits: '',
      }))
    );
  };

  const [cgpaResult, setCgpaResult] = useState<string>('0.00');
  const [percentageResult, setPercentageResult] = useState<string>('0.00');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateWithBackend = async () => {
    const validSemesters = semesters
      .map(sem => ({
        sgpa: parseFloat(sem.sgpa),
        credits: parseFloat(sem.credits)
      }))
      .filter(sem => !isNaN(sem.sgpa) && !isNaN(sem.credits) && sem.credits > 0);

    if (validSemesters.length === 0) {
      setCgpaResult('0.00');
      setPercentageResult('0.00');
      return;
    }

    setIsCalculating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/student-toolkit/cgpa-calculator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semesters: validSemesters })
      });
      
      if (response.ok) {
        const data = await response.json();
        const calcCgpa = data.cgpa;
        setCgpaResult(calcCgpa.toFixed(2));
        setPercentageResult(((calcCgpa - 0.75) * 10).toFixed(2));
      }
    } catch (error) {
      console.error("Failed to calculate CGPA with backend", error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Calculate total credits manually for UI display
  let totalCredits = 0;
  semesters.forEach(sem => {
    const credits = parseFloat(sem.credits);
    if (!isNaN(credits) && credits > 0) totalCredits += credits;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#10B981] p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">CGPA Calculator</h2>
      </div>

      <div className="bg-neo-yellow/30 border-4 border-black p-6 rounded-2xl mb-8 shadow-[4px_4px_0px_0px_#000]">
        <p className="font-bold text-gray-800 leading-relaxed text-sm md:text-base">
          CGPA (Cumulative Grade Point Average) is the weighted average of grade points earned across all completed semesters (e.g., in a MAKAUT program). It is calculated by dividing the total of each semester's credit-weighted grade points (SGPA × Credits) by the total credits registered.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-xl uppercase">Semesters</h3>
            <div className="flex gap-2">
              <button
                onClick={resetCalculator}
                className="p-2 bg-red-100 hover:bg-red-200 border-2 border-black rounded-xl text-red-600 transition-colors"
                title="Reset All"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={addSemester}
                className="flex items-center gap-2 px-4 py-2 bg-neo-blue hover:bg-blue-400 border-2 border-black rounded-xl text-white font-black uppercase text-sm transition-all shadow-[2px_2px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          <div className="bg-gray-50 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000] space-y-4">
            {/* Headers */}
            <div className="grid grid-cols-12 gap-2 mb-2 px-2 hidden sm:grid">
              <div className="col-span-1 font-black text-xs uppercase text-gray-500">Sem</div>
              <div className="col-span-5 font-black text-xs uppercase text-gray-500">SGPA</div>
              <div className="col-span-5 font-black text-xs uppercase text-gray-500">Total Credits</div>
              <div className="col-span-1"></div>
            </div>

            {semesters.map((sem, index) => (
              <div key={sem.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-3 border-2 border-black rounded-xl">
                <div className="sm:col-span-1 font-black text-lg bg-gray-200 w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black">
                  {index + 1}
                </div>
                
                <div className="sm:col-span-5 relative">
                  <label className="sm:hidden font-black text-xs uppercase text-gray-500 mb-1 block">SGPA</label>
                  <input
                    type="text"
                    value={sem.sgpa}
                    onChange={(e) => handleUpdate(sem.id, 'sgpa', e.target.value)}
                    placeholder="e.g. 8.5"
                    className="w-full border-2 border-black rounded-lg p-2 font-bold focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                  />
                </div>
                
                <div className="sm:col-span-5 relative">
                  <label className="sm:hidden font-black text-xs uppercase text-gray-500 mb-1 block">Total Credits</label>
                  <input
                    type="text"
                    value={sem.credits}
                    onChange={(e) => handleUpdate(sem.id, 'credits', e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full border-2 border-black rounded-lg p-2 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                  />
                </div>
                
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    onClick={() => removeSemester(sem.id)}
                    disabled={semesters.length <= 1}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h3 className="font-black text-xl uppercase mb-4">Results</h3>
            
            <div className="bg-neo-green text-black border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] flex flex-col items-center justify-center mb-6 relative">
              <span className="font-bold uppercase text-sm mb-2">Overall CGPA</span>
              {isCalculating ? (
                <Loader2 className="w-12 h-12 animate-spin my-2" />
              ) : (
                <span className="text-6xl font-black">{cgpaResult}</span>
              )}
            </div>

            <button
              onClick={calculateWithBackend}
              disabled={isCalculating}
              className="w-full mb-6 bg-neo-blue hover:bg-blue-400 text-white border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-lg shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
            >
              {isCalculating ? <><Loader2 className="w-5 h-5 animate-spin" /> Calculating...</> : 'Calculate Now'}
            </button>

            <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] space-y-4">
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-3">
                <span className="font-bold text-gray-600">Total Semesters</span>
                <span className="font-black text-xl">{semesters.filter(s => s.sgpa && s.credits).length} / {semesters.length}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-3">
                <span className="font-bold text-gray-600">Total Credits Earned</span>
                <span className="font-black text-xl">{totalCredits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Est. Percentage*</span>
                <span className="font-black text-2xl text-neo-blue">{percentageResult}%</span>
              </div>
              <p className="text-xs text-gray-500 font-bold mt-4 leading-tight">
                *Percentage calculation uses standard MAKAUT formula: (CGPA - 0.75) × 10. This may vary by university.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export const cgpaCalculatorInstructions = [
  "By default, the calculator provides 8 semesters for a standard 4-year degree.",
  "Enter your SGPA (e.g., 8.5) and the Total Credits (e.g., 20) for each completed semester.",
  "You can use the 'Add' or trash can icons to add or remove semesters.",
  "Your Cumulative Grade Point Average (CGPA) will automatically calculate in real-time.",
  "An estimated Percentage is also provided based on standard formulas."
];
