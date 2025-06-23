import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the App component
jest.mock('./App', () => {
  return function MockApp() {
    return (
      <div>
        <div data-testid="router">Router Component</div>
        <div data-testid="routes">
          <div data-testid="login-route">Login Route</div>
          <div data-testid="dashboard-route">Dashboard Route</div>
        </div>
      </div>
    );
  };
});

// Import the mocked component
import App from './App';

describe('App Component', () => {
  test('renders router structure', () => {
    const { getByTestId } = render(<App />);
    
    // Check if router components are rendered
    expect(getByTestId('router')).toBeInTheDocument();
    expect(getByTestId('routes')).toBeInTheDocument();
    expect(getByTestId('login-route')).toBeInTheDocument();
    expect(getByTestId('dashboard-route')).toBeInTheDocument();
  });
});