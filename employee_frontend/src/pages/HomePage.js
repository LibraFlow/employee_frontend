import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Welcome to LibraFlow!</h1>
                <p className="home-subtitle">
                    The place where you can discover new worlds!
                </p>
                <button onClick={() => navigate('/overdue-unavailable-units')}>
                    View Overdue & Unavailable Book Units
                </button>
            </div>
        </div>
    );
};

export default HomePage; 