import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Modal.css';

const POLICY_TEXT = `By registering, you agree to the following:\n\n- Your personal data (username, email, address, phone, and role) is collected and stored for the purposes of account management, library operations, and legal compliance.\n- Your data is protected using industry-standard security measures and is only accessible to authorized personnel. It will not be shared with third parties except as required by law.\n- You have the right to access, correct, or request deletion of your data at any time. You may also deactivate your account whenever you wish.\n- For any questions or concerns about your data, please contact the library administration.`;

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
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowPolicy(true);
    setPolicyChecked(false);
    setPendingSubmit(true);
  };

  const handlePolicyAgree = async () => {
    setShowPolicy(false);
    setPendingSubmit(false);
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

  const handlePolicyCancel = () => {
    setShowPolicy(false);
    setPendingSubmit(false);
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
        {showPolicy && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Terms and Policy</h3>
              <pre style={{whiteSpace: 'pre-wrap', textAlign: 'left'}}>{POLICY_TEXT}</pre>
              <div style={{margin: '1em 0'}}>
                <input
                  type="checkbox"
                  id="policy-check"
                  checked={policyChecked}
                  onChange={e => setPolicyChecked(e.target.checked)}
                />
                <label htmlFor="policy-check" style={{marginLeft: '0.5em'}}>I agree to the terms and policy above</label>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1em'}}>
                <button onClick={handlePolicyCancel} className="modal-btn cancel">Cancel</button>
                <button
                  onClick={handlePolicyAgree}
                  className="modal-btn agree"
                  disabled={!policyChecked}
                  style={{background: policyChecked ? '#1976d2' : '#aaa', color: '#fff'}}
                >
                  Agree and Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage; 