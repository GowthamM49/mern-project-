import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import FormContainer from '../components/FormContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_BASE_URL } from '../api';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate('/tracker');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setLoading(true);
            setMessage(null);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                await axios.post(
                    `${API_BASE_URL}/api/users`,
                    { name, email, password },
                    config
                );
                navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
            } catch (error) {
                setMessage(error.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <FormContainer>
            {loading && <LoadingSpinner />}
            <h1>Sign Up</h1>
            {message && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                    />
                </div>
                <button type="submit" className="form-button">Register</button>
            </form>

            <div className="form-link">
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </FormContainer>
    );
};

export default RegisterPage; 