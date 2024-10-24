import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            alert(response.data.message);
            // Store user_id in local storage or state management
            localStorage.setItem('user_id', response.data.user_id);
            // Redirect to the dashboard page
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <div style={{
            maxWidth: '400px',
            margin: '50px auto',
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '24px'
            }}>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f0f0f0',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    marginBottom: '20px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}>
                    <i className="fas fa-user" style={{ color: '#7B2FF7', marginRight: '10px' }}></i>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f0f0f0',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    marginBottom: '20px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}>
                    <i className="fas fa-lock" style={{ color: '#7B2FF7', marginRight: '10px' }}></i>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                    <i className="fas fa-eye" style={{ color: '#7B2FF7' }}></i>
                </div>
                <button style={{
                    display: 'block',
                    width: '100%',
                    background: 'linear-gradient(90deg, #7B2FF7, #F107A3)',
                    color: 'white',
                    padding: '15px',
                    border: 'none',
                    borderRadius: '30px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginBottom: '20px'
                }} type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ textAlign: 'center' }}>
                <p>Don't have an account? <button onClick={() => navigate('/signup')} style={{
                    background: 'none',
                    border: 'none',
                    color: '#7B2FF7',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                }}>Signup</button></p>
            </div>
        </div>
    );
};

export default Login;