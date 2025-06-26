from app import app, db
from models import User

def create_admin(email, password):
    with app.app_context():
        # Check if admin already exists
        existing_admin = User.query.filter_by(email=email).first()
        if existing_admin:
            print(f"Admin user {email} already exists")
            return

        # Create new admin user
        admin = User(email=email, is_admin=True)
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"Admin user {email} created successfully")

if __name__ == "__main__":
    admin_email = "admin"
    admin_password = "adminpassword123"
    create_admin(admin_email, admin_password)
