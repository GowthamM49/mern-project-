import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { userInfo, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-title">
                <Link to="/">Water Tracker</Link>
            </div>
            <nav className="header-nav">
                {userInfo ? (
                    <div className="header-user-info">
                        <span>Welcome, {userInfo.name}</span>
                        <button onClick={logoutHandler} className="nav-button">
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">
                            Sign In
                        </Link>
                        <Link to="/register" className="nav-link-button">
                            Sign Up
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header; 