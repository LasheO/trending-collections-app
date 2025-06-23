import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a simple component to test admin features
const AdminFeatures = ({ isAdmin }) => (
  <div>
    <h1>{isAdmin ? 'Admin Dashboard' : 'User Dashboard'}</h1>
    <div>
      <button>Edit</button>
      {isAdmin && <button>Delete</button>}
    </div>
  </div>
);

describe('Admin Features', () => {
  test('shows admin features when user is admin', () => {
    render(<AdminFeatures isAdmin={true} />);
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  
  test('hides admin features when user is not admin', () => {
    render(<AdminFeatures isAdmin={false} />);
    
    expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});