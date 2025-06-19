import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Login Component', () => {
  beforeEach(() => {
    // Reset mocks
    fetch.mockReset();
    mockNavigate.mockReset();
    localStorageMock.setItem.mockReset();
    
    // Mock successful fetch for login
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token', is_admin: false })
      })
    );
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Check if login form elements are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('Need an account? Register')).toBeInTheDocument();
  });

  test('switches to register mode', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Click register link
    fireEvent.click(screen.getByText('Need an account? Register'));
    
    // Check if mode switched to register
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
  });

  test('handles login submission', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'test@example.com', 
          password: 'password123' 
        }),
      });
    });
    
    // Check if token was stored in localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'fake-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('isAdmin', false);
    
    // Check if navigation occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles admin login', async () => {
    // Mock admin login response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'admin-token', is_admin: true })
      })
    );
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'admin@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'admin123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    // Check if token was stored in localStorage with admin flag
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'admin-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isAdmin', true);
    });
    
    // Check if navigation occurred to admin dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });
  });

  test('handles login failure', async () => {
    // Mock failed login response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      })
    );
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    
    // Check that navigation did not occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles registration submission', async () => {
    // Mock successful registration response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Registration successful' })
      })
    );
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Switch to register mode
    fireEvent.click(screen.getByText('Need an account? Register'));
    
    // Fill in registration form
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'new@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'newpassword123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'new@example.com', 
          password: 'newpassword123' 
        }),
      });
    });
    
    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Registration successful! Please login.')).toBeInTheDocument();
    });
  });
});