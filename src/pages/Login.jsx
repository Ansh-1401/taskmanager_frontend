import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../redux/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    { email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      const { token, name, email, role } = res.data;
      dispatch(loginSuccess({ token, user: { name, email, role } }));
      toast.success(`Welcome back ${name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f0f0ff',
    fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f13',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#1a1a24',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '40px 36px',
        width: '100%', maxWidth: 420,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #7c6cf8, #60a5fa)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: 'white',
            margin: '0 auto 14px',
          }}>T</div>
          <h1 style={{ fontSize: 22, fontWeight: 700,
            color: '#f0f0ff', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ color: '#8888aa', fontSize: 14 }}>
            Sign in to TaskManager
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12,
              fontWeight: 600, color: '#8888aa',
              marginBottom: 6, textTransform: 'uppercase',
              letterSpacing: '0.5px' }}>
              Email
            </label>
            <input
              type="email" name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ansh@example.com"
              required style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12,
              fontWeight: 600, color: '#8888aa',
              marginBottom: 6, textTransform: 'uppercase',
              letterSpacing: '0.5px' }}>
              Password
            </label>
            <input
              type="password" name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: 'linear-gradient(135deg, #7c6cf8, #60a5fa)',
            border: 'none', color: 'white',
            padding: '13px', borderRadius: 10,
            fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#8888aa',
          fontSize: 13, marginTop: 24 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#a78bfa', fontWeight: 600,
            textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;