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
        try {
            await bookService.updateBook(selectedBook.id, editForm);
            setEditDialogOpen(false);
            loadBooks();
        } catch (err) {
            console.error('Error updating book:', err);
            alert('Failed to update book. Please try again.');
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
        try {
            await bookService.createBook(newBook);
            handleCloseDialog();
            loadBooks();
        } catch (error) {
            console.error('Error creating book:', error);
            alert('Failed to add book. Please try again.');
        }
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
                <button className="add-button" onClick={() => navigate('/add')}>
                    ➕ Add Book
                </button>
            </div>

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
                                        if (window.confirm('Are you sure you want to delete this book?')) {
                                            bookService.deleteBook(book.id)
                                                .then(() => loadBooks())
                                                .catch(err => console.error('Error deleting book:', err));
                                        }
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dialog-overlay" style={{ display: editDialogOpen ? 'block' : 'none' }}>
                <div className="dialog">
                    <h2>Edit Book</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleEditSubmit();
                    }}>
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
                        <button type="submit">Save Changes</button>
                        <button onClick={() => setEditDialogOpen(false)}>Cancel</button>
                    </form>
                </div>
            </div>

            <div className="dialog-overlay" style={{ display: addDialogOpen ? 'block' : 'none' }}>
                <div className="dialog">
                    <h2>Add New Book</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
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
                        <button type="submit">Add Book</button>
                        <button onClick={handleCloseDialog}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BooksByGenrePage; 