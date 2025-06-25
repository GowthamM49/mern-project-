import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import WaterTracker from './components/WaterTracker';

function App() {
  return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="" element={<PrivateRoute />}>
                        <Route path="/tracker" element={<WaterTracker />} />
                    </Route>
                </Routes>
            </main>
        </Router>
  );
}

export default App;
