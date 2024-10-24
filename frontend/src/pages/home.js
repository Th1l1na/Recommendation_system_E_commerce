import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();  // Initialize the useNavigate hook

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-center bg-cover" style={{ backgroundImage: "url('https://woocommerce.com/wp-content/uploads/2022/11/woo-paypal-features3@2x.png')" }}>
            <header className="flex items-center justify-between w-full p-4 bg-white shadow">
                <div className="flex items-center">
                    <span className="ml-2 text-xl font-bold">Amazon Product Recommendation System</span>
                </div>
                <div>
                    {/* Navigate to Signup Page */}
                    <button 
                        className="px-4 py-2 mr-2 text-purple-500 border border-purple-500 rounded" 
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                    {/* Navigate to Login Page */}
                    <button 
                        className="px-4 py-2 text-white bg-purple-500 rounded" 
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                </div>
            </header>
            <main className="flex flex-col items-center justify-center flex-grow p-8 bg-white bg-opacity-75 rounded">
                <h1 className="mb-4 text-4xl font-bold text-purple-600">Hello, Everyone!</h1>
                <p className="mb-6 text-center text-gray-600">
                    Discover a world of shopping at your fingertips. Explore amazon products, enjoy seamless purchasing, and get inspired with personalized recommendations.
                </p>
                {/* Navigate to Login Page when Start Shopping is clicked */}
                <button 
                    className="px-6 py-3 text-white bg-purple-500 rounded" 
                    onClick={() => navigate('/login')}
                >
                    Start Shopping
                </button>
            </main>
        </div>
    );
};

export default Home;
