from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
class TrendingCollection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_query = db.Column(db.String(200), nullable=False)
    trend_topic = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    reformulated_queries = db.Column(db.Text, nullable=False)  # Store as comma-separated string
    category = db.Column(db.String(100))  # Optional category field
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
