import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getOverallStats,
  getAvgWaitTime,
  getTodayTokens,
  getPeakHours,
} from '../../api/analytics';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [waitTime, setWaitTime] = useState({});
  const [todayTokens, setTodayTokens] = useState({});
  const [peakHours, setPeakHours] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      const [statsRes, waitRes, tokensRes, peakRes] = await Promise.all([
        getOverallStats(),
        getAvgWaitTime(),
        getTodayTokens(),
        getPeakHours(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (waitRes.success) setWaitTime(waitRes.data);
      if (tokensRes.success) setTodayTokens(tokensRes.data);
      if (peakRes.success) setPeakHours(peakRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMaxValue = (obj) => {
    const values = Object.values(obj);
    return Math.max(...values, 1);
  };

  if (loading) return <Loader message="Loading analytics..." />;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>
          ← Back
        </button>

        <h2 style={styles.title}>Analytics</h2>
        <p style={styles.subtitle}>Hospital performance overview</p>

        {/* Overall Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{stats ? stats.totalTokensToday : 0}</div>
            <div style={styles.statLabel}>Total Tokens Today</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{stats ? stats.totalDone : 0}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{stats ? stats.totalWaiting : 0}</div>
            <div style={styles.statLabel}>Waiting Now</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{stats ? stats.avgWaitMinutes : 0} min</div>
            <div style={styles.statLabel}>Avg Wait Time</div>
          </div>
        </div>

        <div style={styles.chartsGrid}>

          {/* Avg Wait Time */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Avg Wait Time by Department</h3>
            {Object.entries(waitTime).map(([dept, minutes]) => (
              <div key={dept} style={styles.barRow}>
                <span style={styles.barLabel}>{dept}</span>
                <div style={styles.barTrack}>
                  <div style={{
                    ...styles.barFill,
                    width: `${(minutes / getMaxValue(waitTime)) * 100}%`,
                    background: '#378ADD',
                  }}></div>
                </div>
                <span style={styles.barVal}>{minutes} min</span>
              </div>
            ))}
            {Object.keys(waitTime).length === 0 && (
              <p style={styles.emptyText}>No data available</p>
            )}
          </div>

          {/* Today Tokens */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Tokens Today by Department</h3>
            {Object.entries(todayTokens).map(([dept, count]) => (
              <div key={dept} style={styles.barRow}>
                <span style={styles.barLabel}>{dept}</span>
                <div style={styles.barTrack}>
                  <div style={{
                    ...styles.barFill,
                    width: `${(count / getMaxValue(todayTokens)) * 100}%`,
                    background: '#1D9E75',
                  }}></div>
                </div>
                <span style={styles.barVal}>{count}</span>
              </div>
            ))}
            {Object.keys(todayTokens).length === 0 && (
              <p style={styles.emptyText}>No data available</p>
            )}
          </div>

          {/* Peak Hours */}
          <div style={{ ...styles.chartCard, gridColumn: '1 / -1' }}>
            <h3 style={styles.chartTitle}>Peak Hours</h3>
            {Object.entries(peakHours)
              .filter(([, count]) => count > 0)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([hour, count]) => (
                <div key={hour} style={styles.barRow}>
                  <span style={styles.barLabel}>{hour}:00</span>
                  <div style={styles.barTrack}>
                    <div style={{
                      ...styles.barFill,
                      width: `${(count / getMaxValue(peakHours)) * 100}%`,
                      background: '#BA7517',
                    }}></div>
                  </div>
                  <span style={styles.barVal}>{count}</span>
                </div>
              ))}
            {Object.values(peakHours).every((v) => v === 0) && (
              <p style={styles.emptyText}>No token data for today</p>
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
  backBtn: {
    background: 'transparent', border: 'none',
    color: '#6b7a9a', cursor: 'pointer',
    fontSize: '14px', marginBottom: '20px', padding: 0,
  },
  title: { fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 6px' },
  subtitle: { fontSize: '13px', color: '#6b7a9a', margin: '0 0 24px' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px', marginBottom: '24px',
  },
  statCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px', textAlign: 'center',
  },
  statNum: { fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '6px' },
  statLabel: { fontSize: '12px', color: '#6b7a9a' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  chartCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px',
  },
  chartTitle: { fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 16px' },
  barRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  barLabel: { fontSize: '12px', color: '#6b7a9a', minWidth: '65px' },
  barTrack: {
    flex: 1, height: '8px', background: '#2a3148',
    borderRadius: '4px', overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s' },
  barVal: { fontSize: '12px', color: '#6b7a9a', minWidth: '40px', textAlign: 'right' },
  emptyText: { color: '#6b7a9a', fontSize: '13px', textAlign: 'center', padding: '20px 0' },
};

export default Analytics;