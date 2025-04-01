import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GenresPage from './pages/GenresPage';
import BooksByGenrePage from './pages/BooksByGenrePage';
import BookUnitsPage from './pages/BookUnitsPage';
import './App.css';

function App() {
  return (
    <Router>
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
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/genres/:genre" element={<BooksByGenrePage />} />
            <Route path="/books/:bookId/units" element={<BookUnitsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;