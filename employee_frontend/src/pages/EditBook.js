import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookService from '../services/bookService';

function EditBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    description: ''
  });

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      const data = await bookService.getBook(id);
      setBook(data);
    } catch (error) {
      console.error('Error loading book:', error);
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookService.updateBook(id, book);
      navigate('/');
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <div className="form-container">
      <h1>Edit Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={book.year}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={book.genre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={book.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="button button-primary">
          Update Book
        </button>
      </form>
    </div>
  );
}

export default EditBook; 