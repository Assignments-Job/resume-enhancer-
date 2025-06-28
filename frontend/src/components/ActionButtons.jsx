import { Download, FileText, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { downloadResumeJSON, downloadResumePDF, saveResume } from '../services/api';

const ActionButtons = ({ resumeData }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      await saveResume(resumeData);
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      // Debug: Log the data being sent
      console.log('Resume data being sent to PDF generator:', resumeData);

      const result = await downloadResumePDF(resumeData);
      toast.success(`Resume downloaded as ${result.filename}!`);
    } catch (error) {
      console.error('PDF download error:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadJSON = () => {
    try {
      downloadResumeJSON(resumeData);
      toast.success('Resume downloaded as JSON!');
    } catch (error) {
      toast.error('Failed to download JSON. Please try again.');
    }
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleSaveResume}
          disabled={isSaving}
          className="btn-primary flex items-center justify-center space-x-2 min-w-[140px]"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Resume'}</span>
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={isDownloadingPDF}
          className="btn-primary flex items-center justify-center space-x-2 min-w-[140px]"
        >
          {isDownloadingPDF ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>{isDownloadingPDF ? 'Generating...' : 'Download PDF'}</span>
        </button>

        <button
          onClick={handleDownloadJSON}
          className="btn-secondary flex items-center justify-center space-x-2 min-w-[140px]"
        >
          <FileText className="w-5 h-5" />
          <span>Download JSON</span>
        </button>
      </div>

      {/* Debug info - remove this in production */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
        <strong>Debug Info:</strong>
        <br />
        Personal Info: {resumeData?.personalInfo?.name || 'No name set'}
        <br />
        Experience entries: {resumeData?.experience?.length || 0}
        <br />
        Education entries: {resumeData?.education?.length || 0}
        <br />
        Skills: {resumeData?.skills?.length || 0}
      </div>
    </div>
  );
};

export default ActionButtons;