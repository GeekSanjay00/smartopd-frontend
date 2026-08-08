import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(phone, password);
      if (response.success) {
        const { token, role, name } = response.data;
        login(token, role, name, phone);

        // Redirect based on role
        if (role === ROLES.ADMIN) navigate('/admin');
        else if (role === ROLES.DOCTOR) navigate('/doctor');
        else navigate('/patient');
      }
    } catch (err) {
      const msg = err.response && err.response.data
        ? err.response.data.message
        : 'Login failed!';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoDot}></span>
          SmartOPD
        </div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              type="tel"
              placeholder="Enter 10 digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            style={loading ? styles.btnDisabled : styles.btn}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.registerText}>
          New patient?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f1117',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    background: '#161b27',
    border: '0.5px solid #2a3148',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  logoDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#1D9E75',
    display: 'inline-block',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 6px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#6b7a9a',
    margin: '0 0 24px',
  },
  error: {
    background: '#D85A3020',
    border: '0.5px solid #D85A30',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#D85A30',
    fontSize: '13px',
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7a9a',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '0.5px solid #2a3148',
    background: '#0f1117',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    background: '#1D9E75',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
  },
  btnDisabled: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    background: '#1D9E7580',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'not-allowed',
    marginTop: '8px',
  },
  registerText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6b7a9a',
    marginTop: '20px',
  },
  link: {
    color: '#1D9E75',
    textDecoration: 'none',
  },
};

export default Login;