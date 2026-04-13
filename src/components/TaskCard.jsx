    const priorityColors = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
};

const statusColors = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  REVIEW: 'bg-purple-100 text-purple-700',
  DONE: 'bg-green-100 text-green-700',
};

const TaskCard = ({ task, onClick }) => {
  return (
    <div
      onClick={() => onClick && onClick(task)}
      className="bg-white rounded-xl shadow-sm border 
        border-gray-100 p-5 cursor-pointer hover:shadow-md 
        hover:border-indigo-200 transition-all duration-200"
    >
      {/* Priority & Status */}
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 
          rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 
          rounded-full ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 mb-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center 
        pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">👤</span>
          <span className="text-xs text-gray-600 font-medium">
            {task.assigneeName || 'Unassigned'}
          </span>
        </div>
        {task.deadline && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">📅</span>
            <span className="text-xs text-gray-600">
              {new Date(task.deadline)
                .toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short'
                })}
            </span>
          </div>
        )}
      </div>

      {/* Estimated Hours */}
      {task.estimatedHours && (
        <div className="mt-2">
          <span className="text-xs text-gray-400">
            ⏱️ {task.estimatedHours} hrs estimated
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;