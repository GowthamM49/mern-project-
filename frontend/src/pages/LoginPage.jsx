import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import FormContainer from '../components/FormContainer';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('error');
    const [loading, setLoading] = useState(false);

    const { userInfo, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            setMessageType('success');
            // Clear the location state to prevent the message from re-appearing
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post(
                'http://localhost:5000/api/users/login',
                { email, password },
                config
            );
            login(data);
            navigate('/');
        } catch (error) {
            setMessageType('error');
            setMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            {loading && <LoadingSpinner />}
            <h1>Sign In</h1>
            {message && (
                <div 
                    style={{ 
                        color: messageType === 'success' ? 'green' : 'red', 
                        textAlign: 'center', 
                        marginBottom: '1rem' 
                    }}
                >
                    {message}
                </div>
            )}
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>
                <button type="submit" className="form-button">Sign In</button>
            </form>

            <div className="form-link">
                New Customer? <Link to="/register">Register</Link>
            </div>
        </FormContainer>
    );
};

export default LoginPage; 