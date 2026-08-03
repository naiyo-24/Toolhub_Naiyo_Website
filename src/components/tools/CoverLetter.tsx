import React, { useState } from 'react';
import { FileText, Download, Edit3 } from 'lucide-react';

export function CoverLetter() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    employerName: '',
    companyName: '',
    companyAddress: '',
    position: '',
    body: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8 print:hidden">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Cover Letter Builder</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Side (Hidden during printing) */}
        <div className="space-y-6 print:hidden">
          <div className="bg-gray-50 border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-black text-xl mb-4 flex items-center gap-2 border-b-4 border-black pb-2">
              <Edit3 className="w-6 h-6" /> Your Information
            </h3>
            <div className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Your Address" className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              <div className="grid grid-cols-2 gap-4">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border-4 border-black rounded-xl p-3 font-bold" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              </div>
            </div>
          </div>

          <div className="bg-neo-yellow/20 border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-black text-xl mb-4 border-b-4 border-black pb-2">Employer Information</h3>
            <div className="space-y-4">
              <input type="text" name="date" value={formData.date} onChange={handleChange} placeholder="Date" className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              <input type="text" name="employerName" value={formData.employerName} onChange={handleChange} placeholder="Hiring Manager Name" className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleChange} placeholder="Company Address" className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position Applying For" className="w-full border-4 border-black rounded-xl p-3 font-bold bg-neo-yellow" />
            </div>
          </div>

          <div className="bg-neo-green/20 border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-black text-xl mb-4 border-b-4 border-black pb-2">Letter Content</h3>
            <textarea 
              name="body" 
              value={formData.body} 
              onChange={handleChange} 
              placeholder="Write the body of your cover letter here..." 
              className="w-full border-4 border-black rounded-xl p-3 font-medium min-h-[200px]" 
            />
          </div>

          <button
            onClick={handlePrint}
            className="w-full bg-neo-blue hover:bg-blue-600 text-white border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
          >
            <Download className="w-6 h-6" /> Print / Save as PDF
          </button>
        </div>

        {/* Preview Side (This is what gets printed) */}
        <div className="bg-white border-4 border-gray-300 p-8 min-h-[800px] shadow-lg print:border-none print:shadow-none print:p-0 print:absolute print:left-0 print:top-0 print:w-full print:m-0 font-serif">
          <div className="text-right mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{formData.name || 'Your Name'}</h1>
            <p className="text-gray-700">{formData.address || 'Your Address'}</p>
            <p className="text-gray-700">{formData.email || 'your.email@example.com'}</p>
            <p className="text-gray-700">{formData.phone || '(555) 555-5555'}</p>
          </div>

          <div className="mb-8">
            <p className="text-gray-900 font-medium mb-8">{formData.date}</p>
            <p className="text-gray-900 font-bold">{formData.employerName || 'Hiring Manager Name'}</p>
            <p className="text-gray-900 font-medium">{formData.companyName || 'Company Name'}</p>
            <p className="text-gray-700">{formData.companyAddress || 'Company Address'}</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-900 font-medium">Dear {formData.employerName ? formData.employerName.split(' ')[0] : 'Hiring Manager'},</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-900 font-bold underline">Re: Application for {formData.position || 'Position Name'} position</p>
          </div>

          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[250px]">
            {formData.body || 'I am writing to express my strong interest in the above position. Enclosed is my resume for your review. I believe my skills and experience make me an excellent fit for this role.'}
          </div>

          <div className="mt-12">
            <p className="text-gray-900 mb-8">Sincerely,</p>
            <p className="text-gray-900 font-bold mt-12">{formData.name || 'Your Name'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const coverLetterInstructions = [
  "Fill out your contact information and the employer's details on the left.",
  "Write the main body of your cover letter in the text area.",
  "Preview the formatted letter in real-time on the right side.",
  "Click 'Print / Save as PDF' to generate the final document using your browser's print dialog."
];
