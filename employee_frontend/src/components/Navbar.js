import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Box display="flex" alignItems="center" width="100%">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/')}
                            sx={{ 
                                textTransform: 'none',
                                fontWeight: location.pathname === '/' ? 'bold' : 'normal'
                            }}
                        >
                            Genres
                        </Button>
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/add')}
                            sx={{ 
                                textTransform: 'none',
                                fontWeight: location.pathname === '/add' ? 'bold' : 'normal'
                            }}
                        >
                            Add Book
                        </Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 