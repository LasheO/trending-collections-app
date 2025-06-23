import unittest
import json
import sys
import os
from datetime import datetime

# Add the parent directory to the path so we can import the app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app, db
from models import User, TrendingCollection

class ApiTestCase(unittest.TestCase):
    def setUp(self):
        """Set up test environment before each test"""
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()
            
            # Create test user
            test_user = User(email='test@example.com', is_admin=False)
            test_user.set_password('password123')
            
            # Create admin user
            admin_user = User(email='admin@example.com', is_admin=True)
            admin_user.set_password('admin123')
            
            # Create test trend
            test_trend = TrendingCollection(
                original_query='Test Query',
                trend_topic='Test Topic',
                description='Test Description',
                reformulated_queries='Test Reformulated Queries',
                category='Test Category'
            )
            
            db.session.add(test_user)
            db.session.add(admin_user)
            db.session.add(test_trend)
            db.session.commit()
    
    def tearDown(self):
        """Clean up after each test"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
    
    def get_auth_token(self, is_admin=False):
        """Helper method to get auth token"""
        email = 'admin@example.com' if is_admin else 'test@example.com'
        password = 'admin123' if is_admin else 'password123'
        
        response = self.client.post('/api/login', 
            json={'email': email, 'password': password})
        return json.loads(response.data)['token']
    
    def test_login_success(self):
        """Test successful login"""
        response = self.client.post('/api/login', 
            json={'email': 'test@example.com', 'password': 'password123'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertFalse(data['is_admin'])
    
    def test_login_admin(self):
        """Test admin login"""
        response = self.client.post('/api/login', 
            json={'email': 'admin@example.com', 'password': 'admin123'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertTrue(data['is_admin'])
    
    def test_login_failure(self):
        """Test login with incorrect credentials"""
        response = self.client.post('/api/login', 
            json={'email': 'test@example.com', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, 401)
    
    def test_register_success(self):
        """Test successful registration"""
        response = self.client.post('/api/register', 
            json={'email': 'new@example.com', 'password': 'newpassword123'})
        self.assertEqual(response.status_code, 201)
    
    def test_register_duplicate(self):
        """Test registration with existing email"""
        response = self.client.post('/api/register', 
            json={'email': 'test@example.com', 'password': 'password123'})
        self.assertEqual(response.status_code, 400)
    
    def test_get_trends_authenticated(self):
        """Test getting trends with authentication"""
        token = self.get_auth_token()
        response = self.client.get('/api/trends', 
            headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(isinstance(data, list))
        self.assertEqual(len(data), 1)
    
    def test_get_trends_unauthenticated(self):
        """Test getting trends without authentication"""
        response = self.client.get('/api/trends')
        self.assertEqual(response.status_code, 401)
    
    def test_create_trend(self):
        """Test creating a new trend"""
        token = self.get_auth_token()
        new_trend = {
            'original_query': 'New Query',
            'trend_topic': 'New Topic',
            'description': 'New Description',
            'reformulated_queries': 'New Reformulated Queries',
            'category': 'New Category'
        }
        response = self.client.post('/api/trends', 
            json=new_trend,
            headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 201)
    
    def test_update_trend(self):
        """Test updating a trend"""
        token = self.get_auth_token()
        # First get the trend ID
        response = self.client.get('/api/trends', 
            headers={'Authorization': f'Bearer {token}'})
        trends = json.loads(response.data)
        trend_id = trends[0]['id']
        
        # Update the trend
        updated_trend = {
            'original_query': 'Updated Query',
            'trend_topic': 'Updated Topic',
            'description': 'Updated Description',
            'reformulated_queries': 'Updated Reformulated Queries',
            'category': 'Updated Category'
        }
        response = self.client.put(f'/api/trends/{trend_id}', 
            json=updated_trend,
            headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)
    
    def test_delete_trend_as_admin(self):
        """Test deleting a trend as admin"""
        token = self.get_auth_token(is_admin=True)
        # First get the trend ID
        response = self.client.get('/api/trends', 
            headers={'Authorization': f'Bearer {token}'})
        trends = json.loads(response.data)
        trend_id = trends[0]['id']
        
        # Delete the trend
        response = self.client.delete(f'/api/trends/{trend_id}', 
            headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)
    
    def test_delete_trend_as_user(self):
        """Test deleting a trend as regular user (should fail)"""
        token = self.get_auth_token(is_admin=False)
        # First get the trend ID
        response = self.client.get('/api/trends', 
            headers={'Authorization': f'Bearer {token}'})
        trends = json.loads(response.data)
        trend_id = trends[0]['id']
        
        # Try to delete the trend
        response = self.client.delete(f'/api/trends/{trend_id}', 
            headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 403)

if __name__ == '__main__':
    unittest.main()