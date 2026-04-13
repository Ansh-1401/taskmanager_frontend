import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { useTheme } from '../utils/ThemeContext';
import { theme } from '../utils/theme';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out!');
    navigate('/login');
  };

  return (
    <nav style={{
      background: t.surface,
      borderBottom: `1px solid ${t.border}`,
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        onClick={() => navigate('/dashboard')}
        className="cursor-pointer">
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #7c6cf8, #60a5fa)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: 'white',
        }}>T</div>
        <span style={{
          fontWeight: 700, fontSize: 16,
          color: t.text, letterSpacing: '-0.3px'
        }}>
          TaskManager
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Role Badge */}
        <span style={{
          background: 'rgba(124,108,248,0.15)',
          color: t.accent2,
          fontSize: 11, fontWeight: 700,
          padding: '4px 12px', borderRadius: 20,
          border: `1px solid rgba(124,108,248,0.3)`,
          letterSpacing: '0.5px',
        }}>
          {user?.role}
        </span>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{
          background: t.surface2,
          border: `1px solid ${t.border}`,
          color: t.muted,
          padding: '6px 12px',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
        }}>
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* User Name */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 13, fontWeight: 600,
            color: t.text, margin: 0 }}>
            {user?.name}
          </p>
          <p style={{ fontSize: 11, color: t.muted, margin: 0 }}>
            {user?.email}
          </p>
        </div>

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c6cf8, #60a5fa)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'white',
        }}>
          {initials}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.3)',
          color: t.red,
          padding: '6px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;