import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GenresPage from './pages/GenresPage';
import BooksByGenrePage from './pages/BooksByGenrePage';
import BookUnitsPage from './pages/BookUnitsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OverdueUnavailableUnitsPage from './pages/OverdueUnavailableUnitsPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';
import userService from './services/userService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();

  // Check auth state and roles on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        if (user && Array.isArray(user.roles) && (user.roles.includes('LIBRARIAN') || user.roles.includes('ADMINISTRATOR'))) {
          setIsAuthenticated(true);
          setUserRoles(user.roles);
        } else {
          setIsAuthenticated(false);
          setUserRoles([]);
        }
      } catch {
        setIsAuthenticated(false);
        setUserRoles([]);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:3000/userservice/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setIsAuthenticated(false);
    setUserRoles([]);
    window.location.href = '/login';
  };

  // Route protection wrapper
  const ProtectedRoute = ({ element }) => {
    if (!isAuthenticated || !(userRoles.includes('LIBRARIAN') || userRoles.includes('ADMINISTRATOR'))) {
      navigate('/');
      return null;
    }
    return element;
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
            <Link to="/overdue-unavailable-units" className="nav-link">
              Overdue Books
            </Link>
            {isAuthenticated && (
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            )}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {isAuthenticated ? (
              <button className="nav-link logout-btn" data-cy="logout-btn" onClick={handleLogout}>
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
          <Route path="/login" element={<LoginPage onLogin={async () => {
            const user = await userService.getCurrentUser();
            if (user && Array.isArray(user.roles) && (user.roles.includes('LIBRARIAN') || user.roles.includes('ADMINISTRATOR'))) {
              setIsAuthenticated(true);
              setUserRoles(user.roles);
            } else {
              setIsAuthenticated(false);
              setUserRoles([]);
            }
          }} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/genres" element={<ProtectedRoute element={<GenresPage />} />} />
          <Route path="/genres/:genre" element={<ProtectedRoute element={<BooksByGenrePage />} />} />
          <Route path="/books/:bookId/units" element={<ProtectedRoute element={<BookUnitsPage />} />} />
          <Route path="/overdue-unavailable-units" element={<ProtectedRoute element={<OverdueUnavailableUnitsPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;