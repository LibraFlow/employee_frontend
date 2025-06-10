import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import './BooksByGenrePage.css';

const genres = [
    'Science Fiction',
    'Mystery',
    'Romance',
    'Fantasy',
    'Biography',
    'History',
    'Poetry',
    'Drama',
    'Horror'
];

const BooksByGenrePage = () => {
    const { genre } = useParams();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        author: '',
        year: '',
        genre: '',
        description: ''
    });
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        year: '',
        genre: genre,
        description: ''
    });
    const [addBookError, setAddBookError] = useState('');
    const [editBookError, setEditBookError] = useState('');
    const [deleteBookError, setDeleteBookError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    const loadBooks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await bookService.getAllBooksByGenre(genre);
            setBooks(data);
            setError(null);
        } catch (err) {
            console.error('Error loading books:', err);
            setError('Failed to load books. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [genre]);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setEditForm({
            title: book.title,
            author: book.author,
            year: book.year,
            genre: book.genre,
            description: book.description
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        setEditBookError('');
        if (editForm.title.length > 40) {
            setEditBookError('Title is too long. Please use 40 characters or fewer.');
            return;
        }
        if (editForm.author.length > 40) {
            setEditBookError('Author is too long. Please use 40 characters or fewer.');
            return;
        }
        if (editForm.genre.length > 40) {
            setEditBookError('Genre is too long. Please use 40 characters or fewer.');
            return;
        }
        if (editForm.description.length > 1000) {
            setEditBookError('Description is too long. Please use 1000 characters or fewer.');
            return;
        }
        if (!editForm.year) {
            setEditBookError('Year is required.');
            return;
        }
        try {
            await bookService.updateBook(selectedBook.id, editForm);
            setEditDialogOpen(false);
            loadBooks();
        } catch (error) {
            setEditBookError('Failed to update book. Please try again.');
            console.error('Error updating book:', error);
        }
    };

    const handleCloseDialog = () => {
        setAddDialogOpen(false);
        setNewBook({
            title: '',
            author: '',
            year: '',
            genre: genre,
            description: ''
        });
    };

    const handleAddBook = () => {
        setAddDialogOpen(true);
    };

    const handleSubmit = async () => {
        setAddBookError('');
        if (newBook.title.length > 40) {
            setAddBookError('Title is too long. Please use 40 characters or fewer.');
            return;
        }
        if (newBook.author.length > 40) {
            setAddBookError('Author is too long. Please use 40 characters or fewer.');
            return;
        }
        if (newBook.genre.length > 40) {
            setAddBookError('Genre is too long. Please use 40 characters or fewer.');
            return;
        }
        if (newBook.description.length > 1000) {
            setAddBookError('Description is too long. Please use 1000 characters or fewer.');
            return;
        }
        if (!newBook.year) {
            setAddBookError('Year is required.');
            return;
        }
        try {
            await bookService.createBook(newBook);
            handleCloseDialog();
            loadBooks();
        } catch (error) {
            setAddBookError('Failed to add book. Please try again.');
            console.error('Error creating book:', error);
        }
    };

    const handleDeleteBookClick = (bookId) => {
        setBookToDelete(bookId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteBookError('');
        setShowDeleteModal(false);
        try {
            await bookService.deleteBook(bookToDelete);
            setBookToDelete(null);
            loadBooks();
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setDeleteBookError('This book has already been deleted by another employee.');
            } else {
                setDeleteBookError('Failed to delete book. Please try again.');
        }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setBookToDelete(null);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="books-by-genre-container">
            <div className="page-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h1>{genre} Books</h1>
                <button className="add-button" onClick={handleAddBook}>
                    ➕ Add Book
                </button>
            </div>

            {deleteBookError && (
                <div className="error" data-cy="delete-book-error">{deleteBookError}</div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Delete Book</h3>
                        <p>Are you sure you want to delete this book? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn btn-danger" onClick={handleConfirmDelete} data-cy="confirm-delete">Delete</button>
                            <button className="btn btn-secondary" onClick={handleCancelDelete} data-cy="cancel-delete">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="books-grid">
                {books.map((book) => (
                    <div key={book.id} className="book-card">
                        <h2 className="book-title">{book.title}</h2>
                        <p className="book-author">{book.author}</p>
                        <p className="book-year">Published: {book.year}</p>
                        <p className="book-description">{book.description}</p>
                        <div className="book-actions">
                            <button 
                                className="units-button"
                                onClick={() => navigate(`/books/${book.id}/units`)}
                            >
                                View Units
                            </button>
                            <div className="action-buttons">
                                <button 
                                    className="edit-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(book);
                                    }}
                                >
                                    ✏️
                                </button>
                                <button 
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteBookClick(book.id);
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editDialogOpen && (
                <div className="dialog-overlay" onClick={() => setEditDialogOpen(false)}>
                    <div className="dialog" onClick={e => e.stopPropagation()}>
                        <h2>Edit Book</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleEditSubmit();
                        }}>
                            {editBookError && <div className="error" data-cy="edit-book-error">{editBookError}</div>}
                            <label>Title</label>
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                            <label>Author</label>
                            <input
                                type="text"
                                value={editForm.author}
                                onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                            />
                            <label>Year</label>
                            <input
                                type="number"
                                value={editForm.year}
                                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                            />
                            <label>Genre</label>
                            <select
                                value={editForm.genre}
                                onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                            >
                                {genres.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <label>Description</label>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
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
                <div className="dialog-overlay" onClick={handleCloseDialog}>
                    <div className="dialog" onClick={e => e.stopPropagation()}>
                        <h2>Add New Book</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}>
                            {addBookError && <div className="error" data-cy="add-book-error">{addBookError}</div>}
                            <label>Title</label>
                            <input
                                type="text"
                                value={newBook.title}
                                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                required
                            />
                            <label>Author</label>
                            <input
                                type="text"
                                value={newBook.author}
                                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                required
                            />
                            <label>Year</label>
                            <input
                                type="number"
                                value={newBook.year}
                                onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                                required
                            />
                            <label>Genre</label>
                            <select
                                value={newBook.genre}
                                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                                required
                            >
                                {genres.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <label>Description</label>
                            <textarea
                                value={newBook.description}
                                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                                required
                            />
                            <div className="dialog-actions">
                                <button type="button" onClick={handleCloseDialog}>
                                    Cancel
                                </button>
                                <button type="submit">
                                    Add Book
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BooksByGenrePage; 