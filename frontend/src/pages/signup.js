import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [preferences, setPreferences] = useState([]);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/categories');
                const categoryOptions = response.data.map(category => ({
                    value: category,
                    label: category
                }));
                setCategories(categoryOptions);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();

        // Ensure at least one preference is selected
        if (preferences.length === 0) {
            setError('Please select at least one preference.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                password,
                preferences: preferences.map(preference => preference.value).join(','),  // Send selected preferences as a comma-separated string
            });
            alert(response.data.message);
            navigate('/login');
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
            }}>Sign Up</h2>
            <form onSubmit={handleSignup}>
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
                        placeholder="Name"
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
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f0f0f0',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    marginBottom: '20px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}>
                    <i className="fas fa-cogs" style={{ color: '#7B2FF7', marginRight: '10px' }}></i>
                    <Select
                        isMulti
                        options={categories}
                        value={preferences}
                        onChange={setPreferences}
                        placeholder="Select preferences..."
                        closeMenuOnSelect={false}
                        styles={{
                            control: (base) => ({
                                ...base,
                                border: 'none',
                                boxShadow: 'none',
                                background: 'none',
                                width: '100%'
                            })
                        }}
                    />
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
                }} type="submit">CREATE ACCOUNT</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ textAlign: 'center' }}>
            <p>
                Already have an account? 
                <span 
                    onClick={() => navigate('/login')} 
                    style={{ color: '#7B2FF7', textDecoration: 'none', cursor: 'pointer' }}>
                    Sign in
                </span>
            </p>
        </div>
        </div>
    );
};

export default Signup;