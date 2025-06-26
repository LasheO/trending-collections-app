# Trending Collections App

A web application for managing trending collections with user and admin roles.

## Features

- User authentication with role-based access control
- Create, view, edit, and delete trending collections
- Filter and sort functionality for easy data management
- Responsive design for desktop and mobile use

## Running the Application

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm 6 or higher

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd trending_collections_app/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   python populate_db.py
   ```

5. Start the backend server:
   ```bash
   python app.py
   ```
   The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd trending_collections_app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on http://localhost:3000

### Accessing the Application

1. Open a web browser and navigate to http://localhost:3000
2. Login with the following credentials:
   - Regular user: user@example.com / password123
   - Admin user: admin@example.com / admin123

## Running Tests

### Backend Tests

1. Set up the test environment:
   ```bash
   cd trending_collections_app/backend
   ./setup_tests.sh
   source venv/bin/activate
   ```

2. Run the tests:
   ```bash
   python run_tests.py
   ```

3. Alternatively, use pytest directly:
   ```bash
   pytest -v
   ```

### Frontend Tests

1. Run all tests:
   ```bash
   cd trending_collections_app/frontend
   ./run_tests.sh
   ```

2. Run a specific test file:
   ```bash
   cd trending_collections_app/frontend
   npm test -- Dashboard.test.js
   ```

3. Run tests in interactive mode:
   ```bash
   cd trending_collections_app/frontend
   npm test
   ```

## Test Coverage

### Backend Tests

The backend tests cover:
- API endpoints for authentication, trend creation, retrieval, updating, and deletion
- User model functionality including password hashing and verification
- TrendingCollection model operations
- Role-based access control for admin-only operations

### Frontend Tests

The frontend tests cover:
- Component rendering and functionality
- User interactions like filtering and sorting
- Form validation and submission
- Admin-specific feature visibility

## Troubleshooting

- If the backend fails to start, ensure that port 5000 is not in use by another application
- If the frontend fails to connect to the backend, verify that the backend server is running and accessible
- For database issues, try removing the app.db file and running populate_db.py again to recreate the database
- If tests fail with dependency errors, ensure all required packages are installed