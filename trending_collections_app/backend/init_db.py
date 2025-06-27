from app import app, db
from models import User, TrendingCollection

# Sample trend data - 10 records
trend_data = [
    {
        "original_query": "Socks for Men",
        "trend_topic": "Star Wars Argyle",
        "description": "Navy argyle stripe pattern inspired by iconic Star Wars characters.",
        "reformulated_queries": "Men's Star Wars Argyle Socks, Navy Argyle Socks Inspired by Star Wars, Star Wars Character Navy Argyle Socks",
        "category": "Movie Theme"
    },
    {
        "original_query": "Socks for Men",
        "trend_topic": "Gaming Patterns",
        "description": "Colorful socks featuring retro gaming and console designs.",
        "reformulated_queries": "Gaming Console Socks, Retro Game Pattern Socks, Video Game Theme Socks",
        "category": "Gaming Theme"
    },
    {
        "original_query": "Shoes for Women",
        "trend_topic": "Ballet Flats",
        "description": "Comfortable ballet flats with memory foam for everyday wear.",
        "reformulated_queries": "Memory Foam Ballet Flats, Comfortable Women's Flats, Daily Wear Ballet Shoes",
        "category": "Comfort Footwear"
    },
    {
        "original_query": "Shoes for Women",
        "trend_topic": "Animal Print Boots",
        "description": "Trendy ankle boots featuring various animal print patterns.",
        "reformulated_queries": "Leopard Print Ankle Boots, Snake Pattern Women's Boots, Animal Print Fashion Boots",
        "category": "Fashion Footwear"
    },
    {
        "original_query": "Running Shoes",
        "trend_topic": "Neon Trainers",
        "description": "High-visibility neon running shoes for safety and style.",
        "reformulated_queries": "Neon Yellow Running Shoes, Bright Orange Trainers, High Visibility Running Footwear",
        "category": "Athletic Wear"
    },
    {
        "original_query": "Running Shoes",
        "trend_topic": "Trail Runners",
        "description": "Durable trail running shoes with enhanced grip and protection.",
        "reformulated_queries": "Off-Road Running Shoes, Mountain Trail Runners, Grip Enhanced Trail Shoes",
        "category": "Athletic Wear"
    },
    {
        "original_query": "Winter Boots",
        "trend_topic": "Faux Fur Lined",
        "description": "Warm winter boots with faux fur lining and waterproof exterior.",
        "reformulated_queries": "Fur Lined Snow Boots, Warm Winter Footwear, Waterproof Fur Boots",
        "category": "Winter Wear"
    },
    {
        "original_query": "Winter Boots",
        "trend_topic": "Urban Hiker",
        "description": "Stylish hiking-inspired boots for urban winter wear.",
        "reformulated_queries": "City Hiking Boots, Urban Winter Boots, Street Style Hiking Boots",
        "category": "Fashion Footwear"
    },
    {
        "original_query": "Dress Shoes",
        "trend_topic": "Vintage Oxfords",
        "description": "Classic oxford shoes with vintage-inspired detailing.",
        "reformulated_queries": "Retro Oxford Shoes, Classic Dress Oxfords, Vintage Style Formal Shoes",
        "category": "Formal Wear"
    },
    {
        "original_query": "Dress Shoes",
        "trend_topic": "Modern Loafers",
        "description": "Contemporary loafers with sleek design and comfort features.",
        "reformulated_queries": "Modern Slip-On Loafers, Contemporary Dress Shoes, Comfortable Formal Loafers",
        "category": "Formal Wear"
    }
]

def init_db():
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if admin user exists
        if not User.query.filter_by(email='admin@example.com').first():
            # Create admin user
            admin = User(email='admin@example.com', is_admin=True)
            admin.set_password('adminpassword123')
            db.session.add(admin)
            
            # Create regular user
            user = User(email='user@example.com', is_admin=False)
            user.set_password('userpassword123')
            db.session.add(user)
            
            db.session.commit()
            print("Users created successfully")
        else:
            print("Users already exist")
        
        # Check if trends exist
        if TrendingCollection.query.count() == 0:
            # Add sample trends
            for trend in trend_data:
                new_trend = TrendingCollection(
                    original_query=trend['original_query'],
                    trend_topic=trend['trend_topic'],
                    description=trend['description'],
                    reformulated_queries=trend['reformulated_queries'],
                    category=trend['category']
                )
                db.session.add(new_trend)
            
            db.session.commit()
            print(f"Added {len(trend_data)} sample trends")
        else:
            print(f"Trends already exist ({TrendingCollection.query.count()} records)")

if __name__ == "__main__":
    init_db()