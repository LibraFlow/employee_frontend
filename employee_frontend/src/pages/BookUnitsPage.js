import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import bookUnitService from '../services/bookUnitService';
import '../styles/BookUnitsPage.css';

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
        isbn: ''
    });
    const [formData, setFormData] = useState({
        language: '',
        pageCount: '',
        publisher: '',
        isbn: '',
        coverImageLink: ''
    });

    useEffect(() => {
        loadBookUnits();
    }, [bookId]);

    const loadBookUnits = async () => {
        try {
            const data = await bookUnitService.getBookUnitsByBookId(bookId);
            setBookUnits(data);
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
            coverImageLink: unit.coverImageLink || '',
            publisher: unit.publisher,
            isbn: unit.isbn
        });
        setEditDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book unit?')) {
            try {
                await bookUnitService.deleteBookUnit(id);
                setBookUnits(bookUnits.filter(unit => unit.id !== id));
            } catch (err) {
                setError('Failed to delete book unit');
                console.error('Error deleting book unit:', err);
            }
        }
    };

    const handleEditSubmit = async () => {
        try {
            await bookUnitService.updateBookUnit(selectedUnit.id, {
                ...editForm,
                bookId: parseInt(bookId),
                availability: true
            });
            setEditDialogOpen(false);
            loadBookUnits();
        } catch (err) {
            setError('Failed to update book unit');
            console.error('Error updating book unit:', err);
        }
    };

    const handleAddClick = () => {
        setFormData({
            language: '',
            pageCount: '',
            publisher: '',
            isbn: '',
            coverImageLink: ''
        });
        setAddDialogOpen(true);
    };

    const handleAddSubmit = async () => {
        try {
            await bookUnitService.createBookUnit({
                ...formData,
                bookId: parseInt(bookId),
                availability: true
            });
            setAddDialogOpen(false);
            loadBookUnits();
        } catch (err) {
            setError('Failed to create book unit');
            console.error('Error creating book unit:', err);
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="book-units-container">
            <div className="book-units-header">
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ 
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': { 
                            backgroundColor: 'primary.dark',
                            transform: 'translateY(-50%) scale(1.1)',
                            transition: 'all 0.2s ease'
                        },
                        width: 48,
                        height: 48,
                        boxShadow: 2,
                        zIndex: 1
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: 32 }} />
                </IconButton>
                <h1>Book Units</h1>
                {bookUnits.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddClick}
                        startIcon={<AddIcon />}
                        sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                    >
                        Add New Book Unit
                    </Button>
                )}
            </div>

            {bookUnits.length === 0 ? (
                <div className="empty-state">
                    <h2>No Book Units Found</h2>
                    <p>There are no book units available for this book.</p>
                    <p>Add the first book unit to get started!</p>
                    <Link to={`/books/${bookId}/units/add`} className="add-first-button">
                        + Add First Book Unit
                    </Link>
                </div>
            ) : (
                <div className="book-units-grid">
                    {bookUnits.map((unit) => (
                        <div key={unit.id} className="book-unit-card">
                            <div className="book-unit-image">
                                {unit.coverImageLink && (
                                    <img src={unit.coverImageLink} alt={`Cover of ${unit.title}`} />
                                )}
                            </div>
                            <div className="book-unit-info">
                                <h3>ISBN: {unit.isbn}</h3>
                                <p>Language: {unit.language}</p>
                                <p>Pages: {unit.pageCount}</p>
                                <p>Publisher: {unit.publisher}</p>
                                <p>Status: {unit.availability ? 'Available' : 'Not Available'}</p>
                            </div>
                            <div className="book-unit-actions">
                                <IconButton 
                                    color="primary" 
                                    size="small"
                                    onClick={() => handleEditClick(unit)}
                                    sx={{ '&:hover': { color: 'primary.dark' } }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton 
                                    color="error" 
                                    size="small"
                                    onClick={() => handleDelete(unit.id)}
                                    sx={{ '&:hover': { color: 'error.dark' } }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Book Unit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Language"
                        fullWidth
                        value={editForm.language}
                        onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Page Count"
                        type="number"
                        fullWidth
                        value={editForm.pageCount}
                        onChange={(e) => setEditForm({ ...editForm, pageCount: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Publisher"
                        fullWidth
                        value={editForm.publisher}
                        onChange={(e) => setEditForm({ ...editForm, publisher: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="ISBN"
                        fullWidth
                        value={editForm.isbn}
                        onChange={(e) => setEditForm({ ...editForm, isbn: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Cover Image URL"
                        fullWidth
                        value={editForm.coverImageLink}
                        onChange={(e) => setEditForm({ ...editForm, coverImageLink: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Book Unit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="language"
                        label="Language"
                        type="text"
                        fullWidth
                        value={formData.language}
                        onChange={handleAddChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="pageCount"
                        label="Page Count"
                        type="number"
                        fullWidth
                        value={formData.pageCount}
                        onChange={handleAddChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="publisher"
                        label="Publisher"
                        type="text"
                        fullWidth
                        value={formData.publisher}
                        onChange={handleAddChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="isbn"
                        label="ISBN"
                        type="text"
                        fullWidth
                        value={formData.isbn}
                        onChange={handleAddChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="coverImageLink"
                        label="Cover Image URL"
                        type="url"
                        fullWidth
                        value={formData.coverImageLink}
                        onChange={handleAddChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSubmit} variant="contained" color="primary">
                        Add Book Unit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BookUnitsPage; 