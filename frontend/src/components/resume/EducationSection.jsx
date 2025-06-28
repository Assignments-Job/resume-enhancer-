import { useState } from 'react';
import { GraduationCap, Plus, Edit3, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { enhanceSection } from '../../services/api';
import toast from 'react-hot-toast';

const EducationSection = ({ data, onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [enhancing, setEnhancing] = useState(false);
  const [editForm, setEditForm] = useState({
    school: '',
    degree: '',
    field: '',
    graduationDate: '',
    gpa: ''
  });

  const handleAdd = () => {
    setEditForm({
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
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
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    });
  };

  const handleDelete = (index) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditForm({
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    });
  };

  const handleEnhance = async () => {
    if (!data || data.length === 0) {
      toast.error('Add some education entries first');
      return;
    }

    setEnhancing(true);
    try {
      const content = data.map(edu => 
        `${edu.degree} in ${edu.field} from ${edu.school}, graduated ${edu.graduationDate}${edu.gpa ? `, GPA: ${edu.gpa}` : ''}`
      ).join('\n');

      const enhanced = await enhanceSection('education', content);
      toast.success('Education section enhanced!');
    } catch (error) {
      toast.error('Failed to enhance education. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
            <GraduationCap className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            <p className="text-gray-600">Your academic background</p>
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
            <span>Add Education</span>
          </button>
        </div>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {data && data.map((education, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {education.degree} in {education.field}
                </h3>
                <p className="text-primary-600 font-medium">{education.school}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span>Graduated: {education.graduationDate}</span>
                  {education.gpa && <span>GPA: {education.gpa}</span>}
                </div>
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
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No education added yet</p>
            <p className="text-sm">Click "Add Education" to get started</p>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {editingIndex !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-primary-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingIndex === 'new' ? 'Add New Education' : 'Edit Education'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School/University
              </label>
              <input
                type="text"
                value={editForm.school}
                onChange={(e) => setEditForm({...editForm, school: e.target.value})}
                className="input-field"
                placeholder="University Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <input
                type="text"
                value={editForm.degree}
                onChange={(e) => setEditForm({...editForm, degree: e.target.value})}
                className="input-field"
                placeholder="Bachelor's, Master's, PhD"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={editForm.field}
                onChange={(e) => setEditForm({...editForm, field: e.target.value})}
                className="input-field"
                placeholder="Computer Science"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Date
              </label>
              <input
                type="text"
                value={editForm.graduationDate}
                onChange={(e) => setEditForm({...editForm, graduationDate: e.target.value})}
                className="input-field"
                placeholder="May 2020"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={editForm.gpa}
                onChange={(e) => setEditForm({...editForm, gpa: e.target.value})}
                className="input-field"
                placeholder="3.8/4.0"
              />
            </div>
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

export default EducationSection;