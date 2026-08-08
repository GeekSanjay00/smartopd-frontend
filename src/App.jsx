import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookToken from './pages/patient/BookToken';
import MyTokens from './pages/patient/MyTokens';
import QueueStatus from './pages/patient/QueueStatus';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import Queue from './pages/doctor/Queue';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Departments from './pages/admin/Departments';
import Doctors from './pages/admin/Doctors';
import Analytics from './pages/admin/Analytics';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient routes */}
          <Route path="/patient" element={
            <PrivateRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </PrivateRoute>
          } />
          <Route path="/patient/book" element={
            <PrivateRoute allowedRoles={['PATIENT']}>
              <BookToken />
            </PrivateRoute>
          } />
          <Route path="/patient/tokens" element={
            <PrivateRoute allowedRoles={['PATIENT']}>
              <MyTokens />
            </PrivateRoute>
          } />
          <Route path="/patient/queue/:departmentId" element={
            <PrivateRoute allowedRoles={['PATIENT']}>
              <QueueStatus />
            </PrivateRoute>
          } />

          {/* Doctor routes */}
          <Route path="/doctor" element={
            <PrivateRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboard />
            </PrivateRoute>
          } />
          <Route path="/doctor/queue" element={
            <PrivateRoute allowedRoles={['DOCTOR']}>
              <Queue />
            </PrivateRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/departments" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <Departments />
            </PrivateRoute>
          } />
          <Route path="/admin/doctors" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <Doctors />
            </PrivateRoute>
          } />
          <Route path="/admin/analytics" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <Analytics />
            </PrivateRoute>
          } />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={
            <div style={{
              minHeight: '100vh', background: '#0f1117',
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', color: '#fff',
              flexDirection: 'column', gap: '16px',
            }}>
              <h2>🚫 Unauthorized!</h2>
              <p style={{ color: '#6b7a9a' }}>
                You don't have permission to view this page.
              </p>
            </div>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh', background: '#0f1117',
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', color: '#fff',
              flexDirection: 'column', gap: '16px',
            }}>
              <h2>404 — Page Not Found</h2>
              <p style={{ color: '#6b7a9a' }}>
                The page you're looking for doesn't exist.
              </p>
            </div>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;