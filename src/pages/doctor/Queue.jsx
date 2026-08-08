import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllDoctors } from '../../api/doctor';
import { getQueueStatus } from '../../api/queue';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../../utils/constants';

const Queue = () => {
  const { user } = useAuth();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [deptId, setDeptId] = useState(null);
  const stompClient = useRef(null);

  useEffect(() => {
    fetchDoctorDept();
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const fetchDoctorDept = async () => {
    try {
      const response = await getAllDoctors();
      if (response.success) {
        const myDoctor = response.data.find(
          (d) => d.user && d.user.phone === (user ? user.phone : '')
        );
        if (myDoctor && myDoctor.department) {
          const id = myDoctor.department.id;
          setDeptId(id);
          fetchQueue(id);
          connectWebSocket(id);
        }
      }
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueue = async (id) => {
    try {
      const response = await getQueueStatus(id);
      if (response.success) setQueueData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWebSocket = (id) => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/queue/${id}`, (message) => {
          setQueueData(JSON.parse(message.body));
        });
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

        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <div style={styles.statNum}>
              {queueData ? queueData.totalWaiting : 0}
            </div>
            <div style={styles.statLabel}>Waiting</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNum}>
              {queueData ? queueData.avgWaitMinutes : 0} min
            </div>
            <div style={styles.statLabel}>Avg Wait</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNum}>
              {queueData ? queueData.currentServingToken : 'None'}
            </div>
            <div style={styles.statLabel}>Now Serving</div>
          </div>
        </div>

        <div style={styles.queueCard}>
          <h3 style={styles.cardTitle}>Waiting Patients</h3>
          {queueData && queueData.waitingTokens && queueData.waitingTokens.length === 0 ? (
            <p style={styles.emptyText}>Queue is empty!</p>
          ) : (
            queueData && queueData.waitingTokens && queueData.waitingTokens.map((token, index) => (
              <div key={index} style={styles.tokenRow}>
                <span style={styles.pos}>#{token.position}</span>
                <span style={styles.tokenNum}>{token.tokenNumber}</span>
                <span style={styles.waitTime}>{token.estimatedWait}</span>
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
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px',
  },
  title: { fontSize: '20px', fontWeight: '600', color: '#fff', margin: 0 },
  liveBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '12px', color: '#1D9E75',
    background: '#1D9E7520', padding: '4px 12px', borderRadius: '20px',
  },
  liveDot: { width: '7px', height: '7px', borderRadius: '50%' },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
    gap: '12px', marginBottom: '20px',
  },
  stat: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '10px', padding: '16px', textAlign: 'center',
  },
  statNum: { fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '4px' },
  statLabel: { fontSize: '11px', color: '#6b7a9a' },
  queueCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px',
  },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 16px' },
  emptyText: { color: '#6b7a9a', fontSize: '14px', textAlign: 'center' },
  tokenRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px', borderRadius: '8px',
    background: '#ffffff05', marginBottom: '8px',
  },
  pos: { fontSize: '12px', color: '#6b7a9a', minWidth: '28px' },
  tokenNum: { fontSize: '14px', fontWeight: '600', color: '#fff', flex: 1 },
  waitTime: { fontSize: '12px', color: '#6b7a9a' },
};

export default Queue;