import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQueueStatus } from '../../api/queue';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../../utils/constants';

const departments = [
  { id: 1, name: 'General' },
  { id: 2, name: 'Eye' },
  { id: 3, name: 'Surgery' },
  { id: 4, name: 'Ortho' },
];

const QueueStatus = () => {
  const { departmentId } = useParams();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();
  const stompClient = useRef(null);

  useEffect(() => {
    fetchQueueStatus();
    connectWebSocket();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [departmentId]);

  const fetchQueueStatus = async () => {
    try {
      const response = await getQueueStatus(departmentId);
      if (response.success) setQueueData(response.data);
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      onConnect: () => {
        setConnected(true);
        client.subscribe(
          `/topic/queue/${departmentId}`,
          (message) => {
            const data = JSON.parse(message.body);
            setQueueData(data);
          }
        );
      },
      onDisconnect: () => setConnected(false),
    });
    client.activate();
    stompClient.current = client;
  };

  if (loading) return <Loader message="Loading queue..." />;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/patient')}>
          ← Back
        </button>

        {/* Department Tabs */}
        <div style={styles.deptTabs}>
          {departments.map((dept) => (
            <button
              key={dept.id}
              style={{
                ...styles.deptTab,
                ...(Number(departmentId) === dept.id ? styles.deptTabActive : {}),
              }}
              onClick={() => navigate(`/patient/queue/${dept.id}`)}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {queueData ? queueData.departmentName : ''} — Live Queue
          </h2>
          <div style={styles.liveBadge}>
            <span style={{
              ...styles.liveDot,
              background: connected ? '#1D9E75' : '#D85A30',
            }}></span>
            {connected ? 'Live' : 'Connecting...'}
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {queueData ? queueData.totalWaiting : 0}
            </div>
            <div style={styles.statLabel}>In Queue</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {queueData ? queueData.avgWaitMinutes : 0} min
            </div>
            <div style={styles.statLabel}>Avg Wait</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {queueData ? queueData.currentServingToken : 'None'}
            </div>
            <div style={styles.statLabel}>Now Serving</div>
          </div>
        </div>

        {/* Queue List */}
        <div style={styles.queueCard}>
          <h3 style={styles.queueTitle}>Waiting Patients</h3>
          {queueData && queueData.waitingTokens && queueData.waitingTokens.length === 0 ? (
            <div style={styles.emptyQueue}>
              <p style={styles.emptyText}>No patients in queue right now!</p>
            </div>
          ) : (
            queueData && queueData.waitingTokens && queueData.waitingTokens.map((token, index) => (
              <div key={index} style={styles.tokenRow}>
                <div style={styles.position}>#{token.position}</div>
                <div style={styles.tokenInfo}>
                  <div style={styles.tokenNum}>{token.tokenNumber}</div>
                  <div style={styles.waitTime}>{token.estimatedWait}</div>
                </div>
                <div style={styles.waitBadge}>Waiting</div>
              </div>
            ))
          )}
        </div>

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
  deptTabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  deptTab: {
    padding: '8px 16px', borderRadius: '20px',
    border: '0.5px solid #2a3148', background: 'transparent',
    color: '#6b7a9a', cursor: 'pointer', fontSize: '13px',
  },
  deptTabActive: {
    background: '#1D9E7520', color: '#1D9E75',
    border: '0.5px solid #1D9E75',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px',
  },
  title: { fontSize: '20px', fontWeight: '600', color: '#fff', margin: 0 },
  liveBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '12px', color: '#1D9E75',
    background: '#1D9E7520', padding: '4px 12px', borderRadius: '20px',
  },
  liveDot: { width: '7px', height: '7px', borderRadius: '50%' },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px', marginBottom: '20px',
  },
  statCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '10px', padding: '16px', textAlign: 'center',
  },
  statNum: { fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '4px' },
  statLabel: { fontSize: '11px', color: '#6b7a9a' },
  queueCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px',
  },
  queueTitle: { fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 16px' },
  emptyQueue: { textAlign: 'center', padding: '30px' },
  emptyText: { color: '#6b7a9a', fontSize: '14px' },
  tokenRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px', borderRadius: '8px',
    background: '#ffffff05', marginBottom: '8px',
  },
  position: { fontSize: '14px', fontWeight: '600', color: '#6b7a9a', minWidth: '32px' },
  tokenInfo: { flex: 1 },
  tokenNum: { fontSize: '14px', fontWeight: '600', color: '#fff' },
  waitTime: { fontSize: '12px', color: '#6b7a9a' },
  waitBadge: {
    fontSize: '11px', background: '#378ADD20',
    color: '#378ADD', padding: '3px 10px', borderRadius: '20px',
  },
};

export default QueueStatus;