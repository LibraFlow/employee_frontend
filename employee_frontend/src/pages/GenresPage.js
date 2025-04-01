import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Card, 
    Container, 
    Grid, 
    Typography, 
    Box, 
    Button, 
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
            // Optionally refresh the current view or show a success message
        } catch (error) {
            console.error('Error creating book:', error);
            // Optionally show an error message to the user
        }
    };

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box flex={1} />
                <Typography variant="h3" component="h1" sx={{ textAlign: 'center', flex: 2 }}>
                    Genres
                </Typography>
                <Box flex={1} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddBook}
                    >
                        Add New Book
                    </Button>
                </Box>
            </Box>
            <Grid container spacing={3}>
                {genres.map((genre) => (
                    <Grid item xs={12} sm={6} md={4} key={genre}>
                        <Card
                            sx={{
                                p: 3,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white',
                                    transform: 'translateY(-5px)',
                                    boxShadow: 3,
                                },
                            }}
                            onClick={() => handleGenreClick(genre)}
                        >
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
                                <Typography variant="h5" component="h2">
                                    {genre}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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

export default GenresPage; 