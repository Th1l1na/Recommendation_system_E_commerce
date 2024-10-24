import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from '../components/Navbar';



const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };
  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: true },
    { name: "Cart", href: "/cart", current: false },
    { name: "Home", href: "/test", current: false },
  ];
  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" },
  ];

const truncate = (text, length) => {
    if (text.length > length) {
      return text.slice(0, length) + "...";
    } else {
      return text;
    }
  };

const Profile = () => {
    const navigate = useNavigate();
    const [previousSearch, setPreviousSearch] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));  // Get user_id from local storage
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [preferences, setPreferences] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch previous search data from local storage on component mount
    useEffect(() => {
        const searchData = localStorage.getItem('previousSearch');
        console.log('Search Data from localStorage:', searchData);
        if (searchData) {
            setPreviousSearch(JSON.parse(searchData));
        }
    }, []);

    const handleClick = () => {
        navigate('/login');
    };

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/profile?user_id=${userId}`);
                setUsername(response.data.username);
                setPreferences(response.data.preferences.split(',').map(pref => ({ label: pref, value: pref })));
            } catch (err) {
                setError('Failed to fetch profile.');
            }
        };

        // Fetch available categories for preferences selection
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

        fetchProfile();
        fetchCategories();
    }, [userId]);

    // Handle form submission for updating profile
    const handleUpdate = async (e) => {
        e.preventDefault();
    
        if (!preferences.length) {
            setError('Please select at least one preference.');
            return;
        }
    
        try {
            const response = await axios.put('http://localhost:5000/profile', {
                user_id: userId,
                username,
                password,
                preferences: preferences.map(pref => pref.value).join(',')  // Send selected preferences as comma-separated
            });
    
            setSuccess(response.data.message);
            setError('');
        } catch (err) {
            setError('Error updating profile: ' + err.response.data.error); // Provide specific error
        }
    };
    

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user_id'); // Clear user_id from local storage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div>
            <Navbar navigation={navigation} user={user} userNavigation={userNavigation} />

            <div style={{
            maxWidth: '400px',
            margin: '50px auto',
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Profile</h2>
            <form onSubmit={handleUpdate}>
                {/* Username input */}
                <div style={inputStyle}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={inputFieldStyle}
                    />
                </div>
                {/* Password input */}
                <div style={inputStyle}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputFieldStyle}
                    />
                </div>
                {/* Preferences selection */}
                <div style={inputStyle}>
                    <Select
                        isMulti
                        options={categories}
                        value={preferences}
                        onChange={setPreferences}
                        placeholder="Select preferences..."
                        closeMenuOnSelect={false}
                        styles={selectStyle}
                    />
                </div>
                {/* Save button */}
                <button type="submit" style={buttonStyle}>Save</button>
            </form>
            {/* Logout button */}
            <button onClick={handleLogout} style={{ ...buttonStyle, background: '#FF4C4C', marginTop: '10px' }}>
                Logout
            </button>
            {/* Error and success messages */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>

            {previousSearch ? (
                <div>
                    <h2>Previous Search: {previousSearch.searchText}</h2>
                    <div className="grid grid-cols-3 gap-4 rounded-lg">
                        {previousSearch.results.map((product) => (
                            <div key={product.asin} className="h-40 p-4 bg-gray-300">
                                <img
                                    src={product.imgUrl}
                                    alt={product.title}
                                    className="object-cover w-50% h-16 mb-2 mx-auto"
                                />
                                <div className="text-sm font-bold">
                                    {truncate(product.title, 40)}
                                </div>
                                <div className="text-sm">{product.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>No previous search available</div>
            )}
        </div>
    );
};

// Styles
const inputStyle = {
    marginBottom: '20px',
    padding: '10px 20px',
    background: '#f0f0f0',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
};

const inputFieldStyle = {
    border: 'none',
    background: 'none',
    outline: 'none',
    width: '100%',
};

const selectStyle = {
    control: (base) => ({
        ...base,
        border: 'none',
        boxShadow: 'none',
        background: 'none',
        width: '100%',
    }),
};

const buttonStyle = {
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
    marginBottom: '20px',
};

export default Profile;
