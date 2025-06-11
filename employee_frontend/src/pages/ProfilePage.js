import React, { useEffect, useState } from 'react';
import userService from '../services/userService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ username: '', email: '', pwd: '', address: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const data = await userService.getCurrentUser();
                setUser(data);
                setForm({
                    username: data.username || '',
                    email: data.email || '',
                    pwd: data.pwd ? '********' : '',
                    address: data.address || '',
                    phone: data.phone || ''
                });
            } catch {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const payload = { ...user, ...form };
        if (form.pwd === '********') {
            payload.pwd = user.pwd;
        }
        try {
            const updated = await userService.updateUser(user.id, payload);
            setUser(updated);
            setEditMode(false);
            setSuccess('Profile updated successfully.');
            setForm({
                ...form,
                pwd: '********'
            });
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    const handleDelete = async () => {
        try {
            await userService.deleteUser(user.id);
            setShowDeleteModal(false);
            window.location.href = '/login';
        } catch {
            setError('Failed to delete account.');
        }
    };

    const handleExport = async () => {
        try {
            const blob = await userService.exportUserData(user.id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_data.json');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setShowExportModal(false);
        } catch {
            setError('Failed to export data.');
        }
    };

    const handleCancelEdit = () => {
        setForm({
            username: user.username || '',
            email: user.email || '',
            pwd: user.pwd ? '********' : '',
            address: user.address || '',
            phone: user.phone || ''
        });
        setEditMode(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return null;

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleUpdate} className="profile-form">
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </label>
                <label>
                    Password:
                    {editMode ? (
                        <input
                            type="password"
                            name="pwd"
                            value={form.pwd}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    ) : (
                        <input
                            type="password"
                            name="pwd"
                            value={form.pwd}
                            disabled
                        />
                    )}
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </label>
                {editMode ? (
                    <>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancelEdit}>Cancel</button>
                    </>
                ) : (
                    <button type="button" onClick={() => setEditMode(true)}>Edit Profile</button>
                )}
            </form>
            <hr />
            <button className="export-btn" onClick={() => setShowExportModal(true)}>Export My Data</button>
            <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>Delete My Account</button>
            {/* Export Modal */}
            {showExportModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Do you want to export your data?</p>
                        <button onClick={handleExport}>Yes, Export</button>
                        <button onClick={() => setShowExportModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        <button onClick={handleDelete}>Yes, Delete</button>
                        <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage; 