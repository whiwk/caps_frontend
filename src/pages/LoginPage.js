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
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from 'react-helmet';
import api from '../services/apiService';

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
      const response = await api.post('token/access/', {
        username,
        password
      });

      localStorage.setItem('authToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      if (response.data.is_staff === true) {
        navigate('/admin/user-management'); // Redirect admin to user management page
      } else {
        navigate('/introduction/orca'); // Redirect common user to introduction page
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
      <Helmet>
        <title>Orca | Login</title>
      </Helmet>
      <Grid container component="main" sx={{ height: '100vh', position: 'relative' }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sx={{
            backgroundImage: 'url(/login-orca-full-min.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        />
        <Grid 
          item 
          xs={12} 
          sm={8} 
          md={5} 
          component={Paper} 
          elevation={6} 
          square
          sx={{ 
            borderRadius: '16px',
            margin: 'auto',
            maxWidth: '360px',
            zIndex: 1,
            position: 'relative',
            marginLeft: 'auto',
            marginRight: '50px',
          }} 
        >
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
              color: '#19686F',
              fontWeight: 700,
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
                sx={{ borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
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
                sx={{ borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
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
                  backgroundColor: '#19686F',  // Dark blue background or choose another if you like
                  color: '#fff',  // Setting the font color to orange
                  '&:hover': {
                    backgroundColor: '#083E4A',  // Darker shade for hover
                    color: '#fff'  // Keep the font color orange even on hover
                  },
                  borderRadius: '16px', '& .MuiOutlinedInput-root': { borderRadius: '16px' }
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
