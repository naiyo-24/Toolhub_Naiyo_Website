import React, { useState } from 'react';
import { FileCheck, Upload, Play, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export function ATSChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload your resume (PDF).');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await fetch(`${API_BASE_URL}/docuforge/ats-checker`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data.ats_analysis);
    } catch (err: any) {
      setError(err.message || 'An error occurred during ATS checking.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <FileCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">ATS Checker</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="font-black uppercase text-xl">1. Upload Resume</h3>
          <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-black rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-black" />
              <p className="mb-2 text-lg font-black uppercase">
                {file ? file.name : 'Upload PDF'}
              </p>
              <p className="text-xs font-bold text-gray-500">Only PDF files are supported</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="font-black uppercase text-xl">2. Job Description</h3>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description here..."
            className="w-full h-48 border-4 border-black rounded-2xl p-4 font-bold focus:outline-none focus:ring-4 focus:ring-neo-blue/50 transition-all resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 rounded-xl font-bold flex items-center gap-3">
          <AlertTriangle className="w-6 h-6" /> {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !file || !jobDescription}
        className="w-full bg-neo-blue hover:bg-blue-400 text-white disabled:opacity-50 disabled:hover:bg-neo-blue disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-[8px_8px_0px_0px_#000] border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-lg shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 mb-8"
      >
        {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-white" />}
        {isAnalyzing ? 'Analyzing Match...' : 'Scan against ATS'}
      </button>

      {result && (
        <div className="border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] bg-gray-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-black uppercase text-2xl mb-6 text-center">ATS Analysis Report</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 pb-8 border-b-4 border-black border-dashed">
            <div className="text-center">
              <div className="text-sm font-black uppercase text-gray-500 mb-2">Match Score</div>
              <div className={`text-7xl font-black ${getScoreColor(result.ats_score)}`}>
                {result.ats_score}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-black uppercase text-lg flex items-center gap-2 mb-4 text-green-600">
                <CheckCircle className="w-5 h-5" /> Found Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.found_keywords?.map((kw: string, i: number) => (
                  <span key={i} className="bg-green-100 border-2 border-green-500 text-green-700 px-3 py-1 rounded-lg font-bold text-sm">
                    {kw}
                  </span>
                ))}
                {(!result.found_keywords || result.found_keywords.length === 0) && (
                  <span className="text-gray-500 font-bold">None</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-black uppercase text-lg flex items-center gap-2 mb-4 text-red-600">
                <AlertTriangle className="w-5 h-5" /> Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords?.map((kw: string, i: number) => (
                  <span key={i} className="bg-red-100 border-2 border-red-500 text-red-700 px-3 py-1 rounded-lg font-bold text-sm">
                    {kw}
                  </span>
                ))}
                {(!result.missing_keywords || result.missing_keywords.length === 0) && (
                  <span className="text-gray-500 font-bold">None</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t-4 border-black border-dashed">
            <h4 className="font-black uppercase text-lg flex items-center gap-2 mb-4 text-blue-600">
              <Info className="w-5 h-5" /> Improvement Suggestions
            </h4>
            <ul className="list-disc pl-5 space-y-2">
              {result.suggestions?.map((sug: string, i: number) => (
                <li key={i} className="font-bold text-gray-700 leading-relaxed">{sug}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export const atsCheckerInstructions = [
  "Upload your current Resume in PDF format.",
  "Paste the Job Description you are applying for.",
  "Click Scan against ATS to get an instant match score and keyword analysis."
];
