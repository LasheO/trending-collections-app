# Trending Collections App

A web application for managing trending collections with user and admin roles.

## Live Demo

The application is deployed and accessible at: [https://trending-collections-app.onrender.com/](https://trending-collections-app.onrender.com/)

### Demo Credentials
- Regular user: user@example.com / userpassword123
- Admin user: admin@example.com / adminpassword123

## Features

- User authentication with role-based access control
- Create, view, edit, and delete trending collections
- Filter and sort functionality for easy data management
- Responsive design for desktop and mobile use

## Local Development

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
   python init_db.py
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

## Deployment

The application is deployed on Render.com as a single web service that serves both the backend API and frontend static files. The deployment process:

1. Builds the React frontend
2. Copies the built files to the Flask backend's static directory
3. Initializes the database with sample data
4. Starts the Flask application with Gunicorn

## Troubleshooting

- For database issues in the deployed application, check the application logs on Render.com
- If the application shows a blank screen, try clearing your browser cache or opening in an incognito window
- For local development issues, ensure all dependencies are installed and ports are available