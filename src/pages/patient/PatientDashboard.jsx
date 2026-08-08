import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>

        {/* Welcome */}
        <div style={styles.welcome}>
          <h1 style={styles.welcomeTitle}>
            Welcome, {user ? user.name : ''}! 👋
          </h1>
          <p style={styles.welcomeSubtitle}>
            Book your OPD token and skip the long queues
          </p>
        </div>

        {/* Action Cards */}
        <div style={styles.cardGrid}>
          <div style={styles.card} onClick={() => navigate('/patient/book')}>
            <div style={styles.cardIcon}>🎫</div>
            <h3 style={styles.cardTitle}>Book Token</h3>
            <p style={styles.cardDesc}>
              Book your OPD token from home — no need to stand in line
            </p>
            <button style={styles.cardBtn}>Book Now →</button>
          </div>

          <div style={styles.card} onClick={() => navigate('/patient/queue/1')}>
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>Live Queue</h3>
            <p style={styles.cardDesc}>
              Check real-time queue status for any department
            </p>
            <button style={styles.cardBtn}>View Queue →</button>
          </div>

          <div style={styles.card} onClick={() => navigate('/patient/tokens')}>
            <div style={styles.cardIcon}>📋</div>
            <h3 style={styles.cardTitle}>My Tokens</h3>
            <p style={styles.cardDesc}>
              View all your booked tokens and their current status
            </p>
            <button style={styles.cardBtn}>View Tokens →</button>
          </div>
        </div>

        {/* How it works */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>How it works?</h3>
          <div style={styles.steps}>
            <div style={styles.step}>
              <span style={styles.stepNum}>1</span>
              <span style={styles.stepText}>Book token from home</span>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.step}>
              <span style={styles.stepNum}>2</span>
              <span style={styles.stepText}>Track live queue</span>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.step}>
              <span style={styles.stepNum}>3</span>
              <span style={styles.stepText}>Come when turn is near</span>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.step}>
              <span style={styles.stepNum}>4</span>
              <span style={styles.stepText}>Meet the doctor!</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0f1117' },
  content: { padding: '24px', maxWidth: '1000px', margin: '0 auto' },
  welcome: { marginBottom: '32px' },
  welcomeTitle: { fontSize: '24px', fontWeight: '600', color: '#fff', margin: '0 0 8px' },
  welcomeSubtitle: { fontSize: '14px', color: '#6b7a9a', margin: 0 },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  card: {
    background: '#161b27',
    border: '0.5px solid #2a3148',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
  },
  cardIcon: { fontSize: '32px', marginBottom: '12px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 8px' },
  cardDesc: { fontSize: '13px', color: '#6b7a9a', margin: '0 0 16px', lineHeight: '1.5' },
  cardBtn: {
    fontSize: '13px', color: '#1D9E75',
    background: 'transparent', border: 'none',
    cursor: 'pointer', padding: 0, fontWeight: '500',
  },
  infoBox: {
    background: '#161b27',
    border: '0.5px solid #2a3148',
    borderRadius: '12px',
    padding: '24px',
  },
  infoTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 20px' },
  steps: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  step: { display: 'flex', alignItems: 'center', gap: '10px' },
  stepNum: {
    width: '28px', height: '28px', borderRadius: '50%',
    background: '#1D9E7520', color: '#1D9E75',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '600', flexShrink: 0,
  },
  stepText: { fontSize: '13px', color: '#c8d0e7' },
  stepArrow: { color: '#2a3148', fontSize: '18px' },
};

export default PatientDashboard;