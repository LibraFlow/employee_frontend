import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import './GenresPage.css';

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

const GenresPage = () => {
    const navigate = useNavigate();
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        year: '',
        genre: '',
        description: ''
    });

    const handleGenreClick = (genre) => {
        navigate(`/genres/${genre}`);
    };

    const handleAddBook = () => {
        setAddDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setAddDialogOpen(false);
        setNewBook({
            title: '',
            author: '',
            year: '',
            genre: '',
            description: ''
        });
    };

    const handleSubmit = async () => {
        try {
            await bookService.createBook(newBook);
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating book:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="genres-container">
            <div className="genres-header">
                <h1>Browse by Genre</h1>
                <button className="add-book-button" onClick={handleAddBook}>
                    ➕ Add Book
                </button>
            </div>
            
            <div className="genres-grid">
                {genres.map((genre) => (
                    <div 
                        key={genre}
                        className="genre-card"
                        onClick={() => handleGenreClick(genre)}
                    >
                        <h2>{genre}</h2>
                    </div>
                ))}
            </div>

            {addDialogOpen && (
                <div className="dialog-overlay" onClick={handleCloseDialog}>
                    <div className="dialog-content" onClick={e => e.stopPropagation()}>
                        <h2>Add New Book</h2>
                        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={newBook.title}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="author"
                                placeholder="Author"
                                value={newBook.author}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="year"
                                placeholder="Year"
                                value={newBook.year}
                                onChange={handleInputChange}
                            />
                            <select
                                name="genre"
                                value={newBook.genre}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Genre</option>
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={newBook.description}
                                onChange={handleInputChange}
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

export default GenresPage; 