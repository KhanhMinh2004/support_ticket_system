import React from 'react';
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
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Card from '../../component/Card.jsx'; 
import { useState } from 'react';
import axios from 'axios';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username : "",
    password : "",
    email    : "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8000/api/users/create', formData)
      alert(res.data.message )
    } catch (error) {
      alert(error.response?.data?.message || 'Register failed')
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
          <Typography
            component="h1"
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mt: 1,
            }}
          >
            Sign up
          </Typography>

          <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>
            Sign up to get started.
          </Typography>

          <FormLabel htmlFor="email" sx={{ fontFamily: 'sans-serif', mt: 1 }}>
            Email
          </FormLabel>
          <TextField
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            size='small'
            sx={{
              mt: -1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />

          <FormLabel htmlFor="username" sx={{ fontFamily: 'sans-serif', mt: 2 }}>
            Username
          </FormLabel>
          <TextField
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            size='small'
            sx={{
              mt: -1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />

          <FormLabel htmlFor="password" sx={{ fontFamily: 'sans-serif', mt: 2 }}>
            Password
          </FormLabel>
          <TextField
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            size='small'
            sx={{
              mt: -1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />

          <FormLabel htmlFor="confirm-password" sx={{ fontFamily: 'sans-serif', mt: 2 }}>
            Confirm Password
          </FormLabel>
          <TextField
            id="confirm-password"
            type="password"
            name="confirm-password"
            required
            fullWidth
            variant="outlined"
            size='small'
            sx={{
              mt: -1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleSignup}>
            Sign up
          </Button>

          <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', mt: 2 }}>
            Already have an account?{' '}
            <Link href="/signin" underline="hover">
              Login
            </Link>
          </Typography>
        </Card>
      </Stack>
    </>
  );
}
