import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResumeForm from './components/ResumeForm';
import { mockResumeData } from './utils/mockData';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    
    // Mock file parsing - simulate API delay
    setTimeout(() => {
      setResumeData(mockResumeData);
      setIsLoading(false);
    }, 1500);
  };

  const handleStartFromScratch = () => {
    setResumeData({
      personalInfo: { name: '', email: '', phone: '', location: '' },
      experience: [],
      education: [],
      skills: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!resumeData ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Create Your Perfect Resume
              </h1>
              <p className="text-xl text-gray-600">
                Upload an existing resume or start from scratch with our AI-powered editor
              </p>
            </div>
            
            <FileUpload 
              onFileUpload={handleFileUpload}
              onStartFromScratch={handleStartFromScratch}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <ResumeForm 
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        )}
      </main>
    </div>
  );
}

export default App;