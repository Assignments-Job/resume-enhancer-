import { useState } from 'react';
import { Upload, FileText, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUpload = ({ onFileUpload, onStartFromScratch, isLoading }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files[0]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelection(file);
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    toast.success(`Parsing ${file.name}...`);
    onFileUpload(file);
  };

  if (isLoading) {
    return (
      <div className="card text-center animate-slide-up">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Parsing Your Resume
          </h3>
          <p className="text-gray-600">
            Our AI is extracting information from your document...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* File Upload Area */}
      <div
        className={`card border-2 border-dashed transition-all duration-200 ${
          dragOver 
            ? 'border-primary-400 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className={`w-12 h-12 mx-auto mb-4 ${
            dragOver ? 'text-primary-600' : 'text-gray-400'
          }`} />
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Your Resume
          </h3>
          <p className="text-gray-600 mb-6">
            Drag and drop your PDF or Word document here, or click to browse
          </p>
          
          <label className="btn-primary cursor-pointer inline-block">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            Choose File
          </label>
          
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">or</span>
        </div>
      </div>

      {/* Start from Scratch */}
      <div className="card border-primary-200 bg-primary-50">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
            <Plus className="w-6 h-6 text-primary-600" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start from Scratch
          </h3>
          <p className="text-gray-600 mb-6">
            Create a new resume with our guided form and AI assistance
          </p>
          
          <button
            onClick={onStartFromScratch}
            className="btn-primary"
          >
            Create New Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;