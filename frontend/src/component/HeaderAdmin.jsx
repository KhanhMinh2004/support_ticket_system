import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Header = () => {
  const theme = useTheme();

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(to right, #6b48ff, #00d4ff)', boxShadow: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#fff' }}>
          My Website
        </Typography>
        <Box>
          <Button color="inherit" href="admin" sx={{ mr: 2, '&:hover': { color: '#ffd700' } }}>
            Home
          </Button>
          <Button color="inherit" href="analyst" sx={{ mr: 2, '&:hover': { color: '#ffd700' } }}>
            Statistic
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;