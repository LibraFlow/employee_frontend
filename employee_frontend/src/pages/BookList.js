import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookService from '../services/bookService';

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        loadBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  return (
    <div>
      <h1>Book Library</h1>
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Year:</strong> {book.year}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <div className="book-actions">
              <Link to={`/edit/${book.id}`} className="button button-primary">
                Edit
              </Link>
              <button
                onClick={() => handleDelete(book.id)}
                className="button button-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookList; 