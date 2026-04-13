import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable }
  from '@hello-pangea/dnd';
import { useTheme } from '../utils/ThemeContext';
import { theme } from '../utils/theme';
import Navbar from '../components/Navbar';
import CreateTaskModal from '../components/CreateTaskModal';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusList = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

const statusConfig = {
  TODO: { label: 'Todo', color: '#8888aa', bar: '#8888aa' },
  IN_PROGRESS: { label: 'In Progress', color: '#60a5fa',
    bar: '#60a5fa' },
  REVIEW: { label: 'Review', color: '#a78bfa',
    bar: '#a78bfa' },
  DONE: { label: 'Done', color: '#22d3a0', bar: '#22d3a0' },
};

const priorityConfig = {
  HIGH: { color: '#f87171', label: 'High' },
  MEDIUM: { color: '#fbbf24', label: 'Medium' },
  LOW: { color: '#22d3a0', label: 'Low' },
};

const TaskCard = ({ task, isDark, t }) => (
  <div style={{
    background: t.surface2,
    border: `1px solid ${t.border}`,
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 8,
    cursor: 'grab',
    transition: 'border-color 0.2s',
  }}>
    {/* Priority & AI badge */}
    <div style={{ display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: priorityConfig[task.priority]?.color,
        }} />
        <span style={{ fontSize: 10, fontWeight: 600,
          color: priorityConfig[task.priority]?.color }}>
          {task.priority}
        </span>
      </div>
      {task.estimatedHours && (
        <span style={{
          fontSize: 10, color: t.muted,
          background: `rgba(124,108,248,0.1)`,
          padding: '2px 7px', borderRadius: 5,
          border: `1px solid rgba(124,108,248,0.2)`,
          color: '#a78bfa',
        }}>
          {task.estimatedHours}h
        </span>
      )}
    </div>

    {/* Title */}
    <p style={{ fontSize: 13, fontWeight: 600,
      color: t.text, marginBottom: 8, lineHeight: 1.4 }}>
      {task.title}
    </p>

    {/* Description */}
    {task.description && (
      <p style={{ fontSize: 11, color: t.muted,
        marginBottom: 8, lineHeight: 1.4,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {task.description}
      </p>
    )}

    {/* Footer */}
    <div style={{ display: 'flex', justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8, borderTop: `1px solid ${t.border}` }}>
      {task.assigneeName ? (
        <div style={{ display: 'flex', alignItems: 'center',
          gap: 5 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c6cf8, #60a5fa)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8, fontWeight: 700, color: 'white',
          }}>
            {task.assigneeName[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 10, color: t.muted }}>
            {task.assigneeName}
          </span>
        </div>
      ) : (
        <span style={{ fontSize: 10, color: t.muted }}>
          Unassigned
        </span>
      )}
      {task.deadline && (
        <span style={{ fontSize: 10, color: t.muted }}>
          📅 {new Date(task.deadline)
            .toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short'
            })}
        </span>
      )}
    </div>
  </div>
);

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => { fetchProjectAndTasks(); }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch {
      toast.error('Failed to load project!');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;
    const taskId = parseInt(draggableId);
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await api.patch(
        `/tasks/${taskId}/status?status=${newStatus}`);
      toast.success('Task moved!');
    } catch {
      toast.error('Failed!');
      fetchProjectAndTasks();
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        `/projects/${id}/members?memberEmail=${memberEmail}`);
      toast.success('Member added!');
      setMemberEmail('');
      setShowAddMember(false);
      fetchProjectAndTasks();
    } catch {
      toast.error('Failed to add member!');
    }
  };

  const getTasksByStatus = (status) =>
    tasks.filter(t => t.status === status);

  if (loading) return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 0',
        color: t.muted }}>
        Loading project...
      </div>
    </div>
  );

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 1300, margin: '0 auto',
        padding: '28px 24px' }}>

        {/* Back */}
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none', border: 'none',
          color: t.muted, cursor: 'pointer',
          fontSize: 13, marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← Back to Dashboard
        </button>

        {/* Project Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,108,248,0.15), rgba(96,165,250,0.1))',
          border: `1px solid rgba(124,108,248,0.2)`,
          borderRadius: 16, padding: '22px 28px',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700,
                color: t.text, marginBottom: 6 }}>
                {project?.name}
              </h1>
              <p style={{ color: t.muted, fontSize: 13,
                marginBottom: 12 }}>
                {project?.description}
              </p>
              <div style={{ display: 'flex', gap: 16,
                fontSize: 12, color: t.muted }}>
                <span>👤 {project?.ownerName}</span>
                <span>
                  👥 {project?.memberNames?.length || 0} members
                </span>
                <span>📋 {tasks.length} tasks</span>
              </div>
            </div>
            {user?.role === 'MANAGER' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() =>
                    setShowAddMember(!showAddMember)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: `1px solid rgba(255,255,255,0.2)`,
                    color: t.text, padding: '8px 16px',
                    borderRadius: 9, cursor: 'pointer',
                    fontSize: 13, fontWeight: 600,
                  }}>
                  + Add Member
                </button>
                <button
                  onClick={() => setShowTaskModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #7c6cf8, #60a5fa)',
                    border: 'none', color: 'white',
                    padding: '8px 16px', borderRadius: 9,
                    cursor: 'pointer', fontSize: 13,
                    fontWeight: 600,
                  }}>
                  + New Task
                </button>
              </div>
            )}
          </div>

          {/* Add Member Form */}
          {showAddMember && (
            <form onSubmit={handleAddMember} style={{
              marginTop: 16, display: 'flex', gap: 10 }}>
              <input
                type="email"
                value={memberEmail}
                onChange={e => setMemberEmail(e.target.value)}
                placeholder="Enter member email..."
                required
                style={{
                  flex: 1, padding: '8px 14px',
                  borderRadius: 8, border: 'none',
                  fontSize: 13, outline: 'none',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#1a1a2e',
                }}
              />
              <button type="submit" style={{
                background: 'white', color: '#7c6cf8',
                border: 'none', padding: '8px 18px',
                borderRadius: 8, fontWeight: 700,
                cursor: 'pointer', fontSize: 13,
              }}>
                Add
              </button>
            </form>
          )}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10, marginBottom: 24 }}>
          {statusList.map(status => (
            <div key={status} style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderTop: `3px solid ${statusConfig[status].bar}`,
              borderRadius: 10, padding: '12px 16px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 22, fontWeight: 700,
                color: statusConfig[status].color }}>
                {getTasksByStatus(status).length}
              </p>
              <p style={{ fontSize: 11, color: t.muted,
                marginTop: 2 }}>
                {statusConfig[status].label}
              </p>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14 }}>
            {statusList.map(status => (
              <div key={status} style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderTop: `3px solid ${statusConfig[status].bar}`,
                borderRadius: 12,
                padding: '14px',
              }}>
                {/* Column Header */}
                <div style={{ display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700,
                    color: statusConfig[status].color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px' }}>
                    {statusConfig[status].label}
                  </span>
                  <span style={{
                    background: t.surface2,
                    color: t.muted,
                    fontSize: 11, fontWeight: 700,
                    width: 22, height: 22, borderRadius: '50%',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {getTasksByStatus(status).length}
                  </span>
                </div>

                {/* Droppable */}
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 100,
                        borderRadius: 8,
                        padding: snapshot.isDraggingOver
                          ? '6px' : '0',
                        background: snapshot.isDraggingOver
                          ? 'rgba(124,108,248,0.06)' : 'transparent',
                        transition: 'background 0.2s',
                      }}
                    >
                      {getTasksByStatus(status).length === 0
                        && !snapshot.isDraggingOver ? (
                        <div style={{ textAlign: 'center',
                          padding: '20px 0',
                          color: t.muted, fontSize: 12 }}>
                          Drop tasks here
                        </div>
                      ) : (
                        getTasksByStatus(status).map(
                          (task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  transform: snapshot.isDragging
                                    ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                                    : provided.draggableProps.style?.transform,
                                  opacity: snapshot.isDragging
                                    ? 0.9 : 1,
                                }}
                              >
                                <TaskCard
                                  task={task}
                                  isDark={isDark}
                                  t={t}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {showTaskModal && (
        <CreateTaskModal
          projectId={id}
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={(task) =>
            setTasks([...tasks, task])}
        />
      )}
    </div>
  );
};

export default ProjectDetail;