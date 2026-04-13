import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { theme } from '../utils/theme';

const colors = ['#7c6cf8','#60a5fa','#22d3a0',
  '#f87171','#fbbf24','#a78bfa'];

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const color = colors[project.id % colors.length];

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.1s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top */}
      <div style={{ display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}22`,
          border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color,
        }}>
          {project.name[0].toUpperCase()}
        </div>
        <span style={{ fontSize: 11, color: t.muted }}>
          {new Date(project.createdAt)
            .toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short'
            })}
        </span>
      </div>

      {/* Name */}
      <h3 style={{ fontSize: 15, fontWeight: 700,
        color: t.text, marginBottom: 6 }}>
        {project.name}
      </h3>

      {/* Description */}
      <p style={{ fontSize: 12, color: t.muted,
        marginBottom: 14, lineHeight: 1.5,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {project.description || 'No description'}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTop: `1px solid ${t.border}` }}>

        {/* Member Avatars */}
        <div style={{ display: 'flex' }}>
          {(project.memberNames || [])
            .slice(0, 3).map((name, i) => (
            <div key={i} style={{
              width: 24, height: 24, borderRadius: '50%',
              background: colors[i % colors.length],
              border: `2px solid ${t.surface}`,
              marginRight: -8,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: 'white',
            }}>
              {name[0].toUpperCase()}
            </div>
          ))}
          {project.memberNames?.length === 0 && (
            <span style={{ fontSize: 11, color: t.muted }}>
              No members yet
            </span>
          )}
        </div>

        <span style={{ fontSize: 11, color: t.muted }}>
          👤 {project.ownerName}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;