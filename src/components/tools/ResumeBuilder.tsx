import React, { useState } from 'react';
import { FileText, Download, Plus, Trash2, Palette, ChevronRight, ChevronLeft } from 'lucide-react';

type Template = 'classic' | 'modern' | 'minimal' | 'creative';

export function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Data States
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '', email: '', phone: '', linkedIn: '', github: ''
  });
  const [summary, setSummary] = useState('');
  const [experiences, setExperiences] = useState([{ title: '', company: '', dates: '', description: '' }]);
  const [projects, setProjects] = useState([{ title: '', link: '', description: '' }]);
  const [educations, setEducations] = useState([{ degree: '', school: '', year: '' }]);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const [template, setTemplate] = useState<Template>('classic');

  const steps = [
    { title: 'Personal Info' },
    { title: 'Summary' },
    { title: 'Experience' },
    { title: 'Projects' },
    { title: 'Education' },
    { title: 'Skills' }
  ];

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const updateArrayItem = (setter: any, index: number, field: string, value: string) => {
    setter((prev: any[]) => {
      const newArray = [...prev];
      newArray[index] = { ...newArray[index], [field]: value };
      return newArray;
    });
  };

  const addArrayItem = (setter: any, emptyItem: any) => {
    setter((prev: any[]) => [...prev, emptyItem]);
  };

  const removeArrayItem = (setter: any, index: number) => {
    setter((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5 pr-2">
            <div>
              <label className="font-black uppercase text-xs block mb-2">Full Name</label>
              <input type="text" name="fullName" value={personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none transition-all shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-black uppercase text-xs block mb-2">Email</label>
                <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none transition-all shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px]" />
              </div>
              <div>
                <label className="font-black uppercase text-xs block mb-2">Phone</label>
                <input type="text" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none transition-all shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px]" />
              </div>
            </div>
            <div>
              <label className="font-black uppercase text-xs block mb-2">LinkedIn (Optional)</label>
              <input type="text" name="linkedIn" value={personalInfo.linkedIn} onChange={handlePersonalInfoChange} className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none transition-all shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px]" />
            </div>
            <div>
              <label className="font-black uppercase text-xs block mb-2">GitHub (Optional)</label>
              <input type="text" name="github" value={personalInfo.github} onChange={handlePersonalInfoChange} className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none transition-all shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px]" />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <label className="font-black uppercase text-xs block mb-1">Professional Summary</label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={5} placeholder="Write a brief professional summary..." className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-neo-blue resize-none" />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-neo-yellow p-4 rounded-xl border-4 border-black relative shadow-[4px_4px_0px_0px_#000]">
                <button onClick={() => removeArrayItem(setExperiences, index)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md border-2 border-black hover:bg-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="font-black uppercase mb-3">Role {index + 1}</h4>
                <div className="space-y-3">
                  <input type="text" placeholder="Job Title" value={exp.title} onChange={e => updateArrayItem(setExperiences, index, 'title', e.target.value)} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Company" value={exp.company} onChange={e => updateArrayItem(setExperiences, index, 'company', e.target.value)} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white" />
                    <input type="text" placeholder="Dates (e.g. 2021 - Present)" value={exp.dates} onChange={e => updateArrayItem(setExperiences, index, 'dates', e.target.value)} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white" />
                  </div>
                  <textarea placeholder="Description" value={exp.description} onChange={e => updateArrayItem(setExperiences, index, 'description', e.target.value)} rows={3} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white resize-none" />
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem(setExperiences, { title: '', company: '', dates: '', description: '' })} className="w-full bg-white border-4 border-black border-dashed p-3 rounded-xl font-black uppercase flex justify-center items-center gap-2 hover:bg-gray-50">
              <Plus className="w-5 h-5" /> Add Experience
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {projects.map((proj, index) => (
              <div key={index} className="bg-neo-pink p-4 rounded-xl border-4 border-black relative shadow-[4px_4px_0px_0px_#000]">
                <button onClick={() => removeArrayItem(setProjects, index)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md border-2 border-black hover:bg-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="font-black uppercase mb-3">Project {index + 1}</h4>
                <div className="space-y-3">
                  <input type="text" placeholder="Project Title" value={proj.title} onChange={e => updateArrayItem(setProjects, index, 'title', e.target.value)} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white" />
                  <input type="text" placeholder="Link (Optional)" value={proj.link} onChange={e => updateArrayItem(setProjects, index, 'link', e.target.value)} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white" />
                  <textarea placeholder="Description" value={proj.description} onChange={e => updateArrayItem(setProjects, index, 'description', e.target.value)} rows={3} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white resize-none" />
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem(setProjects, { title: '', link: '', description: '' })} className="w-full bg-white border-4 border-black border-dashed p-3 rounded-xl font-black uppercase flex justify-center items-center gap-2 hover:bg-gray-50">
              <Plus className="w-5 h-5" /> Add Project
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            {educations.map((edu, index) => (
              <div key={index} className="bg-neo-green p-4 rounded-xl border-4 border-black relative shadow-[4px_4px_0px_0px_#000]">
                <button onClick={() => removeArrayItem(setEducations, index)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md border-2 border-black hover:bg-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="font-black uppercase mb-3">Degree {index + 1}</h4>
                <div className="space-y-3">
                  <input type="text" placeholder="Degree / Major" value={edu.degree} onChange={e => updateArrayItem(setEducations, index, 'degree', e.target.value)} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white" />
                  <input type="text" placeholder="University / School" value={edu.school} onChange={e => updateArrayItem(setEducations, index, 'school', e.target.value)} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white" />
                  <input type="text" placeholder="Graduation Year" value={edu.year} onChange={e => updateArrayItem(setEducations, index, 'year', e.target.value)} className="w-full border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-white" />
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem(setEducations, { degree: '', school: '', year: '' })} className="w-full bg-white border-4 border-black border-dashed p-3 rounded-xl font-black uppercase flex justify-center items-center gap-2 hover:bg-gray-50">
              <Plus className="w-5 h-5" /> Add Education
            </button>
          </div>
        );
      case 5:
        return (
          <div>
            <label className="font-black uppercase text-xs block mb-1">Skills</label>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={currentSkill} 
                onChange={(e) => setCurrentSkill(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="E.g. Flutter, Python, UI/UX Design..." 
                className="flex-1 min-w-0 border-2 border-black rounded-lg p-2 font-bold focus:ring-2 focus:ring-neo-blue" 
              />
              <button type="button" onClick={handleAddSkill} className="bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-gray-800 shrink-0">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="bg-neo-blue text-white border-2 border-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-[2px_2px_0px_0px_#000]">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-300 ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8 print:hidden">
        <div className="bg-neo-blue p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase">Resume Builder</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Form - Hidden on print */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 print:hidden flex flex-col h-full">
          <div className="bg-gray-50 border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex-1 flex flex-col">
            
            {/* Stepper Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="font-black uppercase text-2xl leading-none min-w-0 break-words">{steps[currentStep].title}</h3>
              <span className="font-bold text-gray-600 bg-gray-200 px-3 py-1 rounded-full text-sm border-2 border-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            {/* Form Content */}
            <div className="flex-1 overflow-y-auto mb-6 pr-2">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4 w-full">
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="w-full sm:flex-1 bg-white disabled:opacity-50 disabled:cursor-not-allowed border-4 border-black font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#000]"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="w-full sm:flex-1 bg-neo-pink disabled:opacity-50 disabled:cursor-not-allowed text-black border-4 border-black font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#000]"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>


        {/* Live Preview / Generated Content */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full min-h-[700px] print:col-span-12 print:h-auto">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
              <Palette className="w-5 h-5" />
              <span className="font-black uppercase text-sm">Template:</span>
              <select 
                value={template} 
                onChange={(e) => setTemplate(e.target.value as Template)}
                className="bg-gray-100 border-2 border-black rounded-lg px-2 py-1 font-bold text-sm focus:outline-none cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <option value="classic">Classic (ATS)</option>
                <option value="modern">Modern Professional</option>
                <option value="minimal">Minimalist</option>
                <option value="creative">Creative Studio</option>
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="bg-neo-yellow text-black border-4 border-black font-black py-3 px-6 rounded-xl flex items-center gap-2 transition-all uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
            >
              <Download className="w-5 h-5" /> Print / Save PDF
            </button>
          </div>

          <div className="flex-1 bg-white border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden print:border-none print:shadow-none print:overflow-visible">
            <div className="h-full overflow-y-auto" id="resume-preview">
              <ResumePreviewContent 
                personalInfo={personalInfo} 
                summary={summary}
                experiences={experiences.filter(e => e.title.trim())}
                projects={projects.filter(p => p.title.trim())}
                educations={educations.filter(e => e.degree.trim())}
                skills={skills}
                template={template} 
              />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            min-height: 100%;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}} />
    </div>
  );
}

// Subcomponent to render the resume dynamically based on the selected template
function ResumePreviewContent({ personalInfo, summary, experiences, projects, educations, skills, template }: any) {
  
  const getContainerClass = () => {
    switch (template) {
      case 'modern': return 'p-8 font-sans bg-white text-gray-800';
      case 'minimal': return 'p-10 font-light bg-white text-gray-600';
      case 'creative': return 'p-0 font-sans bg-[#fdf8f5] text-gray-900 border-t-8 border-neo-pink h-full min-h-full';
      case 'classic': default: return 'p-8 font-serif bg-white text-black';
    }
  };

  const getHeaderClass = () => {
    switch (template) {
      case 'modern': return 'border-l-4 border-neo-blue pl-4 mb-8';
      case 'minimal': return 'text-center border-b border-gray-200 pb-8 mb-8';
      case 'creative': return 'bg-neo-pink text-black p-8 border-b-4 border-black mb-8 text-center';
      case 'classic': default: return 'text-center border-b-2 border-black pb-6 mb-6';
    }
  };

  const getSectionTitleClass = () => {
    switch (template) {
      case 'modern': return 'text-xl font-bold uppercase text-neo-blue mb-4 border-b-2 border-gray-100 pb-2';
      case 'minimal': return 'text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 mb-4';
      case 'creative': return 'text-xl font-black uppercase bg-black text-white inline-block px-3 py-1 mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]';
      case 'classic': default: return 'text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1';
    }
  };

  return (
    <div className={getContainerClass()}>
      {/* Header */}
      <div className={getHeaderClass()}>
        <h1 className={`${template === 'minimal' ? 'text-4xl font-light tracking-wide' : 'text-3xl font-black uppercase tracking-wider'}`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div className={`text-sm mt-3 flex flex-wrap gap-4 ${template === 'minimal' || template === 'classic' || template === 'creative' ? 'justify-center' : ''} ${template === 'modern' ? 'text-gray-500' : 'text-gray-600 font-semibold'}`}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span className={template === 'minimal' ? 'text-gray-300' : ''}>{template === 'minimal' ? '•' : '|'}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.linkedIn && <span className={template === 'minimal' ? 'text-gray-300' : ''}>{template === 'minimal' ? '•' : '|'}</span>}
          {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
          {personalInfo.github && <span className={template === 'minimal' ? 'text-gray-300' : ''}>{template === 'minimal' ? '•' : '|'}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      <div className={template === 'creative' ? 'px-8 pb-8' : ''}>
        {/* Summary */}
        {summary && (
          <div className="mb-8">
            <h3 className={getSectionTitleClass()}>Professional Summary</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h3 className={getSectionTitleClass()}>Experience</h3>
            <div className="space-y-4">
              {experiences.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{exp.title}</h4>
                    <span className="text-xs font-semibold italic text-gray-500">{exp.dates}</span>
                  </div>
                  <div className="text-sm font-semibold mb-2">{exp.company}</div>
                  <p className="text-sm whitespace-pre-wrap text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h3 className={getSectionTitleClass()}>Projects</h3>
            <div className="space-y-4">
              {projects.map((proj: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{proj.title}</h4>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Link</a>}
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-gray-700 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div className="mb-8">
            <h3 className={getSectionTitleClass()}>Education</h3>
            <div className="space-y-4">
              {educations.map((edu: any, i: number) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h4 className="font-bold">{edu.degree}</h4>
                    <div className="text-sm">{edu.school}</div>
                  </div>
                  <span className="text-xs font-semibold italic text-gray-500">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className={getSectionTitleClass()}>Skills</h3>
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              {skills.map((skill: string, i: number) => (
                <span key={i} className={`${template === 'creative' ? 'bg-neo-blue text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-1' : template === 'modern' ? 'bg-blue-50 text-neo-blue px-3 py-1 rounded-full' : template === 'minimal' ? 'text-gray-600 after:content-["•"] after:mx-2 last:after:content-none' : 'bg-gray-200 px-2 py-1 rounded-md'}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const resumeBuilderInstructions = [
  "Use the stepper to fill in your personal details, experience, projects, and education.",
  "Preview your resume live on the right side as you type.",
  "Select a Template to instantly change the style and layout.",
  "When you are finished, click Print / Save PDF to export your final document!"
];
