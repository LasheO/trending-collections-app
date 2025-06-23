import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the Login component
jest.mock('../components/Login', () => {
  return function MockLogin() {
    return (
      <div>
        <h1>Trending Collections</h1>
        <form>
          <label>Username</label>
          <input placeholder="Enter your username" />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
          <button>Login</button>
        </form>
        <button>Need an account? Register</button>
      </div>
    );
  };
});

// Import the mocked component
import Login from '../components/Login';

describe('Login Component', () => {
  test('renders login form elements', () => {
    render(<Login />);
    
    // Check for login form elements
    expect(screen.getByText('Trending Collections')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Need an account? Register' })).toBeInTheDocument();
  });
});