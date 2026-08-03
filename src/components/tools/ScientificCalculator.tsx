import React, { useState } from 'react';
import { Calculator, Delete, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function ScientificCalculator() {
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

  const clearAll = () => {
    setExpression('');
    setResult(null);
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
      setError('Error');
    } finally {
      setIsLoading(false);
    }
  };

  const buttons = [
    ['sin(', 'cos(', 'tan(', '/'],
    ['sqrt(', '^', 'log(', '*'],
    ['pi', 'e', '(', ')'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['C', '0', '.', '<-']
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
    <div className="w-full max-w-[400px] mx-auto h-[calc(100vh-120px)] max-h-[850px] bg-black p-4 flex flex-col justify-end pb-8 rounded-[3rem] border-8 border-gray-900 shadow-2xl relative overflow-hidden">
      
      {/* Dynamic Island / Camera notch mimic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl"></div>
      
      {/* Display Screen */}
      <div className="flex-1 flex flex-col justify-end pb-6 px-4 pt-12">
        {isLoading && <Loader2 className="w-6 h-6 animate-spin text-white mb-2 self-end" />}
        <div className="text-3xl text-gray-400 text-right overflow-x-auto whitespace-nowrap mb-2 min-h-[36px]">
          {expression}
        </div>
        <div className={`text-6xl font-light text-right overflow-x-auto whitespace-nowrap tracking-tight ${error ? 'text-red-500' : 'text-white'}`}>
          {error ? error : (result !== null ? result : (expression ? '' : '0'))}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="grid grid-cols-4 gap-3 px-2">
        {buttons.flat().map((btn, idx) => {
          let bgColor = 'bg-[#333333]';
          let textColor = 'text-white';
          
          if (['C', '<-'].includes(btn)) {
            bgColor = 'bg-[#a5a5a5]';
            textColor = 'text-black';
          } else if (['/', '*', '-', '+', '='].includes(btn)) {
            bgColor = 'bg-[#ff9f0a]';
            textColor = 'text-white';
          } else if (['sin(', 'cos(', 'tan(', 'sqrt(', '^', 'log(', 'pi', 'e', '(', ')'].includes(btn)) {
            bgColor = 'bg-[#4a4a4a]';
          }

          return (
            <button
              key={idx}
              onClick={() => handleButtonClick(btn)}
              className={`${bgColor} ${textColor} text-2xl h-16 sm:h-20 rounded-full font-medium active:opacity-70 transition-opacity flex items-center justify-center`}
            >
              {btn === '<-' ? <Delete className="w-6 h-6" /> : btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const scientificCalculatorInstructions = [
  "Tap the buttons to enter your expression.",
  "Use the dark grey buttons for scientific functions.",
  "Use the orange buttons for basic operations.",
  "Tap '=' to calculate!"
];
