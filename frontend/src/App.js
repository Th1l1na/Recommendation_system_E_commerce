import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import CategoryPage from './pages/CategoryPage';
import RecommendedPage from './pages/RecommendedPage';
import TrendingPage from './pages/TrendingPage';
import SearchResults from './pages/SearchResults';
import ProfilePage from './pages/ProfilePage';
import Cart from './pages/cart';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/recommended" element={<RecommendedPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/ProfilePage" element={<ProfilePage />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </Router>
    );
};

export default App;
