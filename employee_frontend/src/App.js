import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, IconButton } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomePage from './pages/HomePage';
import GenresPage from './pages/GenresPage';
import BooksByGenrePage from './pages/BooksByGenrePage';
import AddBook from './pages/AddBook';
import BookUnitsPage from './pages/BookUnitsPage';

function App() {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              component={Link}
              to="/"
              sx={{ mr: 2 }}
            >
              <LibraryBooksIcon sx={{ fontSize: 32 }} />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              LibraFlow
            </Typography>
            <Button color="inherit" component={Link} to="/genres">
              Genres
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/genres/:genre" element={<BooksByGenrePage />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/books/:bookId/units" element={<BookUnitsPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;