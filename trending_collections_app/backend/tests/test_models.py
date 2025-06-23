import unittest
import sys
import os
from datetime import datetime

# Add the parent directory to the path so we can import the app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app, db
from models import User, TrendingCollection

class ModelsTestCase(unittest.TestCase):
    def setUp(self):
        """Set up test environment before each test"""
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        
        with self.app.app_context():
            db.create_all()
    
    def tearDown(self):
        """Clean up after each test"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_user_creation(self):
        """Test user creation and password hashing"""
        with self.app.app_context():
            user = User(email='test@example.com', is_admin=False)
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
            
            # Retrieve the user and check attributes
            retrieved_user = User.query.filter_by(email='test@example.com').first()
            self.assertIsNotNone(retrieved_user)
            self.assertEqual(retrieved_user.email, 'test@example.com')
            self.assertFalse(retrieved_user.is_admin)
            self.assertTrue(retrieved_user.check_password('password123'))
            self.assertFalse(retrieved_user.check_password('wrongpassword'))
    
    def test_admin_user(self):
        """Test admin user creation"""
        with self.app.app_context():
            admin = User(email='admin@example.com', is_admin=True)
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            
            # Retrieve the admin and check attributes
            retrieved_admin = User.query.filter_by(email='admin@example.com').first()
            self.assertIsNotNone(retrieved_admin)
            self.assertEqual(retrieved_admin.email, 'admin@example.com')
            self.assertTrue(retrieved_admin.is_admin)
    
    def test_trend_creation(self):
        """Test trend creation and retrieval"""
        with self.app.app_context():
            trend = TrendingCollection(
                original_query='Test Query',
                trend_topic='Test Topic',
                description='Test Description',
                reformulated_queries='Test Reformulated Queries',
                category='Test Category'
            )
            db.session.add(trend)
            db.session.commit()
            
            # Retrieve the trend and check attributes
            retrieved_trend = TrendingCollection.query.filter_by(trend_topic='Test Topic').first()
            self.assertIsNotNone(retrieved_trend)
            self.assertEqual(retrieved_trend.original_query, 'Test Query')
            self.assertEqual(retrieved_trend.trend_topic, 'Test Topic')
            self.assertEqual(retrieved_trend.description, 'Test Description')
            self.assertEqual(retrieved_trend.reformulated_queries, 'Test Reformulated Queries')
            self.assertEqual(retrieved_trend.category, 'Test Category')
    
    def test_trend_update(self):
        """Test trend update"""
        with self.app.app_context():
            trend = TrendingCollection(
                original_query='Test Query',
                trend_topic='Test Topic',
                description='Test Description',
                reformulated_queries='Test Reformulated Queries',
                category='Test Category'
            )
            db.session.add(trend)
            db.session.commit()
            
            # Update the trend
            trend.trend_topic = 'Updated Topic'
            trend.description = 'Updated Description'
            db.session.commit()
            
            # Retrieve the trend and check updated attributes
            retrieved_trend = TrendingCollection.query.filter_by(original_query='Test Query').first()
            self.assertEqual(retrieved_trend.trend_topic, 'Updated Topic')
            self.assertEqual(retrieved_trend.description, 'Updated Description')
    
    def test_trend_deletion(self):
        """Test trend deletion"""
        with self.app.app_context():
            trend = TrendingCollection(
                original_query='Test Query',
                trend_topic='Test Topic',
                description='Test Description',
                reformulated_queries='Test Reformulated Queries',
                category='Test Category'
            )
            db.session.add(trend)
            db.session.commit()
            
            # Delete the trend
            db.session.delete(trend)
            db.session.commit()
            
            # Try to retrieve the deleted trend
            retrieved_trend = TrendingCollection.query.filter_by(trend_topic='Test Topic').first()
            self.assertIsNone(retrieved_trend)

if __name__ == '__main__':
    unittest.main()