import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/Dashboard';

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock data for tests
const mockTrends = [
  {
    id: 1,
    original_query: 'Test Query 1',
    trend_topic: 'Test Topic 1',
    description: 'Test Description 1',
    reformulated_queries: 'Test Reformulated Queries 1',
    category: 'Test Category 1'
  },
  {
    id: 2,
    original_query: 'Test Query 2',
    trend_topic: 'Test Topic 2',
    description: 'Test Description 2',
    reformulated_queries: 'Test Reformulated Queries 2',
    category: 'Test Category 2'
  }
];

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Reset mocks
    fetch.mockReset();
    localStorageMock.getItem.mockReset();
    
    // Mock localStorage.getItem for token
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'isAdmin') return 'false';
      return null;
    });
    
    // Mock successful fetch for trends
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTrends)
      })
    );
  });

  test('renders dashboard with title', async () => {
    render(<Dashboard />);
    
    // Check if the title is rendered
    expect(await screen.findByText('Trending Collections Dashboard')).toBeInTheDocument();
  });

  test('renders create trend form', async () => {
    render(<Dashboard />);
    
    // Check if the form title is rendered
    expect(await screen.findByText('Create New Trend')).toBeInTheDocument();
    
    // Check if form fields are rendered
    expect(screen.getByLabelText(/Original Query/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trend Topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reformulated Queries/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    
    // Check if create button is rendered
    expect(screen.getByText('Create Trend')).toBeInTheDocument();
  });

  test('renders trend cards', async () => {
    render(<Dashboard />);
    
    // Wait for trends to load
    await waitFor(() => {
      expect(screen.getByText('Test Topic 1')).toBeInTheDocument();
      expect(screen.getByText('Test Topic 2')).toBeInTheDocument();
    });
    
    // Check if trend details are rendered
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Reformulated Queries 1')).toBeInTheDocument();
    expect(screen.getByText('Category: Test Category 1')).toBeInTheDocument();
  });

  test('filters trends by query', async () => {
    render(<Dashboard />);
    
    // Wait for trends to load
    await waitFor(() => {
      expect(screen.getByText('Test Topic 1')).toBeInTheDocument();
    });
    
    // Mock filter select change
    const filterSelect = screen.getByLabelText(/Filter by Original Query/i);
    fireEvent.change(filterSelect, { target: { value: 'Test Query 1' } });
    
    // Mock fetch response for filtered trends
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockTrends[0]])
      })
    );
    
    // Check if only the filtered trend is rendered
    await waitFor(() => {
      expect(screen.getByText('Test Topic 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Topic 2')).not.toBeInTheDocument();
    });
  });

  test('sorts trends alphabetically', async () => {
    render(<Dashboard />);
    
    // Wait for trends to load
    await waitFor(() => {
      expect(screen.getByText('Test Topic 1')).toBeInTheDocument();
    });
    
    // Click sort button
    const sortButton = screen.getByText(/Sort/i);
    fireEvent.click(sortButton);
    
    // Check if sort order changes
    expect(screen.getByText('Sort Z-A')).toBeInTheDocument();
  });

  test('shows edit button for trends', async () => {
    render(<Dashboard />);
    
    // Wait for trends to load
    await waitFor(() => {
      expect(screen.getByText('Test Topic 1')).toBeInTheDocument();
    });
    
    // Check if edit buttons are rendered
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons.length).toBe(2);
  });

  test('admin sees delete buttons', async () => {
    // Mock admin status
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'isAdmin') return 'true';
      return null;
    });
    
    render(<Dashboard />);
    
    // Wait for trends to load
    await waitFor(() => {
      expect(screen.getByText('Test Topic 1')).toBeInTheDocument();
    });
    
    // Check if delete buttons are rendered for admin
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons.length).toBe(2);
  });
});