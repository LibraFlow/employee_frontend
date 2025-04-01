import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { bookService } from '../services/bookService';

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

    const fetchBooks = useCallback(async () => {
        try {
            console.log('Fetching books for genre:', genre);
            const data = await bookService.getAllBooksByGenre(genre);
            console.log('Received books data:', data);
            setBooks(data);
        } catch (err) {
            console.error('Error fetching books:', err);
            setError(err.response?.data?.message || 'Failed to fetch books. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [genre]);

    useEffect(() => {
        console.log('Component mounted, genre:', genre);
        fetchBooks();
    }, [fetchBooks, genre]);

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

    const handleDeleteClick = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await bookService.deleteBook(bookId);
                fetchBooks();
            } catch (err) {
                console.error('Error deleting book:', err);
                alert('Failed to delete book. Please try again.');
            }
        }
    };

    const handleEditSubmit = async () => {
        try {
            await bookService.updateBook(selectedBook.id, editForm);
            setEditDialogOpen(false);
            fetchBooks();
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
            fetchBooks(); // Refresh the books list
        } catch (error) {
            console.error('Error creating book:', error);
            alert('Failed to add book. Please try again.');
        }
    };

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Typography variant="h6">Loading books...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Typography color="error" variant="h6">
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative' }}>
            <IconButton
                onClick={() => navigate(-1)}
                sx={{ 
                    position: 'absolute',
                    left: -16,
                    top: 0,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { 
                        backgroundColor: 'primary.dark',
                        transform: 'scale(1.1)',
                        transition: 'all 0.2s ease'
                    },
                    width: 48,
                    height: 48,
                    boxShadow: 2
                }}
            >
                <ArrowBackIcon sx={{ fontSize: 32 }} />
            </IconButton>
            <Box display="flex" justifyContent="center" mb={4}>
                <Typography variant="h3" component="h1" sx={{ textAlign: 'center' }}>
                    {genre}
                </Typography>
            </Box>
            {books.length === 0 ? (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    minHeight="400px"
                    textAlign="center"
                    p={4}
                >
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No books found in this genre
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Be the first to add a book to the {genre} collection!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddBook}
                        startIcon={<AddIcon />}
                    >
                        Add First Book
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book.id}>
                            <Card 
                                sx={{ 
                                    height: '400px',
                                    width: '100%',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 3,
                                    }
                                }}
                            >
                                <CardContent sx={{ 
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden'
                                }}>
                                    <Typography 
                                        gutterBottom 
                                        variant="h5" 
                                        component="h2" 
                                        sx={{ 
                                            fontWeight: 'bold',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            lineHeight: 1.2,
                                            height: '3.6em'
                                        }}
                                    >
                                        {book.title}
                                    </Typography>
                                    <Typography 
                                        variant="subtitle1" 
                                        color="primary" 
                                        gutterBottom
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {book.author}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        gutterBottom
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Published: {book.year}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            mt: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 4,
                                            WebkitBoxOrient: 'vertical',
                                            lineHeight: 1.5,
                                            height: '6em'
                                        }}
                                    >
                                        {book.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        size="small"
                                        color="primary"
                                        startIcon={<LibraryBooksIcon />}
                                        onClick={() => navigate(`/books/${book.id}/units`)}
                                        sx={{ mr: 1 }}
                                    >
                                        View Units
                                    </Button>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleEditClick(book)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(book.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Book</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Title"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Author"
                            value={editForm.author}
                            onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Year"
                            type="number"
                            value={editForm.year}
                            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Genre"
                            value={editForm.genre}
                            onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                            fullWidth
                        >
                            {genres.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Title"
                            value={newBook.title}
                            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Author"
                            value={newBook.author}
                            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Year"
                            type="number"
                            value={newBook.year}
                            onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            select
                            label="Genre"
                            value={newBook.genre}
                            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                            fullWidth
                            required
                        >
                            {genres.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            value={newBook.description}
                            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Add Book
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BooksByGenrePage; 