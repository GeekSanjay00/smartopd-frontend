import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTokens, cancelToken } from '../../api/token';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTokens();
  }, []);

  const fetchMyTokens = async () => {
    try {
      const response = await getMyTokens();
      if (response.success) setTokens(response.data);
    } catch (err) {
      setError('Failed to fetch tokens!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (tokenId) => {
    if (!window.confirm('Cancel this token?')) return;
    try {
      await cancelToken(tokenId);
      fetchMyTokens();
    } catch (err) {
      const msg = err.response && err.response.data
        ? err.response.data.message
        : 'Cancel failed!';
      setError(msg);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      WAITING: { background: '#378ADD20', color: '#378ADD' },
      SERVING: { background: '#1D9E7520', color: '#1D9E75' },
      DONE: { background: '#ffffff10', color: '#6b7a9a' },
      SKIPPED: { background: '#BA751720', color: '#BA7517' },
      CANCELLED: { background: '#D85A3020', color: '#D85A30' },
    };
    return map[status] || map.WAITING;
  };

  if (loading) return <Loader message="Loading your tokens..." />;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/patient')}>
          ← Back
        </button>
        <h2 style={styles.title}>My Tokens</h2>
        <p style={styles.subtitle}>All your booked tokens</p>

        {error && <div style={styles.error}>{error}</div>}

        {tokens.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎫</div>
            <h3 style={styles.emptyTitle}>No tokens yet!</h3>
            <p style={styles.emptyDesc}>Book your first OPD token</p>
            <button
              style={styles.bookBtn}
              onClick={() => navigate('/patient/book')}
            >
              Book Token
            </button>
          </div>
        ) : (
          <div style={styles.tokenList}>
            {tokens.map((token) => (
              <div key={token.id} style={styles.tokenCard}>
                <div style={styles.tokenHeader}>
                  <span style={styles.tokenNumber}>{token.tokenNumber}</span>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(token.status) }}>
                    {token.status}
                  </span>
                </div>
                <div style={styles.tokenInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Department</span>
                    <span style={styles.infoValue}>
                      {token.department ? token.department.name : 'N/A'}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Position</span>
                    <span style={styles.infoValue}>#{token.position}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Booked At</span>
                    <span style={styles.infoValue}>
                      {new Date(token.bookedAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {token.servedAt && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Served At</span>
                      <span style={styles.infoValue}>
                        {new Date(token.servedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
                {token.status === 'WAITING' && (
                  <button
                    style={styles.cancelBtn}
                    onClick={() => handleCancel(token.id)}
                  >
                    Cancel Token
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
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
  emptyState: {
    textAlign: 'center', padding: '60px 20px',
    background: '#161b27', borderRadius: '12px',
    border: '0.5px solid #2a3148',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '18px', color: '#fff', margin: '0 0 8px' },
  emptyDesc: { fontSize: '14px', color: '#6b7a9a', margin: '0 0 20px' },
  bookBtn: {
    padding: '10px 24px', borderRadius: '8px',
    background: '#1D9E75', color: '#fff',
    fontSize: '14px', border: 'none', cursor: 'pointer',
  },
  tokenList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  tokenCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px',
  },
  tokenHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px',
  },
  tokenNumber: { fontSize: '20px', fontWeight: '700', color: '#fff' },
  statusBadge: {
    fontSize: '11px', padding: '4px 10px',
    borderRadius: '20px', fontWeight: '500',
  },
  tokenInfo: { marginBottom: '16px' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '6px 0', borderBottom: '0.5px solid #2a3148',
  },
  infoLabel: { fontSize: '12px', color: '#6b7a9a' },
  infoValue: { fontSize: '12px', color: '#fff', fontWeight: '500' },
  cancelBtn: {
    width: '100%', padding: '8px', borderRadius: '8px',
    background: '#D85A3020', border: '0.5px solid #D85A30',
    color: '#D85A30', fontSize: '13px', cursor: 'pointer',
  },
};

export default MyTokens;