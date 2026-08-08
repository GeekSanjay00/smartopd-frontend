import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAllDoctors,
  callNextPatient,
  markTokenDone,
  skipPatient,
  toggleAvailability,
} from '../../api/doctor';
import { getQueueStatus } from '../../api/queue';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const response = await getAllDoctors();
      if (response.success) {
        const myDoctor = response.data.find(
          (d) => d.user && d.user.phone === (user ? user.phone : '')
        );
        if (myDoctor) {
          setDoctor(myDoctor);
          fetchQueue(myDoctor.department ? myDoctor.department.id : null);
        }
      }
    } catch (err) {
      setError('Failed to load doctor data!');
    } finally {
      setLoading(false);
    }
  };

  const fetchQueue = async (deptId) => {
    if (!deptId) return;
    try {
      const response = await getQueueStatus(deptId);
      if (response.success) setQueueData(response.data);
    } catch (err) {
      console.error('Queue fetch failed:', err);
    }
  };

  const handleNextPatient = async () => {
    try {
      const response = await callNextPatient(doctor.id);
      if (response.success) {
        setCurrentToken(response.data);
        setMessage(`Now serving: ${response.data}`);
        fetchQueue(doctor.department ? doctor.department.id : null);
      }
    } catch (err) {
      const msg = err.response && err.response.data
        ? err.response.data.message
        : 'Failed to call next patient!';
      setError(msg);
    }
  };

  const handleDone = async () => {
    if (!currentToken) return;
    try {
      await markTokenDone(doctor.id, currentToken);
      setMessage(`Token ${currentToken} marked as done!`);
      setCurrentToken(null);
      fetchQueue(doctor.department ? doctor.department.id : null);
    } catch (err) {
      setError('Failed to mark done!');
    }
  };

  const handleSkip = async () => {
    if (!currentToken) return;
    try {
      await skipPatient(doctor.id, currentToken);
      setMessage(`Token ${currentToken} skipped!`);
      setCurrentToken(null);
      fetchQueue(doctor.department ? doctor.department.id : null);
    } catch (err) {
      setError('Failed to skip!');
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const response = await toggleAvailability(doctor.id);
      if (response.success) {
        setDoctor(response.data);
        setMessage(
          `You are now ${response.data.available ? 'Available' : 'Busy'}`
        );
      }
    } catch (err) {
      setError('Failed to toggle availability!');
    }
  };

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Doctor Dashboard</h2>
            <p style={styles.subtitle}>
              {doctor ? doctor.name : ''} —{' '}
              {doctor && doctor.department ? doctor.department.name : ''} Department
            </p>
          </div>
          <button
            style={{
              ...styles.availBtn,
              background: doctor && doctor.available ? '#1D9E7520' : '#D85A3020',
              color: doctor && doctor.available ? '#1D9E75' : '#D85A30',
              border: `0.5px solid ${doctor && doctor.available ? '#1D9E75' : '#D85A30'}`,
            }}
            onClick={handleToggleAvailability}
          >
            {doctor && doctor.available ? '✅ Available' : '❌ Busy'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}

        <div style={styles.grid}>

          {/* Current Patient */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Current Patient</h3>
            {currentToken ? (
              <div style={styles.currentPatient}>
                <div style={styles.tokenBig}>{currentToken}</div>
                <div style={styles.actionBtns}>
                  <button style={styles.doneBtn} onClick={handleDone}>
                    ✅ Done
                  </button>
                  <button style={styles.skipBtn} onClick={handleSkip}>
                    ⏭️ Skip
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.noPatient}>
                <p style={styles.noPatientText}>No patient being served</p>
                <button style={styles.nextBtn} onClick={handleNextPatient}>
                  Call Next Patient →
                </button>
              </div>
            )}
          </div>

          {/* Queue Status */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Queue Status</h3>
              <button
                style={styles.refreshBtn}
                onClick={() => fetchQueue(doctor && doctor.department ? doctor.department.id : null)}
              >
                🔄 Refresh
              </button>
            </div>
            <div style={styles.queueStats}>
              <div style={styles.queueStat}>
                <div style={styles.queueStatNum}>
                  {queueData ? queueData.totalWaiting : 0}
                </div>
                <div style={styles.queueStatLabel}>Waiting</div>
              </div>
              <div style={styles.queueStat}>
                <div style={styles.queueStatNum}>
                  {queueData ? queueData.avgWaitMinutes : 0} min
                </div>
                <div style={styles.queueStatLabel}>Avg Wait</div>
              </div>
            </div>

            <div style={styles.waitingList}>
              {queueData && queueData.waitingTokens && queueData.waitingTokens.length === 0 ? (
                <p style={styles.emptyText}>Queue is empty!</p>
              ) : (
                queueData && queueData.waitingTokens && queueData.waitingTokens.map((token, index) => (
                  <div key={index} style={styles.waitingItem}>
                    <span style={styles.waitPos}>#{token.position}</span>
                    <span style={styles.waitToken}>{token.tokenNumber}</span>
                    <span style={styles.waitTime}>{token.estimatedWait}</span>
                  </div>
                ))
              )}
            </div>

            {queueData && queueData.waitingTokens && queueData.waitingTokens.length > 0 && (
              <button style={styles.nextBtn} onClick={handleNextPatient}>
                Call Next Patient →
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0f1117' },
  content: { padding: '24px', maxWidth: '1000px', margin: '0 auto' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px',
  },
  title: { fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' },
  subtitle: { fontSize: '13px', color: '#6b7a9a', margin: 0 },
  availBtn: {
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '13px', cursor: 'pointer', fontWeight: '500',
  },
  error: {
    background: '#D85A3020', border: '0.5px solid #D85A30',
    borderRadius: '8px', padding: '10px 14px',
    color: '#D85A30', fontSize: '13px', marginBottom: '16px',
  },
  success: {
    background: '#1D9E7520', border: '0.5px solid #1D9E75',
    borderRadius: '8px', padding: '10px 14px',
    color: '#1D9E75', fontSize: '13px', marginBottom: '16px',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px',
  },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 16px' },
  currentPatient: { textAlign: 'center' },
  tokenBig: {
    fontSize: '40px', fontWeight: '700',
    color: '#1D9E75', marginBottom: '20px',
  },
  actionBtns: { display: 'flex', gap: '10px' },
  doneBtn: {
    flex: 1, padding: '10px', borderRadius: '8px',
    background: '#1D9E75', color: '#fff',
    fontSize: '14px', border: 'none', cursor: 'pointer',
  },
  skipBtn: {
    flex: 1, padding: '10px', borderRadius: '8px',
    background: '#BA751720', color: '#BA7517',
    fontSize: '14px', border: '0.5px solid #BA7517', cursor: 'pointer',
  },
  noPatient: { textAlign: 'center', padding: '20px 0' },
  noPatientText: { color: '#6b7a9a', fontSize: '14px', marginBottom: '16px' },
  nextBtn: {
    width: '100%', padding: '10px', borderRadius: '8px',
    background: '#378ADD', color: '#fff',
    fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '12px',
  },
  refreshBtn: {
    background: 'transparent', border: 'none',
    color: '#6b7a9a', cursor: 'pointer', fontSize: '13px',
  },
  queueStats: { display: 'flex', gap: '12px', marginBottom: '16px' },
  queueStat: {
    flex: 1, background: '#0f1117', borderRadius: '8px',
    padding: '12px', textAlign: 'center',
  },
  queueStatNum: { fontSize: '20px', fontWeight: '600', color: '#fff' },
  queueStatLabel: { fontSize: '11px', color: '#6b7a9a', marginTop: '4px' },
  waitingList: { maxHeight: '200px', overflowY: 'auto' },
  waitingItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px', borderRadius: '6px',
    background: '#ffffff05', marginBottom: '6px',
  },
  waitPos: { fontSize: '12px', color: '#6b7a9a', minWidth: '28px' },
  waitToken: { fontSize: '13px', color: '#fff', flex: 1 },
  waitTime: { fontSize: '12px', color: '#6b7a9a' },
  emptyText: { color: '#6b7a9a', fontSize: '14px', textAlign: 'center' },
};

export default DoctorDashboard;