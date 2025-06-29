import axios from 'axios';

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

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