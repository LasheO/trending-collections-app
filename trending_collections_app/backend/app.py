"""
Trending Collections API Backend

This module provides the REST API endpoints for the Trending Collections application.
It handles user authentication, authorization, and CRUD operations for trending collections.

The application uses:
- Flask for the web framework
- SQLAlchemy for database operations
- JWT for authentication
- CORS for cross-origin resource sharing

Author: Lashe Onamusi
Date: [16/06/25]
"""

import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from models import db, User, TrendingCollection
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError, JWTDecodeError
import re

# Initialize Flask application
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)  # Enable Cross-Origin Resource Sharing

# Application Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # SQLite database path
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')  # JWT secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False    # Tokens don't expire (for development)
db.init_app(app)  # Initialize database with app
jwt = JWTManager(app)  # Initialize JWT manager

# Email validation pattern
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

# Create database tables if they don't exist
with app.app_context():
    db.create_all()

# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    """
    User Registration Endpoint
    
    Registers a new user in the system with the provided email and password.
    Checks if the email is already registered before creating a new user.
    Validates email format.
    
    Request body:
    {
        "email": "user@example.com",
        "password": "user_password"
    }
    
    Returns:
        201: User registered successfully
        400: Email already registered or invalid email format
    """
    data = request.get_json()
    
    # Validate email format
    if not EMAIL_PATTERN.match(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Check if email is already registered
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    # Create new user
    user = User(email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    """
    User Login Endpoint
    
    Authenticates a user with email and password.
    If successful, returns a JWT token and user role information.
    
    Request body:
    {
        "email": "user@example.com",
        "password": "user_password"
    }
    
    Returns:
        200: {token, is_admin} - Authentication successful
        400: Invalid email format
        401: Invalid credentials
    """
    data = request.get_json()
    
    # Validate email format
    if not EMAIL_PATTERN.match(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    # Verify user credentials
    if user and user.check_password(data['password']):
        # Create JWT token with user email as identity
        access_token = create_access_token(identity=user.email)
        return jsonify({
            'token': access_token,
            'is_admin': user.is_admin
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/trends', methods=['GET'])
@jwt_required()
def get_trends():
    try:
        current_user = get_jwt_identity()
        trends = TrendingCollection.query.all()
        return jsonify([{
            'id': trend.id,
            'original_query': trend.original_query,
            'trend_topic': trend.trend_topic,
            'description': trend.description,
            'reformulated_queries': trend.reformulated_queries,
            'category': trend.category,
            'created_at': trend.created_at.isoformat() if trend.created_at else None,
            'updated_at': trend.updated_at.isoformat() if trend.updated_at else None
        } for trend in trends])
    except Exception as e:
        print(f"Error in get_trends: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/trends/<int:trend_id>', methods=['GET'])
@jwt_required()
def get_trend(trend_id):
    try:
        trend = TrendingCollection.query.get(trend_id)
        if not trend:
            return jsonify({'error': 'Trend not found'}), 404
            
        return jsonify({
            'id': trend.id,
            'original_query': trend.original_query,
            'trend_topic': trend.trend_topic,
            'description': trend.description,
            'reformulated_queries': trend.reformulated_queries,
            'category': trend.category,
            'created_at': trend.created_at.isoformat() if trend.created_at else None,
            'updated_at': trend.updated_at.isoformat() if trend.updated_at else None
        })
    except Exception as e:
        print(f"Error in get_trend: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/trends', methods=['POST'])
@jwt_required()
def create_trend():
    try:
        data = request.get_json()
        new_trend = TrendingCollection(
            original_query=data['original_query'],
            trend_topic=data['trend_topic'],
            description=data['description'],
            reformulated_queries=data['reformulated_queries'],
            category=data.get('category', '')
        )
        db.session.add(new_trend)
        db.session.commit()
        
        return jsonify({
            'message': 'Trend created successfully',
            'id': new_trend.id
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error in create_trend: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/trends/<int:trend_id>', methods=['PUT'])
@jwt_required()
def update_trend(trend_id):
    try:
        trend = TrendingCollection.query.get(trend_id)
        if not trend:
            return jsonify({'error': 'Trend not found'}), 404
            
        data = request.get_json()
        trend.original_query = data.get('original_query', trend.original_query)
        trend.trend_topic = data.get('trend_topic', trend.trend_topic)
        trend.description = data.get('description', trend.description)
        trend.reformulated_queries = data.get('reformulated_queries', trend.reformulated_queries)
        trend.category = data.get('category', trend.category)
        
        db.session.commit()
        return jsonify({'message': 'Trend updated successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Error in update_trend: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/trends/<int:trend_id>', methods=['DELETE'])
@jwt_required()
def delete_trend(trend_id):
    """
    Delete Trend Endpoint
    
    Deletes a specific trend by ID.
    This operation requires admin privileges.
    
    Parameters:
        trend_id (int): The ID of the trend to delete
        
    Returns:
        200: Trend deleted successfully
        403: Admin privileges required
        404: Trend not found
        500: Server error
    """
    try:
        # Role-based access control - only admins can delete
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin privileges required for deletion'}), 403
        
        # Find and delete the trend    
        trend = TrendingCollection.query.get(trend_id)
        if not trend:
            return jsonify({'error': 'Trend not found'}), 404
            
        db.session.delete(trend)
        db.session.commit()
        return jsonify({'message': 'Trend deleted successfully'})
    except Exception as e:
        # Roll back transaction on error
        db.session.rollback()
        print(f"Error in delete_trend: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/test-trends', methods=['GET'])
def test_trends():
    try:
        trends = TrendingCollection.query.all()
        return jsonify([{
            'id': trend.id,
            'original_query': trend.original_query,
            'trend_topic': trend.trend_topic,
            'description': trend.description,
            'reformulated_queries': trend.reformulated_queries,
            'category': trend.category
        } for trend in trends])
    except Exception as e:
        print(f"Error in test_trends: {str(e)}")  # Server-side logging
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running"""
    try:
        # Check if we can connect to the database
        db_ok = False
        try:
            db.session.execute('SELECT 1')
            db_ok = True
        except Exception as e:
            print(f"Database error: {str(e)}")
        
        # Check if static files exist
        index_path = os.path.join(app.static_folder, 'index.html')
        static_ok = os.path.exists(index_path)
        
        # List files in static folder
        try:
            static_files = os.listdir(app.static_folder)
        except:
            static_files = []
        
        return jsonify({
            'status': 'ok',
            'database': db_ok,
            'static_files': static_ok,
            'static_path': app.static_folder,
            'index_path': index_path,
            'static_files_list': static_files
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Serve static files
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# Serve React App - catch-all route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # For API routes, let them be handled by the appropriate route handlers
    if path.startswith('api/'):
        return {"error": "Not found"}, 404
        
    # For all other routes, serve the React app's index.html
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        print(f"Error serving index.html: {str(e)}")
        return f"Error serving application: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True)