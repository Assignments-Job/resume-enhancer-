import { useState } from 'react';
import ActionButtons from './ActionButtons';
import EducationSection from './resume/EducationSection';
import ExperienceSection from './resume/ExperienceSection';
import PersonalInfoSection from './resume/PersonalInfoSection';
import SkillsSection from './resume/SkillsSection';

const ResumeForm = ({ resumeData, setResumeData }) => {
  const [activeSection, setActiveSection] = useState('personal');

  const updateResumeData = (section, data) => {
    console.log(`Updating ${section} with:`, data); // Debug log
    setResumeData(prev => {
      const updated = {
        ...prev,
        [section]: data
      };
      console.log('Updated resume data:', updated); // Debug log
      return updated;
    });
  };

  const sections = [
    { id: 'personalInfo', label: 'Personal Info', component: PersonalInfoSection },
    { id: 'experience', label: 'Experience', component: ExperienceSection },
    { id: 'education', label: 'Education', component: EducationSection },
    { id: 'skills', label: 'Skills', component: SkillsSection },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Your Resume
        </h2>
        <p className="text-gray-600">
          Make changes to your resume and enhance sections with AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${activeSection === section.id
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {sections.map((section) => {
              const Component = section.component;
              return (
                <div
                  key={section.id}
                  className={`${activeSection === section.id ? 'block' : 'hidden'} animate-slide-up`}
                >
                  <Component
                    data={resumeData[section.id]}
                    onChange={(data) => updateResumeData(section.id, data)}
                  />
                </div>
              );
            })}

            <ActionButtons resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;