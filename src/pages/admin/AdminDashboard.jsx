import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOverallStats } from '../../api/analytics';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getOverallStats();
      if (response.success) setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>

        {/* Welcome */}
        <div style={styles.welcome}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome, {user ? user.name : ''}! Manage SmartOPD system here.
          </p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎫</div>
            <div style={styles.statNum}>{stats ? stats.totalTokensToday : 0}</div>
            <div style={styles.statLabel}>Tokens Today</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statNum}>{stats ? stats.totalWaiting : 0}</div>
            <div style={styles.statLabel}>Waiting Now</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statNum}>{stats ? stats.totalDone : 0}</div>
            <div style={styles.statLabel}>Done Today</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏥</div>
            <div style={styles.statNum}>{stats ? stats.totalDepartments : 0}</div>
            <div style={styles.statLabel}>Departments</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏱️</div>
            <div style={styles.statNum}>{stats ? stats.avgWaitMinutes : 0} min</div>
            <div style={styles.statLabel}>Avg Wait</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionGrid}>
          <div style={styles.actionCard} onClick={() => navigate('/admin/departments')}>
            <div style={styles.actionIcon}>🏥</div>
            <h3 style={styles.actionTitle}>Departments</h3>
            <p style={styles.actionDesc}>Manage hospital departments</p>
            <button style={styles.actionBtn}>Manage →</button>
          </div>

          <div style={styles.actionCard} onClick={() => navigate('/admin/doctors')}>
            <div style={styles.actionIcon}>👨‍⚕️</div>
            <h3 style={styles.actionTitle}>Doctors</h3>
            <p style={styles.actionDesc}>Add and manage doctors</p>
            <button style={styles.actionBtn}>Manage →</button>
          </div>

          <div style={styles.actionCard} onClick={() => navigate('/admin/analytics')}>
            <div style={styles.actionIcon}>📊</div>
            <h3 style={styles.actionTitle}>Analytics</h3>
            <p style={styles.actionDesc}>View wait times and peak hours</p>
            <button style={styles.actionBtn}>View →</button>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0f1117' },
  content: { padding: '24px', maxWidth: '1000px', margin: '0 auto' },
  welcome: { marginBottom: '28px' },
  title: { fontSize: '24px', fontWeight: '600', color: '#fff', margin: '0 0 6px' },
  subtitle: { fontSize: '13px', color: '#6b7a9a', margin: 0 },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px', marginBottom: '32px',
  },
  statCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px', textAlign: 'center',
  },
  statIcon: { fontSize: '24px', marginBottom: '8px' },
  statNum: { fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#6b7a9a' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 16px' },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  actionCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '24px', cursor: 'pointer',
  },
  actionIcon: { fontSize: '32px', marginBottom: '12px' },
  actionTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 6px' },
  actionDesc: { fontSize: '13px', color: '#6b7a9a', margin: '0 0 16px' },
  actionBtn: {
    background: 'transparent', border: 'none',
    color: '#1D9E75', fontSize: '13px',
    cursor: 'pointer', padding: 0, fontWeight: '500',
  },
};

export default AdminDashboard;