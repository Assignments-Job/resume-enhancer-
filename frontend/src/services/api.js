import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const enhanceSection = async (section, content) => {
  try {
    const response = await api.post('/ai-enhance', {
      section,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error enhancing section:', error);
    throw error;
  }
};

export const saveResume = async (resumeData) => {
  try {
    const response = await api.post('/save-resume', resumeData);
    return response.data;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
};

export const downloadResumePDF = async (resumeData) => {
  try {
    const response = await api.post('/download-resume-pdf', resumeData, {
      responseType: 'blob'
    });

    // Get the name for the filename
    const personalInfo = resumeData.personalInfo || {};
    const name = personalInfo.name || 'Resume';

    // Clean the name for filename
    const safeName = name.replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_');
    const filename = `${safeName}_Resume.pdf`;

    // Create blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error('Error downloading resume PDF:', error);
    throw error;
  }
};

// Keep the old JSON download function for backward compatibility
export const downloadResumeJSON = (resumeData) => {
  try {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `resume_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error downloading resume JSON:', error);
    throw error;
  }
};