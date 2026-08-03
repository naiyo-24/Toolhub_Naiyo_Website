import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Edit2, Loader2, Save, Trash2, ArrowLeft, Share2, AlertCircle, Download, Eye, Users, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';

type FormField = {
  label: string;
  field_type: string;
  is_required: boolean;
  options?: string[];
  order_index: number;
};

const FORM_TEMPLATES: Record<string, any> = {
  'contact-form': {
    title: 'Contact Form',
    description: 'Please provide your details and message.',
    formType: 'Contact Form',
    fields: [
      { label: 'Full Name', field_type: 'text', is_required: true, order_index: 0 },
      { label: 'Email Address', field_type: 'email', is_required: true, order_index: 1 },
      { label: 'Message', field_type: 'textarea', is_required: true, order_index: 2 },
    ]
  },
  'survey-form': {
    title: 'Customer Survey',
    description: 'We would love to hear your thoughts.',
    formType: 'Survey',
    fields: [
      { label: 'How did you hear about us?', field_type: 'radio', is_required: true, options: ['Social Media', 'Friend', 'Search Engine', 'Other'], order_index: 0 },
      { label: 'Would you recommend us?', field_type: 'radio', is_required: true, options: ['Yes', 'No'], order_index: 1 },
      { label: 'Additional Comments', field_type: 'textarea', is_required: false, order_index: 2 },
    ]
  },
  'feedback-form': {
    title: 'Product Feedback',
    description: 'Help us improve our products.',
    formType: 'Feedback Form',
    fields: [
      { label: 'Product Name', field_type: 'text', is_required: true, order_index: 0 },
      { label: 'Satisfaction Level', field_type: 'radio', is_required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'], order_index: 1 },
      { label: 'What can we improve?', field_type: 'textarea', is_required: false, order_index: 2 },
    ]
  },
  'registration-form': {
    title: 'Event Registration',
    description: 'Register for our upcoming event.',
    formType: 'Registration Form',
    fields: [
      { label: 'Full Name', field_type: 'text', is_required: true, order_index: 0 },
      { label: 'Email Address', field_type: 'email', is_required: true, order_index: 1 },
      { label: 'Phone Number', field_type: 'text', is_required: true, order_index: 2 },
      { label: 'Dietary Requirements', field_type: 'text', is_required: false, order_index: 3 },
    ]
  },
  'job-app': {
    title: 'Job Application',
    description: 'Apply for an open position.',
    formType: 'Job Application',
    fields: [
      { label: 'Full Name', field_type: 'text', is_required: true, order_index: 0 },
      { label: 'Email', field_type: 'email', is_required: true, order_index: 1 },
      { label: 'Phone', field_type: 'text', is_required: true, order_index: 2 },
      { label: 'Portfolio URL', field_type: 'text', is_required: false, order_index: 3 },
      { label: 'Why should we hire you?', field_type: 'textarea', is_required: true, order_index: 4 },
    ]
  },
  'order-form': {
    title: 'Product Order',
    description: 'Place an order for our products.',
    formType: 'Order Form',
    fields: [
      { label: 'Product Selection', field_type: 'radio', is_required: true, options: ['Basic Package', 'Pro Package', 'Enterprise'], order_index: 0 },
      { label: 'Quantity', field_type: 'number', is_required: true, order_index: 1 },
      { label: 'Shipping Address', field_type: 'textarea', is_required: true, order_index: 2 },
    ]
  },
  'quiz-builder': {
    title: 'Trivia Quiz',
    description: 'Test your knowledge!',
    formType: 'Quiz',
    fields: [
      { label: 'Question 1', field_type: 'radio', is_required: true, options: ['Option A', 'Option B', 'Option C', 'Option D'], order_index: 0 },
      { label: 'Question 2', field_type: 'radio', is_required: true, options: ['Option A', 'Option B', 'Option C', 'Option D'], order_index: 1 },
    ]
  },
  'poll-form': {
    title: 'Quick Poll',
    description: 'Vote for your favorite.',
    formType: 'Poll',
    fields: [
      { label: 'Which feature do you want next?', field_type: 'radio', is_required: true, options: ['Dark Mode', 'Mobile App', 'API Access', 'More Tools'], order_index: 0 }
    ]
  }
};

export function FormBuilder({ toolId }: { toolId?: string }) {
  const { token } = useAuth();
  const [view, setView] = useState<'dashboard' | 'create' | 'responses'>('dashboard');
  
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeFormResponses, setActiveFormResponses] = useState<any[]>([]);
  const [activeFormTitle, setActiveFormTitle] = useState<string>('');
  
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);

  // Form Creation State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formType, setFormType] = useState('Survey');
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  // Initialize from template if toolId is provided
  useEffect(() => {
    if (toolId && FORM_TEMPLATES[toolId] && toolId !== 'custom-form') {
      const tpl = FORM_TEMPLATES[toolId];
      setTitle(tpl.title);
      setDescription(tpl.description);
      setFormType(tpl.formType);
      setHeaderImageUrl(null);
      setFields(tpl.fields);
      setView('create');
    }
  }, [toolId]);

  useEffect(() => {
    if (view === 'dashboard' && token) {
      fetchForms();
    }
  }, [view, token]);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/form-builder/forms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch forms');
      const data = await res.json();
      setForms(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = async (formId: string, formTitle: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/form-builder/forms/${formId}/export/csv`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to download CSV');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formTitle.replace(/\s+/g, '_')}_responses.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert("Could not download CSV: " + err.message);
    }
  };

  const handleViewResponses = async (formId: string, formTitle: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/form-builder/forms/${formId}/responses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch responses');
      
      const data = await res.json();
      setActiveFormResponses(data.responses || []);
      setActiveFormTitle(formTitle);
      setView('responses');
    } catch (err: any) {
      alert("Could not fetch responses: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addField = () => {
    setFields([...fields, { label: '', field_type: 'text', is_required: false, order_index: fields.length }]);
  };

  const updateField = (index: number, key: keyof FormField, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const updateOptions = (index: number, optionsStr: string) => {
    const opts = optionsStr.split(',').map(o => o.trim()).filter(o => o);
    updateField(index, 'options', opts.length > 0 ? opts : undefined);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploadingImage(true);
    try {
      const res = await fetch(`${API_BASE_URL}/form-builder/forms/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      setHeaderImageUrl(data.url);
    } catch (err: any) {
      alert("Image upload failed: " + err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const saveForm = async () => {
    if (!title || fields.length === 0) {
      setError('Form must have a title and at least one field.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/form-builder/forms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          form_type: formType,
          header_image_url: headerImageUrl,
          is_published: true,
          allow_multiple_responses: true,
          fields: fields.map((f, i) => ({ ...f, order_index: i }))
        })
      });

      if (!res.ok) throw new Error('Failed to save form');
      
      const data = await res.json();
      if (data.form_id) {
        setCreatedUrl(`${API_BASE_URL}/form-builder/forms/view/${data.form_id}`);
        setForms(prev => [...prev, { ...data.form, id: data.form_id }]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (view === 'create') {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <button 
          onClick={() => { setView('dashboard'); setCreatedUrl(null); }}
          className="flex items-center gap-2 font-bold hover:underline mb-2 w-fit"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
          <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
            <Edit2 className="w-8 h-8" />
            Create New Form
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-bold rounded-xl flex items-center gap-2 w-full">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {createdUrl ? (
            <div className="bg-neo-blue text-white p-8 rounded-xl border-4 border-black text-center animate-in slide-in-from-bottom-4">
              <h4 className="text-2xl font-black uppercase mb-4">Form Created Successfully!</h4>
              <p className="font-bold mb-6">Share this link to collect responses:</p>
              <div className="flex items-center gap-4 bg-black p-4 rounded-xl">
                <input type="text" readOnly value={createdUrl} className="w-full bg-transparent outline-none font-mono text-white" />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(createdUrl);
                    alert('Link copied to clipboard!');
                  }}
                  className="bg-white text-black p-2 rounded-lg font-bold hover:bg-gray-200 shrink-0 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Copy
                </button>
              </div>
              <button 
                onClick={() => { setView('dashboard'); setCreatedUrl(null); }}
                className="mt-8 bg-neo-yellow text-black border-4 border-black px-8 py-3 font-black uppercase rounded-xl hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_#000] hover:shadow-none transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* HEADER IMAGE */}
              <div className="bg-gray-50 border-4 border-black p-6 rounded-xl hover:bg-gray-100 transition-colors">
                <label className="block text-xl font-black mb-4 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" /> Header Image (Optional)
                </label>
                
                {headerImageUrl && (
                  <div className="mb-4 relative rounded-xl overflow-hidden border-4 border-black">
                    <img 
                      src={headerImageUrl.startsWith('http') ? headerImageUrl : `${API_BASE_URL}${headerImageUrl}`} 
                      alt="Form Header" 
                      className="w-full h-48 object-cover"
                    />
                    <button 
                      onClick={() => setHeaderImageUrl(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-white border-4 border-black px-4 py-2 font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                    {isUploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                    {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* FORM DETAILS */}
              <div className="bg-gray-50 border-4 border-black p-6 rounded-xl hover:bg-gray-100 transition-colors grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-lg font-black uppercase mb-2">Form Title *</label>
                  <input 
                    type="text" value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full bg-gray-50 border-4 border-black p-4 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white"
                    placeholder="e.g. Customer Feedback Form"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-lg font-black uppercase mb-2">Description</label>
                  <textarea 
                    value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full bg-gray-50 border-4 border-black p-4 font-bold rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-white min-h-[100px]"
                    placeholder="Brief description of the form..."
                  />
                </div>
              </div>

              <div className="border-t-4 border-black pt-6">
                <h4 className="text-xl font-black uppercase mb-4 flex items-center justify-between">
                  Form Fields
                  <button onClick={addField} className="bg-neo-blue text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90">
                    <Plus className="w-4 h-4" /> Add Field
                  </button>
                </h4>

                <div className="space-y-4">
                  {fields.length === 0 && (
                    <div className="text-center p-8 border-4 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold">
                      No fields added yet. Click "Add Field" to start building your form.
                    </div>
                  )}
                  {fields.map((field, idx) => (
                    <div key={idx} className="bg-gray-100 border-4 border-black p-4 rounded-xl flex flex-col gap-4 relative pr-12">
                      <button onClick={() => removeField(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold uppercase mb-1">Field Label *</label>
                          <input 
                            type="text" value={field.label} onChange={e => updateField(idx, 'label', e.target.value)}
                            className="w-full bg-white border-2 border-black p-2 font-bold rounded-lg focus:outline-none"
                            placeholder="Question text"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold uppercase mb-1">Field Type</label>
                          <select 
                            value={field.field_type} onChange={e => updateField(idx, 'field_type', e.target.value)}
                            className="w-full bg-white border-2 border-black p-2 font-bold rounded-lg focus:outline-none"
                          >
                            <option value="text">Short Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="email">Email</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="radio">Multiple Choice (Radio)</option>
                            <option value="checkbox">Checkboxes</option>
                          </select>
                        </div>
                      </div>

                      {['dropdown', 'radio', 'checkbox'].includes(field.field_type) && (
                        <div>
                          <label className="block text-sm font-bold uppercase mb-1">Options (comma separated)</label>
                          <input 
                            type="text" 
                            value={field.options?.join(', ') || ''} 
                            onChange={e => updateOptions(idx, e.target.value)}
                            className="w-full bg-white border-2 border-black p-2 font-bold rounded-lg focus:outline-none"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`req-${idx}`}
                          checked={field.is_required} 
                          onChange={e => updateField(idx, 'is_required', e.target.checked)}
                          className="w-5 h-5 border-2 border-black accent-neo-pink"
                        />
                        <label htmlFor={`req-${idx}`} className="font-bold uppercase text-sm cursor-pointer">Required Field</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={saveForm}
                disabled={isSaving}
                className="w-full mt-6 bg-neo-pink text-white border-4 border-black px-8 py-4 font-black uppercase text-xl rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6" /> Save Form</>}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'responses') {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 font-bold hover:underline mb-2 w-fit"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
          <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
            <Users className="w-8 h-8" />
            {activeFormTitle} - Responses
          </h3>

          {activeFormResponses.length === 0 ? (
            <div className="text-center p-8 text-gray-500 font-bold border-4 border-dashed border-gray-300 rounded-xl">
              No responses have been submitted yet.
            </div>
          ) : (
            <div className="space-y-6">
              {activeFormResponses.map((resp, i) => (
                <div key={i} className="border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] bg-gray-50">
                  <div className="font-bold text-sm text-gray-500 mb-2 border-b-2 border-gray-200 pb-2">
                    Response #{i + 1} - {new Date(resp.submitted_at).toLocaleString()}
                  </div>
                  <div className="space-y-3">
                    {Object.entries(resp.answers || {}).map(([question, answer]) => (
                      <div key={question}>
                        <div className="font-bold text-sm">{question}</div>
                        <div className="bg-white p-2 rounded border-2 border-gray-200 mt-1">
                          {String(answer)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-3xl font-black uppercase flex items-center gap-3">
          <ClipboardList className="w-8 h-8" />
          My Forms
        </h3>
        <button 
          onClick={() => {
            if (toolId && FORM_TEMPLATES[toolId] && toolId !== 'custom-form') {
              const tpl = FORM_TEMPLATES[toolId];
              setTitle(tpl.title);
              setDescription(tpl.description);
              setFormType(tpl.formType);
              setHeaderImageUrl(null);
              setFields(tpl.fields);
            } else {
              setTitle('');
              setDescription('');
              setFormType('Survey');
              setHeaderImageUrl(null);
              setFields([]);
            }
            setCreatedUrl(null);
            setView('create');
          }}
          className="bg-neo-pink text-white font-black uppercase border-4 border-black px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create New
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-12 h-12 animate-spin text-neo-pink" />
        </div>
      ) : forms.length === 0 ? (
        <div className="bg-white border-4 border-black p-12 rounded-2xl shadow-[8px_8px_0px_0px_#000] text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-2xl font-black uppercase mb-2">No forms yet</h4>
          <p className="text-gray-500 font-bold mb-6">Create your first form to start collecting responses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forms.map(form => (
            <div key={form.id} className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] transition-all">
              <div className="inline-block bg-neo-pink text-white px-2 py-1 text-xs font-black uppercase rounded mb-3">
                {form.form_type}
              </div>
              <h4 className="text-2xl font-black uppercase mb-2 truncate">{form.title}</h4>
              <p className="text-gray-500 font-bold mb-6 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> {form.fields_count} fields
              </p>
              
              <div className="flex items-center gap-2 pt-4 border-t-4 border-gray-100 flex-wrap">
                <button 
                  onClick={() => {
                    setShareUrl(`${API_BASE_URL}/form-builder/forms/view/${form.id}`);
                    setCopiedShareUrl(false);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-black border-2 border-black py-2 rounded-lg font-bold uppercase text-sm flex justify-center items-center gap-1 min-w-[80px]"
                >
                  <Share2 className="w-4 h-4" /> Link
                </button>
                <button 
                  onClick={() => handleViewResponses(form.id, form.title)}
                  className="flex-1 bg-neo-yellow hover:bg-yellow-400 text-black border-2 border-black py-2 rounded-lg font-bold uppercase text-sm flex justify-center items-center gap-1 min-w-[100px]"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button 
                  onClick={() => handleDownloadCsv(form.id, form.title)}
                  className="flex-1 bg-neo-green hover:bg-green-400 text-black border-2 border-black py-2 rounded-lg font-bold uppercase text-sm flex justify-center items-center gap-1 min-w-[100px]"
                >
                  <Download className="w-4 h-4" /> CSV
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {shareUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShareUrl(null)}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neo-yellow border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_#000] max-w-lg w-full relative p-8 text-center"
            >
              <button 
                onClick={() => setShareUrl(null)}
                className="absolute top-5 right-5 z-50 bg-white border-4 border-black w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <X className="w-6 h-6 font-black" />
              </button>

              <h2 className="text-3xl font-black uppercase mb-6 leading-none tracking-tight text-black mt-2">Share Form</h2>
              <p className="font-bold text-lg mb-8 leading-relaxed text-black">
                Anyone with this link can fill out your form.
              </p>
              
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl border-4 border-black">
                <input 
                  type="text" 
                  readOnly 
                  value={shareUrl} 
                  className="w-full bg-transparent outline-none font-mono text-black px-2 overflow-hidden text-ellipsis" 
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedShareUrl(true);
                    setTimeout(() => setCopiedShareUrl(false), 2000);
                  }}
                  className={`px-4 py-3 rounded-lg font-black uppercase text-sm border-2 border-black flex items-center gap-2 transition-colors ${copiedShareUrl ? 'bg-green-400 text-black' : 'bg-neo-pink text-white hover:bg-pink-600'}`}
                >
                  {copiedShareUrl ? 'Copied!' : <><Share2 className="w-4 h-4" /> Copy</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
