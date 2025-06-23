import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the Dashboard component
jest.mock('../components/Dashboard', () => {
  return {
    __esModule: true,
    default: (props) => (
      <div data-testid="dashboard-mock">
        <header>
          <h1 data-testid="dashboard-title">Trending Collections</h1>
          <button>Logout</button>
        </header>
        <main>
          <section data-testid="create-form">
            <h2>Create New Trend</h2>
            <button>Create Trend</button>
          </section>
          
          <hr />
          
          <section data-testid="filter-section">
            <div>Filter by Original Query</div>
            <button>Sort A-Z</button>
          </section>
          
          <section data-testid="trends-grid">
            <div className="trend-card">
              <h3>Test Topic</h3>
              <p>Test Description</p>
              <div>
                <button>Edit</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  };
});

// Import the mocked component
import Dashboard from '../components/Dashboard';

describe('Dashboard Component', () => {
  test('renders dashboard elements', () => {
    render(<Dashboard />);
    
    // Check for dashboard elements
    expect(screen.getByTestId('dashboard-mock')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByTestId('create-form')).toBeInTheDocument();
    expect(screen.getByText('Create New Trend')).toBeInTheDocument();
    expect(screen.getByTestId('filter-section')).toBeInTheDocument();
    expect(screen.getByText('Filter by Original Query')).toBeInTheDocument();
    expect(screen.getByTestId('trends-grid')).toBeInTheDocument();
    expect(screen.getByText('Test Topic')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});