import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ projectId, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeEmail: '',
    deadline: '',
    estimatedHours: '',
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🤖 Get AI Suggestions
  const handleAISuggest = async () => {
    if (!formData.description.trim()) {
      toast.error('Please enter a description first!');
      return;
    }
    setAiLoading(true);
    try {
      const response = await api.post('/ai/suggest', {
        description: formData.description,
      });
      const text = response.data.suggestions;
      setAiSuggestions(text);

      // Auto fill priority and hours from AI response
      const priorityMatch = text.match(
        /PRIORITY:\s*(HIGH|MEDIUM|LOW)/i);
      const hoursMatch = text.match(
        /ESTIMATED_HOURS:\s*(\d+)/i);

      if (priorityMatch) {
        setFormData(prev => ({
          ...prev,
          priority: priorityMatch[1].toUpperCase()
        }));
      }
      if (hoursMatch) {
        setFormData(prev => ({
          ...prev,
          estimatedHours: hoursMatch[1]
        }));
      }
      toast.success('AI suggestions ready! 🤖');
    } catch (error) {
      toast.error('AI suggestion failed!');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        estimatedHours: formData.estimatedHours
          ? parseInt(formData.estimatedHours) : null,
        deadline: formData.deadline || null,
        assigneeEmail: formData.assigneeEmail || null,
      };
      const response = await api.post(
        `/tasks/project/${projectId}`, payload);
      toast.success('Task created! 🎉');
      onTaskCreated(response.data);
      onClose();
    } catch (error) {
      toast.error('Failed to create task!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 
      flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl 
        w-full max-w-lg p-8 max-h-screen overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Task
          </h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600 
              text-2xl font-bold">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium 
              text-gray-700 mb-1">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Design Login Page"
              required
              className="w-full px-4 py-3 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-indigo-500 transition"
            />
          </div>

          {/* Description + AI Button */}
          <div>
            <label className="block text-sm font-medium 
              text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task in detail..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-indigo-500 transition resize-none"
            />
            {/* AI Suggest Button */}
            <button
              type="button"
              onClick={handleAISuggest}
              disabled={aiLoading}
              className="mt-2 w-full bg-gradient-to-r 
                from-purple-500 to-indigo-500 
                hover:from-purple-600 hover:to-indigo-600
                text-white font-medium py-2.5 rounded-lg 
                transition disabled:opacity-50 
                flex items-center justify-center gap-2"
            >
              {aiLoading ? (
                <>⏳ Getting AI Suggestions...</>
              ) : (
                <>🤖 Get AI Suggestions</>
              )}
            </button>
          </div>

          {/* AI Suggestions Box */}
          {aiSuggestions && (
            <div className="bg-gradient-to-br from-purple-50 
              to-indigo-50 border border-indigo-200 
              rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <span className="font-semibold text-indigo-700">
                  AI Suggestions
                </span>
                <span className="text-xs bg-indigo-100 
                  text-indigo-600 px-2 py-0.5 rounded-full">
                  Auto-filled below ✓
                </span>
              </div>
              <pre className="text-sm text-gray-700 
                whitespace-pre-wrap font-sans">
                {aiSuggestions}
              </pre>
            </div>
          )}

          {/* Priority & Hours Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium 
                text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 transition bg-white"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium 
                text-gray-700 mb-1">Estimated Hours</label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                placeholder="e.g. 3"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Assignee & Deadline Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium 
                text-gray-700 mb-1">Assignee Email</label>
              <input
                type="email"
                name="assigneeEmail"
                value={formData.assigneeEmail}
                onChange={handleChange}
                placeholder="rahul@test.com"
                className="w-full px-4 py-3 border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium 
                text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Buttons */}
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
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;