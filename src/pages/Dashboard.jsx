import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../utils/ThemeContext';
import { theme } from '../utils/theme';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch {
      toast.error('Failed to load projects!');
    } finally {
      setLoading(false);
    }
  };

  const doneTasks = projects.reduce((a, p) => a, 0);

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto',
        padding: '32px 24px' }}>

        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,108,248,0.15), rgba(96,165,250,0.1))',
          border: `1px solid rgba(124,108,248,0.2)`,
          borderRadius: 16, padding: '24px 28px',
          marginBottom: 24,
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700,
            color: t.text, marginBottom: 6 }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: t.muted, fontSize: 14 }}>
            {user?.role === 'MANAGER'
              ? `You have ${projects.length} active projects`
              : 'Check your assigned tasks and update progress'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total Projects', value: projects.length,
              color: t.accent2 },
            { label: 'Your Role', value: user?.role,
              color: t.blue },
            { label: 'Status', value: 'Active',
              color: t.green },
          ].map((s, i) => (
            <div key={i} style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 12, padding: '16px 20px',
            }}>
              <p style={{ fontSize: 12, color: t.muted,
                marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700,
                color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Projects Header */}
        <div style={{ display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700,
            color: t.text }}>
            {user?.role === 'MANAGER'
              ? 'My Projects' : "Projects I'm In"}
          </h2>
          {user?.role === 'MANAGER' && (
            <button onClick={() => setShowModal(true)} style={{
              background: 'linear-gradient(135deg, #7c6cf8, #60a5fa)',
              color: 'white', border: 'none',
              padding: '8px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              + New Project
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0',
            color: t.muted }}>
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
            <p style={{ color: t.muted, fontSize: 15 }}>
              No projects yet!
            </p>
            {user?.role === 'MANAGER' && (
              <button onClick={() => setShowModal(true)} style={{
                marginTop: 16,
                background: 'linear-gradient(135deg, #7c6cf8, #60a5fa)',
                color: 'white', border: 'none',
                padding: '10px 24px', borderRadius: 9,
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16 }}>
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onProjectCreated={(p) => setProjects([...projects, p])}
        />
      )}
    </div>
  );
};

export default Dashboard;