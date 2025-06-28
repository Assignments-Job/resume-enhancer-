import { FileText, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resume Editor Pro</h1>
              <p className="text-sm text-gray-500">AI-Powered Resume Builder</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-primary-600">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Enhanced with AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;