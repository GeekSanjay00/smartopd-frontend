import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDepartments, createDoctor } from '../../api/admin';
import { getAllDoctors } from '../../api/doctor';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', specialization: '',
    departmentId: '', phone: '', password: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, deptsRes] = await Promise.all([
        getAllDoctors(),
        getAllDepartments(),
      ]);
      if (doctorsRes.success) setDoctors(doctorsRes.data);
      if (deptsRes.success) setDepartments(deptsRes.data);
    } catch (err) {
      setError('Failed to fetch data!');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const response = await createDoctor(
        form.name, form.specialization,
        form.departmentId, form.phone, form.password
      );
      if (response.success) {
        setSuccess('Doctor created successfully!');
        setForm({ name: '', specialization: '', departmentId: '', phone: '', password: '' });
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      const msg = err.response && err.response.data
        ? err.response.data.message
        : 'Failed to create doctor!';
      setError(msg);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader message="Loading doctors..." />;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>
          ← Back
        </button>

        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Doctors</h2>
            <p style={styles.subtitle}>{doctors.length} doctors total</p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Doctor'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add New Doctor</h3>
            <form onSubmit={handleCreate}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Doctor Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Dr. Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Specialization</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g. General Medicine"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Department</label>
                  <select
                    style={styles.input}
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    style={styles.input}
                    type="tel"
                    placeholder="10 digit phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button
                style={creating ? styles.btnDisabled : styles.btn}
                type="submit"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Doctor'}
              </button>
            </form>
          </div>
        )}

        <div style={styles.doctorList}>
          {doctors.map((doctor) => (
            <div key={doctor.id} style={styles.doctorCard}>
              <div style={styles.doctorAvatar}>👨‍⚕️</div>
              <div style={styles.doctorInfo}>
                <h3 style={styles.doctorName}>{doctor.name}</h3>
                <p style={styles.doctorSpec}>{doctor.specialization}</p>
                <p style={styles.doctorDept}>
                  🏥 {doctor.department ? doctor.department.name : ''} Department
                </p>
              </div>
              <div style={styles.doctorStatus}>
                <span style={{
                  ...styles.statusBadge,
                  background: doctor.available ? '#1D9E7520' : '#D85A3020',
                  color: doctor.available ? '#1D9E75' : '#D85A30',
                }}>
                  {doctor.available ? '✅ Available' : '❌ Busy'}
                </span>
                <p style={styles.patientsToday}>
                  {doctor.totalPatientsToday} patients today
                </p>
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
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
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
  doctorList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  doctorCard: {
    background: '#161b27', border: '0.5px solid #2a3148',
    borderRadius: '12px', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  doctorAvatar: { fontSize: '36px', flexShrink: 0 },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 4px' },
  doctorSpec: { fontSize: '13px', color: '#6b7a9a', margin: '0 0 4px' },
  doctorDept: { fontSize: '12px', color: '#6b7a9a', margin: 0 },
  doctorStatus: { textAlign: 'right' },
  statusBadge: {
    fontSize: '12px', padding: '4px 10px',
    borderRadius: '20px', fontWeight: '500',
    display: 'inline-block', marginBottom: '6px',
  },
  patientsToday: { fontSize: '12px', color: '#6b7a9a', margin: 0 },
};

export default Doctors; 