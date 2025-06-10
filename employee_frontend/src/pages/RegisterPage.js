import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    pwd: '',
    email: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState('LIBRARIAN');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:3000/userservice/api/v1/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, roles: [role] }),
      });
      if (response.ok) {
        setSuccess('Registration successful! You can now log in.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-card">
        <h2 className="login-title">Register</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label>Username</label>
            <input data-cy="register-username" name="username" type="text" value={form.username} onChange={handleChange} required />
          </div>
          <div className="login-form-group">
            <label>Password</label>
            <input data-cy="register-password" name="pwd" type="password" value={form.pwd} onChange={handleChange} required />
          </div>
          <div className="login-form-group">
            <label>Email</label>
            <input data-cy="register-email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="login-form-group">
            <label>Address</label>
            <input data-cy="register-address" name="address" type="text" value={form.address} onChange={handleChange} required />
          </div>
          <div className="login-form-group">
            <label>Phone</label>
            <input data-cy="register-phone" name="phone" type="text" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="login-form-group">
            <label>Role</label>
            <select data-cy="register-role" value={role} onChange={e => setRole(e.target.value)} required>
              <option value="LIBRARIAN">Librarian</option>
              <option value="ADMINISTRATOR">Administrator</option>
            </select>
          </div>
          {error && <div className="login-error" data-cy="register-error">{error}</div>}
          {success && <div className="login-success" data-cy="register-success">{success}</div>}
          <button data-cy="register-submit" type="submit" className="login-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 