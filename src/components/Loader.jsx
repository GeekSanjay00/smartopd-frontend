import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#0f1117',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #2a3148',
    borderTop: '3px solid #1D9E75',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  message: {
    color: '#6b7a9a',
    fontSize: '14px',
  },
};

export default Loader;