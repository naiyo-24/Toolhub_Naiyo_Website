import React, { useState } from 'react';
import { Calculator, RefreshCw, Loader2, Delete } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function StudentSciCalc() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const appendToExpression = (val: string) => {
    setExpression(prev => prev + val);
    setError('');
  };

  const handleBackspace = () => {
    setExpression(prev => prev.slice(0, -1));
    setError('');
  };

  const handleCalculate = async () => {
    if (!expression.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/student-toolkit/scientific-calculator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expression: expression
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to calculate');
      }

      const data = await response.json();
      setResult(data.result.toString());
    } catch (err: any) {
      setError(err.message || 'An error occurred while calculating.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setExpression('');
    setResult(null);
    setError('');
  };

  // Keyboard layout for Scientific Calculator
  const buttons = [
    ['sin(', 'cos(', 'tan(', 'pi'],
    ['sqrt(', '^', 'log(', 'e'],
    ['(', ')', '/', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', 'C', '<-']
  ];

  const handleButtonClick = (btn: string) => {
    if (btn === 'C') {
      clearAll();
    } else if (btn === '<-') {
      handleBackspace();
    } else if (btn === '=') {
      handleCalculate();
    } else {
      appendToExpression(btn);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border-4 border-black rounded-3xl shadow-[10px_10px_0px_0px_#000]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Sci Calc
        </h2>
        {isLoading && <Loader2 className="w-6 h-6 animate-spin text-neo-blue" />}
      </div>

      <div className="bg-gray-100 border-4 border-black rounded-xl p-4 mb-6 shadow-inner relative min-h-[120px] flex flex-col justify-end">
        {error && (
          <div className="text-red-500 font-bold text-sm absolute top-2 right-2">
            Error
          </div>
        )}
        <div className="text-xl font-bold text-gray-500 text-right overflow-x-auto whitespace-nowrap mb-2">
          {expression || '0'}
        </div>
        <div className={`text-4xl font-black text-right overflow-x-auto whitespace-nowrap ${error ? 'text-red-600' : 'text-black'}`}>
          {error ? error : (result !== null ? result : '')}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((btn, idx) => {
          let bgColor = 'bg-white';
          let textColor = 'text-black';
          
          if (['C', '<-'].includes(btn)) {
            bgColor = 'bg-neo-pink';
            textColor = 'text-white';
          } else if (['=', '+', '-', '*', '/'].includes(btn)) {
            bgColor = 'bg-neo-blue';
            textColor = 'text-white';
          } else if (['sin(', 'cos(', 'tan(', 'pi', 'sqrt(', '^', 'log(', 'e', '(', ')'].includes(btn)) {
            bgColor = 'bg-neo-yellow';
          }

          return (
            <button
              key={idx}
              onClick={() => handleButtonClick(btn)}
              className={`${bgColor} ${textColor} border-4 border-black font-black text-lg py-3 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all active:shadow-none active:translate-x-2 active:translate-y-2`}
            >
              {btn === '<-' ? <Delete className="w-6 h-6 mx-auto" /> : btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const studentSciCalcInstructions = [
  "Use the keypad to enter your mathematical expression.",
  "Supports trigonometric functions (sin, cos, tan).",
  "Supports logarithmic functions and roots (log, sqrt).",
  "Use '^' for powers (e.g., 5^2).",
  "Click '=' to safely evaluate the expression."
];
