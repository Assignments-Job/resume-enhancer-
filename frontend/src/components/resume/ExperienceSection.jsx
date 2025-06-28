import { useState } from 'react';
import { Briefcase, Plus, Edit3, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { enhanceSection } from '../../services/api';
import toast from 'react-hot-toast';

const ExperienceSection = ({ data, onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [enhancing, setEnhancing] = useState(false);
  const [editForm, setEditForm] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleAdd = () => {
    setEditForm({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setEditingIndex('new');
  };

  const handleEdit = (index) => {
    setEditForm(data[index]);
    setEditingIndex(index);
  };

  const handleSave = () => {
    const newData = [...(data || [])];
    
    if (editingIndex === 'new') {
      newData.push(editForm);
    } else {
      newData[editingIndex] = editForm;
    }
    
    onChange(newData);
    setEditingIndex(null);
    setEditForm({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const handleDelete = (index) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditForm({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const handleEnhance = async () => {
    if (!data || data.length === 0) {
      toast.error('Add some experience entries first');
      return;
    }

    setEnhancing(true);
    try {
      const content = data.map(exp => 
        `${exp.position} at ${exp.company}: ${exp.description}`
      ).join('\n\n');

      const enhanced = await enhanceSection('experience', content);
      
      // Parse enhanced content back into structured format
      const enhancedExperience = data.map((exp, index) => ({
        ...exp,
        description: enhanced.content.split('\n\n')[index] || exp.description
      }));

      onChange(enhancedExperience);
      toast.success('Experience section enhanced!');
    } catch (error) {
      toast.error('Failed to enhance experience. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
            <Briefcase className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
            <p className="text-gray-600">Your professional background</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleEnhance}
            disabled={enhancing || !data || data.length === 0}
            className="btn-secondary flex items-center space-x-2"
          >
            {enhancing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{enhancing ? 'Enhancing...' : 'Enhance with AI'}</span>
          </button>
          
          <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {data && data.map((experience, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{experience.position}</h3>
                <p className="text-primary-600 font-medium">{experience.company}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {experience.startDate} - {experience.endDate}
                </p>
                <p className="text-gray-700">{experience.description}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {(!data || data.length === 0) && editingIndex !== 'new' && (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No work experience added yet</p>
            <p className="text-sm">Click "Add Experience" to get started</p>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {editingIndex !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-primary-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingIndex === 'new' ? 'Add New Experience' : 'Edit Experience'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={editForm.company}
                onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                className="input-field"
                placeholder="Company Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                value={editForm.position}
                onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                className="input-field"
                placeholder="Job Title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={editForm.startDate}
                onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                className="input-field"
                placeholder="Jan 2020"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="text"
                value={editForm.endDate}
                onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                className="input-field"
                placeholder="Present"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              rows={4}
              className="input-field"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button onClick={handleSave} className="btn-primary">
              Save
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;