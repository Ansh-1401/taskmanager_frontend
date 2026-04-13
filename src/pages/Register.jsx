import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'DEVELOPER' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Account created! Please login');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed!');
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
            Create account
          </h1>
          <p style={{ color: '#8888aa', fontSize: 14 }}>
            Join TaskManager today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', name: 'name',
              type: 'text', placeholder: 'Ansh Srivastava' },
            { label: 'Email', name: 'email',
              type: 'email', placeholder: 'ansh@example.com' },
            { label: 'Password', name: 'password',
              type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12,
                fontWeight: 600, color: '#8888aa',
                marginBottom: 6, textTransform: 'uppercase',
                letterSpacing: '0.5px' }}>
                {field.label}
              </label>
              <input
                type={field.type} name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required style={inputStyle}
              />
            </div>
          ))}

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12,
              fontWeight: 600, color: '#8888aa',
              marginBottom: 6, textTransform: 'uppercase',
              letterSpacing: '0.5px' }}>
              I am a...
            </label>
            <select name="role" value={formData.role}
              onChange={handleChange}
              style={{ ...inputStyle,
                background: '#22222f' }}>
              <option value="DEVELOPER">Developer</option>
              <option value="MANAGER">Manager</option>
            </select>
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
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#8888aa',
          fontSize: 13, marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: '#a78bfa', fontWeight: 600,
            textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;