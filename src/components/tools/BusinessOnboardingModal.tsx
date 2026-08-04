import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, formatFileUrl } from '../../config/api';
import { useAuth } from '../../lib/AuthContext';
import { Building2, Save, MapPin, Phone, MessageCircle, FileText, Building, User, Hash, Code, Mail, Upload, Loader2, X } from 'lucide-react';

interface BusinessOnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  userEmail: string;
}

export function BusinessOnboardingModal({ isOpen, onComplete, userEmail }: BusinessOnboardingModalProps) {
  const { token, user } = useAuth();
  
  const [formData, setFormData] = useState({
    company_name: '',
    company_address: '',
    phone_number: '',
    whatsapp_number: '',
    gst_number: '',
    bank_name: '',
    account_name: '',
    account_number: '',
    ifsc_code: '',
    business_type: 'Retailer',
    pricing_mode: 'EXCLUSIVE',
    company_logo_url: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // If they already have a company name, they are editing
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && token) {
      // Fetch current profile to pre-fill if editing
      fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.company_name) {
          setIsEditMode(true);
          setFormData({
            company_name: data.company_name || '',
            company_address: data.company_address || '',
            phone_number: data.phone_number || '',
            whatsapp_number: data.whatsapp_number || '',
            gst_number: data.gst_number || '',
            bank_name: data.bank_name || '',
            account_name: data.account_name || '',
            account_number: data.account_number || '',
            ifsc_code: data.ifsc_code || '',
            business_type: data.business_type || 'Retailer',
            pricing_mode: data.pricing_mode === 'INCLUSIVE' ? 'EXCLUSIVE' : (data.pricing_mode || 'EXCLUSIVE'),
            company_logo_url: data.company_logo_url || ''
          });
        } else {
          setIsEditMode(false);
          setFormData({
            company_name: '',
            company_address: '',
            phone_number: '',
            whatsapp_number: '',
            gst_number: '',
            bank_name: '',
            account_name: '',
            account_number: '',
            ifsc_code: '',
            business_type: 'Retailer',
            pricing_mode: 'EXCLUSIVE',
            company_logo_url: ''
          });
        }
      })
      .catch(console.error);
    }
  }, [isOpen, token]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/file-tools/share/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, company_logo_url: data.absolute_url ? formatFileUrl(data.absolute_url) : '' }));
      } else {
        alert("Failed to upload logo.");
      }
    } catch (err) {
      console.error("Logo upload error:", err);
      alert("Error uploading logo.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onComplete();
      } else {
        alert("Failed to save profile. Make sure all required fields are filled.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-4 border-black rounded-3xl w-full max-w-3xl shadow-[12px_12px_0px_0px_#000] my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-neo-yellow border-b-4 border-black p-6 md:p-8 text-center relative shrink-0">
          <button 
            onClick={onComplete}
            className="absolute top-4 right-4 bg-white border-2 border-black rounded-full p-2 hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000]"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">
            {isEditMode ? 'Edit Profile' : 'Complete Your Profile'}
          </h2>
          <p className="font-bold text-gray-800">
            Please provide your business details.
          </p>
        </div>

        {/* Scrollable Form Area */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-neo-bg" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            
            {/* Email (Disabled) */}
            <div className="bg-white border-4 border-black p-4 rounded-2xl relative shadow-[4px_4px_0px_0px_#000]">
              <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-black uppercase">Email Address</label>
              <div className="flex items-center gap-3 text-gray-500">
                <Mail className="w-5 h-5" />
                <input type="text" value={userEmail} disabled className="w-full bg-transparent font-bold outline-none cursor-not-allowed" />
              </div>
            </div>

            {/* Profile Pic / Company Logo Upload */}
            <div className="flex flex-col items-center justify-center my-6">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                className="hidden" 
              />
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-28 h-28 rounded-full border-4 border-black bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-[4px_4px_0px_0px_#000] overflow-hidden transition-transform group-hover:scale-105">
                  {isUploadingLogo ? (
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  ) : formData.company_logo_url ? (
                    <img src={formData.company_logo_url} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : user?.profile_pic ? (
                    <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <Building className="w-12 h-12 text-white" />
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
                {formData.company_logo_url && (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, company_logo_url: '' }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full border-2 border-black hover:scale-110 transition-transform"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs font-bold uppercase mt-3 text-gray-500">Tap to upload company logo</p>
            </div>

            {/* Company Info */}
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-4 rounded-2xl relative shadow-[4px_4px_0px_0px_#000] focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-black uppercase">Name of the company *</label>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <input required type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full bg-transparent font-bold outline-none" placeholder="Enter company name" />
                </div>
              </div>

              <div className="bg-white border-4 border-black p-4 rounded-2xl relative shadow-[4px_4px_0px_0px_#000] focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-black uppercase">Company Address *</label>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <input required type="text" name="company_address" value={formData.company_address} onChange={handleChange} className="w-full bg-transparent font-bold outline-none" placeholder="Full address" />
                </div>
              </div>

              <div className="bg-white border-4 border-black p-4 rounded-2xl relative shadow-[4px_4px_0px_0px_#000] focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-black uppercase">Phone Number *</label>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <input required type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full bg-transparent font-bold outline-none" placeholder="10-digit number" />
                </div>
              </div>

              <div className="bg-white border-4 border-black p-4 rounded-2xl relative shadow-[4px_4px_0px_0px_#000] focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-black uppercase">Whatsapp Number</label>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} className="w-full bg-transparent font-bold outline-none" placeholder="10-digit number" />
                </div>
              </div>

              <div className="bg-white border-4 border-black p-4 rounded-2xl relative shadow-[4px_4px_0px_0px_#000] focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-black uppercase">GST Number (Optional)</label>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} className="w-full bg-transparent font-bold outline-none uppercase" placeholder="e.g. 22AAAAA0000A1Z5" />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white border-4 border-black p-6 rounded-3xl relative shadow-[6px_6px_0px_0px_#000] mt-8 space-y-6">
              <h3 className="font-black uppercase text-xl mb-4">Bank Details (Optional)</h3>
              
              <div className="border-4 border-black p-3 rounded-xl relative focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black uppercase">Bank Name</label>
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} className="w-full bg-transparent font-bold text-sm outline-none uppercase" placeholder="e.g. BANK OF INDIA" />
                </div>
              </div>

              <div className="border-4 border-black p-3 rounded-xl relative focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black uppercase">Account Holder Name</label>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} className="w-full bg-transparent font-bold text-sm outline-none uppercase" placeholder="Name on account" />
                </div>
              </div>

              <div className="border-4 border-black p-3 rounded-xl relative focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black uppercase">Account Number</label>
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <input type="text" name="account_number" value={formData.account_number} onChange={handleChange} className="w-full bg-transparent font-bold text-sm outline-none" placeholder="Account Number" />
                </div>
              </div>

              <div className="border-4 border-black p-3 rounded-xl relative focus-within:bg-neo-blue/5 transition-colors">
                <label className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black uppercase">IFSC Code</label>
                <div className="flex items-center gap-3">
                  <Code className="w-4 h-4 text-gray-500" />
                  <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} className="w-full bg-transparent font-bold text-sm outline-none uppercase" placeholder="e.g. BKID0004013" />
                </div>
              </div>
            </div>

            {/* Type & Pricing */}
            <div className="space-y-6 mt-8">
              <div>
                <label className="block text-sm font-black uppercase mb-2">Business Type *</label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  disabled={isEditMode}
                  className={`w-full border-4 border-black rounded-xl px-4 py-3 font-bold transition-colors appearance-none ${isEditMode ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white cursor-pointer hover:bg-gray-50'}`}
                >
                  <option value="Retailer">Retailer</option>
                  <option value="Manufacturer">Manufacturer</option>
                </select>
                {isEditMode && (
                  <p className="text-red-500 text-xs font-bold mt-2">Business Type cannot be changed after registration.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-black uppercase mb-2">Default Pricing Mode *</label>
                <select
                  name="pricing_mode"
                  value={formData.pricing_mode}
                  onChange={handleChange}
                  className="w-full bg-white border-4 border-black rounded-xl px-4 py-3 font-bold focus:bg-gray-50 transition-colors cursor-pointer appearance-none"
                >
                  <option value="EXCLUSIVE">With GST</option>
                  <option value="WITHOUT_GST">Without GST</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-neo-blue text-white font-black uppercase text-lg py-5 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 mt-8"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'} <Save className="w-6 h-6" />
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
