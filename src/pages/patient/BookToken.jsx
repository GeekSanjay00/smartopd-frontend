import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookToken } from '../../api/token';
import Navbar from '../../components/Navbar';

const departments = [
  { id: 1, name: 'General', icon: '🏥', desc: 'General medicine and checkups' },
  { id: 2, name: 'Eye', icon: '👁️', desc: 'Eye related problems' },
  { id: 3, name: 'Surgery', icon: '🔬', desc: 'Surgical consultations' },
  { id: 4, name: 'Ortho', icon: '🦴', desc: 'Bone and joint problems' },
];

const BookToken = () => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedToken, setBookedToken] = useState(null);
  const navigate = useNavigate();

  const handleBookToken = async () => {
    if (!selectedDept) {
      setError('Please select a department!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await bookToken(selectedDept);
      if (response.success) {
        setBookedToken(response.data);
      }
    } catch (err) {
      const msg = err.response && err.response.data
        ? err.response.data.message
        : 'Booking failed!';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (bookedToken) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.content}>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Token Booked!</h2>
            <div style={styles.tokenNumber}>{bookedToken.tokenNumber}</div>
            <div style={styles.tokenDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Department</span>
                <span style={styles.detailValue}>{bookedToken.departmentName}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Position</span>
                <span style={styles.detailValue}>#{bookedToken.position}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Est. Wait</span>
                <span style={styles.detailValue}>{bookedToken.estimatedWait}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Status</span>
                <span style={styles.statusBadge}>{bookedToken.status}</span>
              </div>
            </div>
            <p style={styles.smsNote}>
              📱 SMS alert will be sent when your turn is near!
            </p>
            <div style={styles.successBtns}>
              <button
                style={styles.queueBtn}
                onClick={() => navigate(`/patient/queue/${selectedDept}`)}
              >
                View Live Queue
              </button>
              <button
                style={styles.dashboardBtn}
                onClick={() => navigate('/patient')}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/patient')}>
          ← Back
        </button>
        <h2 style={styles.title}>Book OPD Token</h2>
        <p style={styles.subtitle}>Select a department to book your token</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.deptGrid}>
          {departments.map((dept) => (
            <div
              key={dept.id}
              style={{
                ...styles.deptCard,
                ...(selectedDept === dept.id ? styles.deptCardSelected : {}),
              }}
              onClick={() => setSelectedDept(dept.id)}
            >
              <div style={styles.deptIcon}>{dept.icon}</div>
              <h3 style={styles.deptName}>{dept.name}</h3>
              <p style={styles.deptDesc}>{dept.desc}</p>
              {selectedDept === dept.id && (
                <span style={styles.checkmark}>✓ Selected</span>
              )}
            </div>
          ))}
        </div>

        <button
          style={loading || !selectedDept ? styles.btnDisabled : styles.btn}
          onClick={handleBookToken}
          disabled={loading || !selectedDept}
        >
          {loading ? 'Booking...' : 'Book Token'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0f1117' },
  content: { padding: '24px', maxWidth: '800px', margin: '0 auto' },
  backBtn: {
    background: 'transparent', border: 'none',
    color: '#6b7a9a', cursor: 'pointer',
    fontSize: '14px', marginBottom: '20px', padding: 0,
  },
  title: { fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 8px' },
  subtitle: { fontSize: '13px', color: '#6b7a9a', margin: '0 0 24px' },
  error: {
    background: '#D85A3020', border: '0.5px solid #D85A30',
    borderRadius: '8px', padding: '10px 14px',
    color: '#D85A30', fontSize: '13px', marginBottom: '16px',
  },
  deptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px', marginBottom: '24px',
  },
  deptCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px',
    cursor: 'pointer', textAlign: 'center',
  },
  deptCardSelected: {
    border: '0.5px solid #1D9E75',
    background: '#1D9E7510',
  },
  deptIcon: { fontSize: '32px', marginBottom: '10px' },
  deptName: { fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 6px' },
  deptDesc: { fontSize: '12px', color: '#6b7a9a', margin: '0 0 10px' },
  checkmark: { fontSize: '12px', color: '#1D9E75', fontWeight: '500' },
  btn: {
    width: '100%', padding: '12px', borderRadius: '8px',
    background: '#1D9E75', color: '#fff',
    fontSize: '15px', fontWeight: '500', border: 'none', cursor: 'pointer',
  },
  btnDisabled: {
    width: '100%', padding: '12px', borderRadius: '8px',
    background: '#1D9E7540', color: '#fff',
    fontSize: '15px', fontWeight: '500', border: 'none', cursor: 'not-allowed',
  },
  successCard: {
    background: '#161b27', border: '0.5px solid #1D9E75',
    borderRadius: '16px', padding: '40px',
    textAlign: 'center', maxWidth: '400px', margin: '40px auto',
  },
  successIcon: { fontSize: '48px', marginBottom: '16px' },
  successTitle: { fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 20px' },
  tokenNumber: {
    fontSize: '36px', fontWeight: '700', color: '#1D9E75',
    margin: '0 0 24px', letterSpacing: '2px',
  },
  tokenDetails: {
    background: '#0f1117', borderRadius: '10px',
    padding: '16px', marginBottom: '16px',
  },
  detailRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '0.5px solid #2a3148',
  },
  detailLabel: { fontSize: '13px', color: '#6b7a9a' },
  detailValue: { fontSize: '13px', color: '#fff', fontWeight: '500' },
  statusBadge: {
    fontSize: '11px', background: '#1D9E7520',
    color: '#1D9E75', padding: '2px 8px', borderRadius: '20px',
  },
  smsNote: { fontSize: '13px', color: '#6b7a9a', margin: '0 0 20px' },
  successBtns: { display: 'flex', gap: '10px' },
  queueBtn: {
    flex: 1, padding: '10px', borderRadius: '8px',
    background: '#1D9E75', color: '#fff',
    fontSize: '13px', border: 'none', cursor: 'pointer',
  },
  dashboardBtn: {
    flex: 1, padding: '10px', borderRadius: '8px',
    background: 'transparent', color: '#6b7a9a',
    fontSize: '13px', border: '0.5px solid #2a3148', cursor: 'pointer',
  },
};

export default BookToken;