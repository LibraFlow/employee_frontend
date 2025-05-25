import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GenresPage from './pages/GenresPage';
import BooksByGenrePage from './pages/BooksByGenrePage';
import BookUnitsPage from './pages/BookUnitsPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check auth state on mount
  useEffect(() => {
    fetch('http://localhost:3000/userservice/api/v1/users/me', {
      credentials: 'include',
    })
      .then(res => res.ok ? setIsAuthenticated(true) : setIsAuthenticated(false))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    // Remove the jwt cookie by calling a backend logout endpoint if available, or client-side expire
    document.cookie = 'jwt=; Max-Age=0; path=/;';
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="nav-logo">
            📚 LibraFlow
          </Link>
          <div className="nav-links">
            <Link to="/genres" className="nav-link">
              Genres
            </Link>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {isAuthenticated ? (
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/genres/:genre" element={<BooksByGenrePage />} />
          <Route path="/books/:bookId/units" element={<BookUnitsPage />} />
          <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;