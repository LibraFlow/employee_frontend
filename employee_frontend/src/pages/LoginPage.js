import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/userservice/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, pwd: password })
      });
      if (response.ok) {
        if (onLogin) onLogin();
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label>Username</label>
            <input data-cy="username-input" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="login-form-group">
            <label>Password</label>
            <input data-cy="password-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button data-cy="login-button" type="submit" className="login-btn">Login</button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span>Don't have an account? </span>
          <Link to="/register" data-cy="register-link">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 