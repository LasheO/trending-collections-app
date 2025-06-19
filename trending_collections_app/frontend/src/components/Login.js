/**
 * Login Component
 * 
 * This component handles both user authentication (login) and registration.
 * It provides a clean UI with form validation and feedback messages.
 * 
 * Features:
 * - Toggle between login and registration modes
 * - Form validation and error handling
 * - Success/error notifications
 * - JWT token storage for authentication
 * - Role-based redirection (admin vs standard user)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  Box,
  Alert,
  InputAdornment
} from '@mui/material';
import { Person, Lock } from '@mui/icons-material';

function Login() {
  // Navigation hook for redirecting after login
  const navigate = useNavigate();
  
  // State variables for component
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login/register modes
  const [email, setEmail] = useState('');        // User email/username input
  const [password, setPassword] = useState('');  // User password input
  const [errorMessage, setErrorMessage] = useState('');    // Error message display
  const [successMessage, setSuccessMessage] = useState(''); // Success message display
  const [isLoading, setIsLoading] = useState(false);       // Loading state for form submission

  /**
   * Handle form submission for both login and registration
   * 
   * This function:
   * 1. Prevents default form submission behavior
   * 2. Sets loading state and clears any previous messages
   * 3. Sends authentication request to the appropriate endpoint
   * 4. Handles the response (success or error)
   * 5. For successful login: stores JWT token and redirects based on user role
   * 6. For successful registration: shows success message and switches to login mode
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      // Send authentication request to backend
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          // Store authentication data in localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('isAdmin', data.is_admin);
          setSuccessMessage('Login successful! Redirecting...');
          
          // Delay navigation to show success message to user
          setTimeout(() => {
            // Role-based navigation
            if (data.is_admin) {
              navigate('/admin-dashboard');
            } else {
              navigate('/dashboard');
            }
          }, 1500);
        } else {
          // Handle successful registration
          setSuccessMessage('Registration successful! Please login.');
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage('');
          }, 1500);
        }
      } else {
        // Handle error response from server
        setErrorMessage(data.error || 'An error occurred');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
      setErrorMessage('Error connecting to backend');
    } finally {
      // Reset loading state regardless of outcome
      setIsLoading(false);
    }
  };

  /**
   * Toggle between login and registration modes
   * 
   * This function:
   * 1. Toggles the isLogin state
   * 2. Clears any existing error or success messages
   * This provides a clean state when switching between modes
   */
  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Render the login/registration form with appropriate styling and feedback
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/images/background.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            width: '100%',
            maxWidth: '450px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            {isLogin ? 'Login' : 'Register'}
          </Typography>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: '10px' }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mt: 2, mb: 2, borderRadius: '10px' }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography 
              variant="h6"
              sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: '1.3rem',
                letterSpacing: '0.5px'
              }}
            >
              Username
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your username"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': { color: 'rgba(255, 255, 255, 0.7)' },
                },
              }}
            />
            <Typography 
              variant="h6"
              sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 2,
                fontSize: '1.3rem',
                letterSpacing: '0.5px'
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="Enter your password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': { color: 'rgba(255, 255, 255, 0.7)' },
                },
              }}
            />
            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              disabled={isLoading}
              sx={{ 
                mt: 3,
                borderRadius: '10px',
                backgroundColor: 'white',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
            </Button>
          </form>
          <Box mt={2} textAlign="center">
            <Button 
              onClick={handleModeSwitch}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;