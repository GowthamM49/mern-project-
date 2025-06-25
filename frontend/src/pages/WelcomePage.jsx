import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => (
  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
    <h1>Welcome to Water Tracker!</h1>
    <p>Track your daily water intake and stay healthy.</p>
    <div style={{ marginTop: '2rem' }}>
      <Link to="/login" style={{ marginRight: '1rem', fontWeight: 'bold', color: '#007bff' }}>Sign In</Link>
      <Link to="/register" style={{ fontWeight: 'bold', color: '#007bff' }}>Register</Link>
    </div>
  </div>
);

export default WelcomePage; 