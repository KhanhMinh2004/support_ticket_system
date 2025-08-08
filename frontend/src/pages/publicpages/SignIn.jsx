import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import Card from '../../component/Card.jsx';
import { useState } from 'react';
import axios from 'axios';

export default function SignIn() {

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value,
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.post('http://localhost:8000/api/login', formData)
      alert(res.data.message)
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  }

  return (
    <>
      <CssBaseline />
      <Stack
        direction="column"
        justifyContent="center"
        sx={{
          minHeight: '100vh',
          padding: 2,
          position: 'relative',
          backgroundColor: '#f7f9fc',
        }}
      >
        <Card>
          {/* Fake Logo/Icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#e6f0fa',
              borderRadius: '50%',
              margin: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <ShieldIcon fontSize='large'/>
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mt: 1,
            }}
          >
            Welcome back!
          </Typography>

          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Sign in to access to your account.
          </Typography>

          <FormLabel htmlFor="username" sx={{ mt: 2, fontFamily: 'cursive' }}>Username</FormLabel>
          <TextField
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{
              mt: -1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
          />

          <FormLabel htmlFor="password" sx={{ mt: 2, fontFamily: 'cursive' }} >Password</FormLabel>
          <TextField
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{
              mt: -1.5,
              '& .MuiOutlinedInput-root':{
                borderRadius: 3,
              }
            }}
          />

          <Button type="submit" fullWidth variant="contained"  sx={{ mt: 3 }} onClick={handleLogin}>
            Login
          </Button>

          <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', mt: 2 }}>
            Don’t have an account?{' '}
            <Link href="/signup" underline="hover">
              Register here.
            </Link>
          </Typography>
        </Card>
      </Stack>
    </>
  );
}
