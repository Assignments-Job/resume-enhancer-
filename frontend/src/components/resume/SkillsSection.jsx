import { useState } from 'react';
import { Zap, Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { enhanceSection } from '../../services/api';
import toast from 'react-hot-toast';

const SkillsSection = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');
  const [enhancing, setEnhancing] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const newData = [...(data || []), newSkill.trim()];
    onChange(newData);
    setNewSkill('');
  };

  const handleRemoveSkill = (index) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const handleEnhance = async () => {
    if (!data || data.length === 0) {
      toast.error('Add some skills first');
      return;
    }

    setEnhancing(true);
    try {
      const content = data.join(', ');
      const enhanced = await enhanceSection('skills', content);
      
      // Parse enhanced skills back into array
      const enhancedSkills = enhanced.content
        .split(/[,\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      onChange(enhancedSkills);
      toast.success('Skills section enhanced!');
    } catch (error) {
      toast.error('Failed to enhance skills. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
            <Zap className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
            <p className="text-gray-600">Your technical and soft skills</p>
          </div>
        </div>
        
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
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="input-field flex-1"
            placeholder="Add a skill (e.g., JavaScript, Project Management)"
          />
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Skills Display */}
      <div className="space-y-4">
        {data && data.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.map((skill, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-2 rounded-lg border border-primary-200"
              >
                <span className="font-medium">{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-primary-500 hover:text-primary-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No skills added yet</p>
            <p className="text-sm">Add your first skill above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;