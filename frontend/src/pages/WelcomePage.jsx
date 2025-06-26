import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const WelcomePage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/tracker');
    }
  }, [userInfo, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
      <h1>Welcome to Water Tracker!</h1>
      <h2 style={{ color: '#007bff', marginBottom: '1.5rem' }}>About This Website</h2>
      <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.5rem' }}>
        <b>Water Tracker</b> is your personal hydration assistant. Easily log your daily water intake, set custom hydration goals, and track your progress over time. Staying hydrated is essential for your health, and this app helps you build healthy habits with reminders, visual progress, and daily stats.
      </p>
      <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto 1.5rem auto', fontSize: '1.05rem', color: '#444' }}>
        <li>✔️ Set and edit your daily water intake goal</li>
        <li>✔️ Log each drink with a single click</li>
        <li>✔️ Visualize your progress with a dynamic tracker</li>
        <li>✔️ View your hydration history</li>
        <li>✔️ Secure account system to save your data</li>
      </ul>
      <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '2rem' }}>
        Sign up or log in to start tracking your hydration journey!
      </p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login" style={{ marginRight: '1rem', fontWeight: 'bold', color: 'red' }}>Sign In</Link>
        <Link to="/register" style={{ fontWeight: 'bold', color: 'red' }}>Register</Link>
      </div>
    </div>
  );
};

export default WelcomePage; 