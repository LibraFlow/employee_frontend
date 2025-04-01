import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <button 
                    className="home-button"
                    onClick={() => navigate('/')}
                >
                    🏠
                </button>
                <div className="nav-buttons">
                    <button 
                        className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={() => navigate('/')}
                    >
                        Genres
                    </button>
                    <button 
                        className={`nav-button ${location.pathname === '/add' ? 'active' : ''}`}
                        onClick={() => navigate('/add')}
                    >
                        Add Book
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 