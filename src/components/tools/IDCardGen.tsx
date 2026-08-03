import React, { useState, useRef } from 'react';
import { User, Download, Upload, Camera } from 'lucide-react';

export function IDCardGen() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    role: 'Software Engineer',
    organization: 'ToolHub Inc.',
    idNumber: 'EMP-2026-001',
    bloodGroup: 'O+',
    phone: '+1 234 567 8900',
    validUntil: '2028-12-31'
  });
  
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8 print:hidden">
        <div className="bg-neo-yellow p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <User className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-black uppercase">ID Card Generator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Editor Side (Hidden during printing) */}
        <div className="space-y-6 print:hidden">
          <div className="bg-gray-50 border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2 border-b-4 border-black pb-2">
              Card Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="font-black uppercase text-xs mb-1 block">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              </div>
              
              <div>
                <label className="font-black uppercase text-xs mb-1 block">Role / Title</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full border-4 border-black rounded-xl p-3 font-bold" />
              </div>
              
              <div>
                <label className="font-black uppercase text-xs mb-1 block">Organization</label>
                <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full border-4 border-black rounded-xl p-3 font-bold bg-neo-yellow/30" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-black uppercase text-xs mb-1 block">ID Number</label>
                  <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} className="w-full border-4 border-black rounded-xl p-3 font-bold text-sm" />
                </div>
                <div>
                  <label className="font-black uppercase text-xs mb-1 block">Blood Group</label>
                  <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full border-4 border-black rounded-xl p-3 font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-black uppercase text-xs mb-1 block">Emergency Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-4 border-black rounded-xl p-3 font-bold text-sm" />
                </div>
                <div>
                  <label className="font-black uppercase text-xs mb-1 block">Valid Until</label>
                  <input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} className="w-full border-4 border-black rounded-xl p-3 font-bold text-sm" />
                </div>
              </div>
              
              <div>
                <label className="font-black uppercase text-xs mb-1 block">Profile Photo</label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white hover:bg-gray-100 text-black border-4 border-black font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                  <Upload className="w-5 h-5" /> Upload Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="w-full bg-neo-yellow hover:bg-yellow-400 text-black border-4 border-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
          >
            <Download className="w-6 h-6" /> Print / Save as PDF
          </button>
        </div>

        {/* Preview Side (This is what gets printed) */}
        <div className="flex flex-col items-center justify-center gap-8 print:gap-4 print:items-start print:w-full">
          
          {/* Front of ID Card */}
          <div className="w-[350px] h-[550px] bg-white border-4 border-black rounded-2xl shadow-xl overflow-hidden flex flex-col relative print:border-2 print:shadow-none print:w-[3.375in] print:h-[2.125in] print:flex-row print:rounded-lg">
            {/* Header Banner */}
            <div className="bg-neo-blue text-white p-4 border-b-4 border-black text-center print:border-b-2 print:border-r-2 print:w-[1.2in] print:h-full print:flex print:flex-col print:justify-center">
              <h3 className="font-black text-xl tracking-wider uppercase leading-tight print:text-sm">{formData.organization || 'Organization'}</h3>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center print:flex-row print:p-2 print:items-start print:gap-4 print:w-[2.175in]">
              {/* Photo Area */}
              <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden mb-4 bg-gray-100 flex items-center justify-center shadow-[4px_4px_0px_0px_#000] print:w-20 print:h-20 print:border-2 print:shadow-none print:rounded-md print:mb-0">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-gray-300" />
                )}
              </div>
              
              {/* Info Area */}
              <div className="text-center w-full print:text-left print:flex print:flex-col print:justify-center print:h-full">
                <h4 className="font-black text-2xl uppercase mb-1 text-black print:text-lg leading-none">{formData.name || 'Full Name'}</h4>
                <p className="font-bold text-neo-blue uppercase tracking-widest text-sm mb-6 print:mb-2 print:text-[10px]">{formData.role || 'Role / Title'}</p>
                
                <div className="w-full bg-gray-50 border-4 border-black rounded-xl p-3 text-left space-y-2 print:border-none print:p-0 print:bg-white print:space-y-1">
                  <div className="flex justify-between items-center border-b-2 border-gray-200 pb-1 print:border-none print:pb-0">
                    <span className="font-bold text-gray-500 text-xs uppercase print:text-[8px]">ID NO.</span>
                    <span className="font-black text-sm print:text-[10px]">{formData.idNumber}</span>
                  </div>
                  <div className="flex justify-between items-center border-b-2 border-gray-200 pb-1 print:border-none print:pb-0">
                    <span className="font-bold text-gray-500 text-xs uppercase print:text-[8px]">BLOOD</span>
                    <span className="font-black text-red-600 text-sm print:text-[10px]">{formData.bloodGroup}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Banner */}
            <div className="bg-neo-yellow p-3 border-t-4 border-black text-center print:hidden">
              <p className="font-black text-xs uppercase tracking-widest">Employee Identity Card</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export const idCardGenInstructions = [
  "Fill out the employee or student details in the form.",
  "Upload a profile photo.",
  "Preview the ID card in real-time.",
  "Click 'Print / Save as PDF' to generate the final ID card for printing on standard card stock."
];
