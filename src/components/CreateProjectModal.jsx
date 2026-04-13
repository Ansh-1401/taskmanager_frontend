import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/projects', formData);
      toast.success('Project created! 🎉');
      onProjectCreated(response.data);
      onClose();
    } catch (error) {
      toast.error('Failed to create project!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 
      flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl 
        w-full max-w-md p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 
              text-2xl font-bold transition"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium 
              text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. College Final Year Project"
              required
              className="w-full px-4 py-3 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium 
              text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-indigo-500 transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 
                text-gray-700 rounded-lg hover:bg-gray-50 
                font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 
                text-white font-semibold py-3 rounded-lg transition
                disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;