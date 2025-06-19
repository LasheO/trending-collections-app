# Trending Collections App

A web application for managing trending collections with user and admin roles.

## Running Tests

### Backend Tests

To run the backend tests:

```bash
cd trending_collections_app/backend
python run_tests.py
```

### Frontend Tests

To run the frontend tests:

```bash
cd trending_collections_app/frontend
npm test
```

To run a specific test file:

```bash
cd trending_collections_app/frontend
npm test -- Dashboard.test.js
```

## Test Coverage

### Backend Tests

The backend tests cover:

1. **API Tests**:
   - User authentication (login, register)
   - Trend CRUD operations (create, read, update, delete)
   - Authorization checks for admin-only operations

2. **Model Tests**:
   - User model (creation, password hashing, admin roles)
   - TrendingCollection model (creation, update, deletion)

### Frontend Tests

The frontend tests cover:

1. **Dashboard Component**:
   - Rendering of dashboard elements
   - Trend filtering and sorting
   - Admin-specific functionality (delete buttons)
   - Form submission

2. **Login Component**:
   - Login form rendering and submission
   - Registration form rendering and submission
   - Error handling
   - Navigation based on user role