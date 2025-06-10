import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookUnitService from '../services/bookUnitService';
import './BookUnitsPage.css';

const BookUnitsPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [bookUnits, setBookUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [editForm, setEditForm] = useState({
        language: '',
        pageCount: '',
        coverImageLink: '',
        publisher: '',
        isbn: '',
        availability: true
    });
    const [formData, setFormData] = useState({
        language: '',
        pageCount: '',
        publisher: '',
        isbn: '',
        coverImageLink: '',
        availability: true
    });
    const [addBookUnitError, setAddBookUnitError] = useState('');
    const [editBookUnitError, setEditBookUnitError] = useState('');
    const [unitToDelete, setUnitToDelete] = useState(null);
    const [showDeleteUnitModal, setShowDeleteUnitModal] = useState(false);

    useEffect(() => {
        loadBookUnits();
    }, [bookId]);

    const loadBookUnits = async () => {
        try {
            const data = await bookUnitService.getBookUnitsByBookId(bookId);
            setBookUnits(data);
            setError(null);
        } catch (err) {
            setError('Failed to load book units');
            console.error('Error loading book units:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (unit) => {
        setSelectedUnit(unit);
        setEditForm({
            language: unit.language,
            pageCount: unit.pageCount,
            coverImageLink: unit.coverImageLink,
            publisher: unit.publisher,
            isbn: unit.isbn,
            availability: unit.availability
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditBookUnitError('');
        const validationError = validateBookUnit(editForm);
        if (validationError) {
            setEditBookUnitError(validationError);
            return;
        }
        try {
            await bookUnitService.updateBookUnit(selectedUnit.id, {
                ...editForm,
                id: selectedUnit.id,
                bookId: selectedUnit.bookId,
                pageCount: parseInt(editForm.pageCount)
            });
            setEditDialogOpen(false);
            loadBookUnits();
        } catch (err) {
            let msg = 'Error updating book unit.';
            if (err.response && err.response.data && err.response.data.message) {
                msg = err.response.data.message;
            }
            setEditBookUnitError(msg);
            console.error('Error updating book unit:', err);
        }
    };

    const handleAddClick = () => {
        setAddDialogOpen(true);
    };

    const validateBookUnit = (data) => {
        // Language: 2-20 chars, not blank
        if (!data.language || data.language.trim().length < 2 || data.language.trim().length > 20) {
            return 'Language must be between 2 and 20 characters.';
        }
        // Page Count: positive integer, max 10000
        const pageCount = parseInt(data.pageCount);
        if (isNaN(pageCount) || pageCount <= 0 || pageCount > 10000) {
            return 'Page count must be a positive number not exceeding 10,000.';
        }
        // Publisher: 1-40 chars, not blank
        if (!data.publisher || data.publisher.trim().length < 1 || data.publisher.trim().length > 40) {
            return 'Publisher must be between 1 and 40 characters.';
        }
        // ISBN: regex
        const isbnRegex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 09]{17}$)(?:97[89][- ])?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
        if (!data.isbn || !isbnRegex.test(data.isbn)) {
            return 'ISBN is invalid.';
        }
        // Cover Image Link: if present, must be a valid image URL (jpg, jpeg, png, gif, webp)
        if (data.coverImageLink && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(data.coverImageLink)) {
            return 'Cover image link must be a valid image URL (jpg, jpeg, png, gif, webp).';
        }
        return '';
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setAddBookUnitError('');
        const validationError = validateBookUnit(formData);
        if (validationError) {
            setAddBookUnitError(validationError);
            return;
        }
        try {
            await bookUnitService.createBookUnit({
                ...formData,
                bookId,
                availability: true,
                pageCount: parseInt(formData.pageCount)
            });
            setAddDialogOpen(false);
            loadBookUnits();
            setFormData({
                language: '',
                pageCount: '',
                publisher: '',
                isbn: '',
                coverImageLink: '',
                availability: true
            });
        } catch (err) {
            let msg = 'Error creating book unit.';
            if (err.response && err.response.data && err.response.data.message) {
                msg = err.response.data.message;
            }
            setAddBookUnitError(msg);
            console.error('Error creating book unit:', err);
        }
    };

    const handleDeleteClick = (unitId) => {
        setUnitToDelete(unitId);
        setShowDeleteUnitModal(true);
    };

    const handleConfirmDeleteUnit = async () => {
        setShowDeleteUnitModal(false);
        try {
            await bookUnitService.deleteBookUnit(unitToDelete);
            setUnitToDelete(null);
            loadBookUnits();
        } catch (err) {
            // Optionally handle error
            setUnitToDelete(null);
        }
    };

    const handleCancelDeleteUnit = () => {
        setShowDeleteUnitModal(false);
        setUnitToDelete(null);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="book-units-container">
            <div className="page-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h1>Book Units</h1>
                <button className="add-button" onClick={handleAddClick}>
                    ➕ Add Unit
                </button>
            </div>

            <div className="units-grid">
                {bookUnits.map((unit) => (
                    <div key={unit.id} className="unit-card">
                        {unit.coverImageLink && (
                            <img 
                                src={unit.coverImageLink} 
                                alt="Book cover" 
                                className="unit-cover"
                            />
                        )}
                        <div className="unit-info">
                            <p><strong>Language:</strong> {unit.language}</p>
                            <p><strong>Pages:</strong> {unit.pageCount}</p>
                            <p><strong>Publisher:</strong> {unit.publisher}</p>
                            <p><strong>ISBN:</strong> {unit.isbn}</p>
                            <p><strong>Availability:</strong> <span style={{ color: unit.availability ? 'blue' : 'red' }}>{unit.availability ? 'Available' : 'Unavailable'}</span></p>
                        </div>
                        <div className="unit-actions">
                            <button 
                                className="edit-button"
                                onClick={() => handleEditClick(unit)}
                            >
                                ✏️
                            </button>
                            <button 
                                className="delete-button"
                                onClick={() => handleDeleteClick(unit.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editDialogOpen && (
                <div className="dialog-overlay" onClick={() => setEditDialogOpen(false)}>
                    <div className="dialog" onClick={e => e.stopPropagation()}>
                        <h2>Edit Book Unit</h2>
                        <form onSubmit={handleEditSubmit}>
                            {editBookUnitError && <div className="error" data-cy="edit-book-unit-error">{editBookUnitError}</div>}
                            <label>Language</label>
                            <input
                                type="text"
                                value={editForm.language}
                                onChange={(e) => setEditForm({...editForm, language: e.target.value})}
                            />
                            <label>Page Count</label>
                            <input
                                type="number"
                                value={editForm.pageCount}
                                onChange={(e) => setEditForm({...editForm, pageCount: e.target.value})}
                            />
                            <label>Cover Image Link</label>
                            <input
                                type="url"
                                value={editForm.coverImageLink}
                                onChange={(e) => setEditForm({...editForm, coverImageLink: e.target.value})}
                            />
                            <label>Publisher</label>
                            <input
                                type="text"
                                value={editForm.publisher}
                                onChange={(e) => setEditForm({...editForm, publisher: e.target.value})}
                            />
                            <label>ISBN</label>
                            <input
                                type="text"
                                value={editForm.isbn}
                                onChange={(e) => setEditForm({...editForm, isbn: e.target.value})}
                            />
                            <label>Availability</label>
                            <select
                                value={editForm.availability}
                                onChange={(e) => setEditForm({...editForm, availability: e.target.value === 'true'})}
                            >
                                <option value="true">Available</option>
                                <option value="false">Unavailable</option>
                            </select>
                            <div className="dialog-actions">
                                <button type="button" onClick={() => setEditDialogOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {addDialogOpen && (
                <div className="dialog-overlay" onClick={() => setAddDialogOpen(false)}>
                    <div className="dialog" onClick={e => e.stopPropagation()}>
                        <h2>Add New Book Unit</h2>
                        <form onSubmit={handleAddSubmit}>
                            {addBookUnitError && <div className="error" data-cy="add-book-unit-error">{addBookUnitError}</div>}
                            <label>Language</label>
                            <input
                                type="text"
                                value={formData.language}
                                onChange={(e) => setFormData({...formData, language: e.target.value})}
                                required
                            />
                            <label>Page Count</label>
                            <input
                                type="number"
                                value={formData.pageCount}
                                onChange={(e) => setFormData({...formData, pageCount: e.target.value})}
                                required
                            />
                            <label>Cover Image Link</label>
                            <input
                                type="url"
                                value={formData.coverImageLink}
                                onChange={(e) => setFormData({...formData, coverImageLink: e.target.value})}
                            />
                            <label>Publisher</label>
                            <input
                                type="text"
                                value={formData.publisher}
                                onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                                required
                            />
                            <label>ISBN</label>
                            <input
                                type="text"
                                value={formData.isbn}
                                onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                                required
                            />
                            <div className="dialog-actions">
                                <button type="button" onClick={() => setAddDialogOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit">
                                    Add Unit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteUnitModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Delete Book Unit</h3>
                        <p>Are you sure you want to delete this book unit? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn btn-danger" onClick={handleConfirmDeleteUnit} data-cy="confirm-delete-unit">Delete</button>
                            <button className="btn btn-secondary" onClick={handleCancelDeleteUnit} data-cy="cancel-delete-unit">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookUnitsPage; 