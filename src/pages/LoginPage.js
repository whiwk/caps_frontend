import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const defaultTheme = createTheme();

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Welcome Back!';
  if (hour < 18) return `Let's Get Started!`;
  return 'Ready to Dive in?';
};

export default function SignInSide() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formError, setFormError] = useState({
    username: '',
    password: ''
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    let hasError = false;

    // Reset errors
    setFormError({ username: '', password: '' });
    setApiError('');

    if (!username) {
      setFormError(prev => ({ ...prev, username: 'Username must be filled out' }));
      hasError = true;
    }
    if (!password) {
      setFormError(prev => ({ ...prev, password: 'Password must be filled out' }));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await axios.post('http://10.30.1.221:8000/api/v1/token/access/', {
        username,
        password
      });

      localStorage.setItem('authToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      if (response.data.is_staff === true) {
        navigate('/user-management'); // Redirect admin to user management page
      } else {
        navigate('/introduction'); // Redirect common user to introduction page
      } 
    } catch (error) {
      setLoading(false);
      if (error.code === 'ERR_CONNECTION_ABORTED' || error.message.includes('timeout')) {
        setApiError('The server is not responding, please try again later.');
      } else if (error.message === 'Network Error' && !error.response) {
        setApiError('Network error: Please check your internet connection.');
      } else if (error.response && error.response.status === 401) {
        setApiError('Invalid credentials');
        setUsername('');
        setPassword('');
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/login-bg3.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
          <Avatar sx={{ m: 1, bgcolor: 'ffffff' }} src="/padlock.png">
            {/* If the image fails to load, LockOutlinedIcon will show as a fallback */}
            <LockOutlinedIcon />
          </Avatar>

            <Typography component="h1" variant="h4" sx={{
              mt: 1,
              animation: 'fadeIn 6s',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                },
                '100%': {
                  opacity: 1,
                },
              }
            }}>
              {/* Let’s Get Started! */}
              {getGreeting()}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, mx: 4, width: '100%', maxWidth: '500px' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!formError.username}
                helperText={formError.username}
                style={{borderRadius: '26px'}}
                sx={{ borderRadius: '26px', '& .MuiOutlinedInput-root': { borderRadius: '26px' } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!formError.password}
                helperText={formError.password}
                sx={{ borderRadius: '26px', '& .MuiOutlinedInput-root': { borderRadius: '26px' } }}
              />
              <Typography color="error" sx={{ mt: 1, height: '24px', visibility: apiError ? 'visible' : 'hidden' }}>
                {apiError || ' '}
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 2,
                  backgroundColor: '#30475E',  // Dark blue background or choose another if you like
                  color: '#fff',  // Setting the font color to orange
                  '&:hover': {
                    backgroundColor: '#27323A',  // Darker shade for hover
                    color: '#fff'  // Keep the font color orange even on hover
                  },
                  borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' }
                }}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
