import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7192/api/v1/auth/login', {
        usuario: username,
        contrasena: password,
      });

      if (response.status === 200) {
        console.log('Login exitoso', response.data);

        localStorage.setItem('authToken', response.data.token);

  
        window.location.href = '/home';
      }
    } catch (error) {
      console.error('Error en el login:', error.response || error.message);

      setErrorMessage(error.response?.data?.message || 'Credenciales incorrectas o error en el servidor.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={5}>
        <Typography variant="h5" gutterBottom>
          Login - Beef and Beer
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth color="primary" mt={2}>
            Login
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={errorMessage}
        />
      </Box>
    </Container>
  );
};

export default Login;
