import React from 'react';
import { Typography, Box } from '@mui/material';
import '../styles/HomePage.css';

const HomePage = () => {
    return (
        <div className="home-container">
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '80vh',
                    textAlign: 'center',
                    padding: '2rem'
                }}
            >
                <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: '#1976d2',
                        marginBottom: '1rem'
                    }}
                >
                    Welcome to LibraFlow!
                </Typography>
                <Typography 
                    variant="h5" 
                    component="p"
                    sx={{ 
                        color: '#666',
                        maxWidth: '600px'
                    }}
                >
                    The place where you can discover new worlds!
                </Typography>
            </Box>
        </div>
    );
};

export default HomePage; 