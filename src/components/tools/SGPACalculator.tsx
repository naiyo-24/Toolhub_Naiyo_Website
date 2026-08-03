import React, { useState } from 'react';
import { Calculator, Plus, Trash2, RefreshCw, Loader2, Award } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface Course {
  id: string;
  name: string;
  credits: string;
  grade_points: string;
}

export function SGPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Course 1', credits: '', grade_points: '' },
    { id: '2', name: 'Course 2', credits: '', grade_points: '' },
    { id: '3', name: 'Course 3', credits: '', grade_points: '' },
  ]);
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCourseChange = (id: string, field: keyof Course, value: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCourse = () => {
    const newId = (Math.max(...courses.map(c => parseInt(c.id) || 0)) + 1).toString();
    setCourses(prev => [...prev, { id: newId, name: `Course ${newId}`, credits: '', grade_points: '' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleCalculate = async () => {
    // Validate
    const invalidCourses = courses.filter(c => !c.credits || !c.grade_points);
    if (invalidCourses.length > 0) {
      setError('Please fill in credits and grade points for all courses.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    const payload = {
      courses: courses.map(c => ({
        credits: parseFloat(c.credits),
        grade_points: parseFloat(c.grade_points)
      }))
    };

    try {
      const response = await fetch(`${API_BASE_URL}/student-toolkit/sgpa-calculator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to calculate SGPA');
      }

      const data = await response.json();
      setResult(data.sgpa);
    } catch (err: any) {
      setError(err.message || 'An error occurred while calculating.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCourses([
      { id: '1', name: 'Course 1', credits: '', grade_points: '' },
      { id: '2', name: 'Course 2', credits: '', grade_points: '' },
      { id: '3', name: 'Course 3', credits: '', grade_points: '' },
    ]);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-neo-purple p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black uppercase">SGPA Calculator</h2>
        </div>
        <button
          onClick={addCourse}
          className="bg-black text-white hover:bg-gray-800 border-4 border-black font-black py-2 px-4 rounded-xl flex items-center gap-2 transition-colors uppercase text-sm"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
          <div className="grid grid-cols-12 gap-4 mb-2 px-2 hidden md:grid">
            <div className="col-span-4 font-black uppercase text-sm text-gray-500">Course Name</div>
            <div className="col-span-3 font-black uppercase text-sm text-gray-500">Credits</div>
            <div className="col-span-4 font-black uppercase text-sm text-gray-500">Grade Points (1-10)</div>
            <div className="col-span-1"></div>
          </div>
          
          <div className="space-y-4">
            {courses.map((course, idx) => (
              <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 md:p-2 border-4 md:border-0 border-black rounded-xl">
                <div className="col-span-1 md:col-span-4">
                  <label className="font-black uppercase text-xs md:hidden block mb-1">Course Name</label>
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                    placeholder={`Course ${idx + 1}`}
                    className="w-full border-4 border-black rounded-lg p-2 font-bold focus:outline-none focus:ring-4 focus:ring-neo-purple/50 transition-all"
                  />
                </div>
                <div className="col-span-1 md:col-span-3">
                  <label className="font-black uppercase text-xs md:hidden block mb-1">Credits</label>
                  <input
                    type="number"
                    value={course.credits}
                    onChange={(e) => handleCourseChange(course.id, 'credits', e.target.value)}
                    step="0.5"
                    min="0"
                    placeholder="e.g. 3"
                    className="w-full border-4 border-black rounded-lg p-2 font-bold focus:outline-none focus:ring-4 focus:ring-neo-purple/50 transition-all"
                  />
                </div>
                <div className="col-span-1 md:col-span-4">
                  <label className="font-black uppercase text-xs md:hidden block mb-1">Grade Points</label>
                  <input
                    type="number"
                    value={course.grade_points}
                    onChange={(e) => handleCourseChange(course.id, 'grade_points', e.target.value)}
                    step="0.5"
                    min="0"
                    max="10"
                    placeholder="e.g. 9"
                    className="w-full border-4 border-black rounded-lg p-2 font-bold focus:outline-none focus:ring-4 focus:ring-neo-purple/50 transition-all"
                  />
                </div>
                <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center mt-2 md:mt-0">
                  <button
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 border-4 border-black rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-black p-4 rounded-xl text-red-700 font-bold shadow-[4px_4px_0px_0px_#000]">
            {error}
          </div>
        )}

        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="w-full bg-neo-purple hover:bg-purple-500 text-white border-4 border-black font-black text-xl py-4 px-8 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Calculating...
            </>
          ) : (
            'Calculate SGPA'
          )}
        </button>

        {result !== null && (
          <div className="bg-neo-purple/10 border-4 border-black p-8 rounded-xl text-center shadow-[4px_4px_0px_0px_#000] mt-8 animate-in fade-in zoom-in duration-300">
            <Award className="w-16 h-16 text-neo-purple mx-auto mb-4" />
            <h3 className="font-black text-2xl uppercase text-gray-700 mb-2">Your SGPA</h3>
            <p className="text-6xl font-black text-neo-purple">{result.toFixed(2)}</p>
            
            <button
              onClick={reset}
              className="mt-6 mx-auto bg-white hover:bg-gray-100 text-black border-4 border-black font-black text-lg py-3 px-6 rounded-xl flex items-center gap-2 transition-colors uppercase"
            >
              <RefreshCw className="w-5 h-5" />
              Reset Calculator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const sgpaCalculatorInstructions = [
  "Add all the courses you took this semester.",
  "For each course, enter the total credits it is worth (e.g., 3).",
  "Enter the grade points you earned out of 10 (e.g., an A might be 9 or 10).",
  "Click 'Add Course' if you need more rows.",
  "Click 'Calculate SGPA' to instantly find out your semester average!"
];
