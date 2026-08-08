import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, verifyOtp } from '../../api/auth';

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1 - Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await registerUser(name, phone, password, email);
      if (response.success) {
        setSuccess('OTP sent! Check IntelliJ console.');
        setStep(2);
      }
    } catch (err) {
      const msg = err.response && err.response.data
        ? err.response.data.message
        : 'Registration failed!';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await verifyOtp(phone, otp);
      if (response.success) {
        setSuccess('Registration complete! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const msg = err.response && err.response.data
        ? err.response.data.message
        : 'Invalid OTP!';
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
        <h2 style={styles.title}>
          {step === 1 ? 'Create Account' : 'Verify OTP'}
        </h2>
        <p style={styles.subtitle}>
          {step === 1
            ? 'Register as a patient'
            : `OTP sent to ${phone} — check IntelliJ console`}
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {step === 1 && (
          <form onSubmit={handleRegister}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                style={styles.input}
                type="tel"
                placeholder="10 digit phone number"
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
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email (optional)</label>
              <input
                style={styles.input}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              style={loading ? styles.btnDisabled : styles.btn}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Enter OTP</label>
              <input
                style={styles.input}
                type="text"
                placeholder="6 digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              style={loading ? styles.btnDisabled : styles.btn}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        <p style={styles.loginText}>
          Already have account?{' '}
          <Link to="/login" style={styles.link}>
            Login here
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
  successMsg: {
    background: '#1D9E7520',
    border: '0.5px solid #1D9E75',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#1D9E75',
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
  loginText: {
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

export default Register;