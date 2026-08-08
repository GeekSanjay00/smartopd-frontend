import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDepartments, createDepartment } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response.success) setDepartments(response.data);
    } catch (err) {
      setError('Failed to fetch departments!');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const response = await createDepartment(name, description);
      if (response.success) {
        setSuccess('Department created successfully!');
        setName('');
        setDescription('');
        setShowForm(false);
        fetchDepartments();
      }
    } catch (err) {
      const msg = err.response && err.response.data
        ? err.response.data.message
        : 'Failed to create department!';
      setError(msg);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader message="Loading departments..." />;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>
          ← Back
        </button>

        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Departments</h2>
            <p style={styles.subtitle}>{departments.length} departments total</p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Department'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add New Department</h3>
            <form onSubmit={handleCreate}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Department Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Cardiology"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Department description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                style={creating ? styles.btnDisabled : styles.btn}
                type="submit"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Department'}
              </button>
            </form>
          </div>
        )}

        <div style={styles.deptList}>
          {departments.map((dept) => (
            <div key={dept.id} style={styles.deptCard}>
              <div style={styles.deptIcon}>🏥</div>
              <div style={styles.deptInfo}>
                <h3 style={styles.deptName}>{dept.name}</h3>
                <p style={styles.deptDesc}>{dept.description || 'No description'}</p>
                <div style={styles.deptStats}>
                  <span style={styles.deptStat}>
                    ⏱️ Avg wait: {dept.avgWaitMinutes} min
                  </span>
                  <span style={{
                    ...styles.activeBadge,
                    background: dept.active ? '#1D9E7520' : '#D85A3020',
                    color: dept.active ? '#1D9E75' : '#D85A30',
                  }}>
                    {dept.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0f1117' },
  content: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  backBtn: {
    background: 'transparent', border: 'none',
    color: '#6b7a9a', cursor: 'pointer',
    fontSize: '14px', marginBottom: '20px', padding: 0,
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px',
  },
  title: { fontSize: '22px', fontWeight: '600', color: '#fff', margin: '0 0 4px' },
  subtitle: { fontSize: '13px', color: '#6b7a9a', margin: 0 },
  addBtn: {
    padding: '8px 16px', borderRadius: '8px',
    background: '#1D9E75', color: '#fff',
    fontSize: '13px', border: 'none', cursor: 'pointer',
  },
  error: {
    background: '#D85A3020', border: '0.5px solid #D85A30',
    borderRadius: '8px', padding: '10px 14px',
    color: '#D85A30', fontSize: '13px', marginBottom: '16px',
  },
  successMsg: {
    background: '#1D9E7520', border: '0.5px solid #1D9E75',
    borderRadius: '8px', padding: '10px 14px',
    color: '#1D9E75', fontSize: '13px', marginBottom: '16px',
  },
  formCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '24px', marginBottom: '24px',
  },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 16px' },
  formGroup: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '12px', color: '#6b7a9a', marginBottom: '6px' },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '0.5px solid #2a3148', background: '#0f1117',
    color: '#fff', fontSize: '14px', boxSizing: 'border-box',
  },
  btn: {
    padding: '10px 20px', borderRadius: '8px',
    background: '#1D9E75', color: '#fff',
    fontSize: '14px', border: 'none', cursor: 'pointer',
  },
  btnDisabled: {
    padding: '10px 20px', borderRadius: '8px',
    background: '#1D9E7540', color: '#fff',
    fontSize: '14px', border: 'none', cursor: 'not-allowed',
  },
  deptList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  deptCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  deptIcon: { fontSize: '32px', flexShrink: 0 },
  deptInfo: { flex: 1 },
  deptName: { fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 4px' },
  deptDesc: { fontSize: '13px', color: '#6b7a9a', margin: '0 0 10px' },
  deptStats: { display: 'flex', alignItems: 'center', gap: '12px' },
  deptStat: { fontSize: '12px', color: '#6b7a9a' },
  activeBadge: {
    fontSize: '11px', padding: '2px 8px',
    borderRadius: '20px', fontWeight: '500',
  },
};

export default Departments;