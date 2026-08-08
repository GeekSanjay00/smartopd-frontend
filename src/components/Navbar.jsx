import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoDot}></span>
        SmartOPD
      </div>
      <div style={styles.userInfo}>
        {user && (
          <span style={styles.userName}>
            {user.name} ({user.role})
          </span>
        )}
        {user && (
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#161b27',
    borderBottom: '0.5px solid #2a3148',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#1D9E75',
    display: 'inline-block',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    fontSize: '13px',
    color: '#6b7a9a',
  },
  logoutBtn: {
    fontSize: '12px',
    padding: '6px 14px',
    borderRadius: '6px',
    background: 'transparent',
    border: '0.5px solid #2a3148',
    color: '#6b7a9a',
    cursor: 'pointer',
  },
};

export default Navbar;