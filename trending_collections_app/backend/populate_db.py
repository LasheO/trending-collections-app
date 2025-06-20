from app import app, db
from models import TrendingCollection

trend_data = [
    {
        "original_query": "Socks for Men",
        "trend_topic": "Star Wars Argyle",
        "description": "Navy argyle stripe pattern inspired by iconic Star Wars characters.",
        "reformulated_queries": """Men's Star Wars Argyle Socks, Navy Argyle Socks Inspired by Star Wars, 
            Star Wars Character Navy Argyle Socks, Men's Yoda Argyle Socks Navy, Darth Vader Navy Argyle Socks, 
            Navy Argyle Socks with Star Wars Logo""",
        "category": "Movie Theme"
    },
    {
        "original_query": "Socks for Men",
        "trend_topic": "Superhero Ankle",
        "description": "White ankle socks featuring symbols of popular superheroes.",
        "reformulated_queries": """White Ankle Socks Superman, Men's Ankle Socks Marvel, 
            DC Ankle Socks For Men, Batman White Ankle Socks, Superhero Themed Ankle Socks""",
        "category": "Superhero Theme"
    },
    {
        "original_query": "Shoes for Women",
        "trend_topic": "Ballet Flats",
        "description": "Comfortable ballet flats with memory foam for everyday wear.",
        "reformulated_queries": """Memory Foam Ballet Flats, Comfortable Women's Flats, 
            Daily Wear Ballet Shoes, Soft Sole Ballet Flats, Cushioned Ballet Shoes""",
        "category": "Comfort Footwear"
    },
    {
        "original_query": "Shoes for Women",
        "trend_topic": "Animal Print Boots",
        "description": "Trendy ankle boots featuring various animal print patterns.",
        "reformulated_queries": """Leopard Print Ankle Boots, Snake Pattern Women's Boots, 
            Animal Print Fashion Boots, Zebra Print Booties, Tiger Stripe Ankle Boots""",
        "category": "Fashion Footwear"
    },
    {
        "original_query": "Running Shoes",
        "trend_topic": "Neon Trainers",
        "description": "High-visibility neon running shoes for safety and style.",
        "reformulated_queries": """Neon Yellow Running Shoes, Bright Orange Trainers, 
            High Visibility Running Footwear, Fluorescent Training Shoes, Neon Athletic Shoes""",
        "category": "Athletic Wear"
    },
    {
        "original_query": "Running Shoes",
        "trend_topic": "Trail Runners",
        "description": "Durable trail running shoes with enhanced grip and protection.",
        "reformulated_queries": """Off-Road Running Shoes, Mountain Trail Runners, 
            Grip Enhanced Trail Shoes, All-Terrain Running Footwear, Protective Trail Runners""",
        "category": "Athletic Wear"
    },
    {
        "original_query": "Socks for Women",
        "trend_topic": "Yoga Socks",
        "description": "Non-slip grip socks designed for yoga and pilates practice.",
        "reformulated_queries": """Grip Socks for Yoga, Non-Slip Exercise Socks, 
            Pilates Grip Socks, Ballet Barre Socks, Anti-Slip Yoga Footwear""",
        "category": "Fitness Gear"
    },
    {
        "original_query": "Winter Boots",
        "trend_topic": "Faux Fur Lined",
        "description": "Warm winter boots with faux fur lining and waterproof exterior.",
        "reformulated_queries": """Fur Lined Snow Boots, Warm Winter Footwear, 
            Waterproof Fur Boots, Cozy Winter Boots, Weather Resistant Fur Boots""",
        "category": "Winter Wear"
    },
    {
        "original_query": "Winter Boots",
        "trend_topic": "Urban Hiker",
        "description": "Stylish hiking-inspired boots for urban winter wear.",
        "reformulated_queries": """City Hiking Boots, Urban Winter Boots, 
            Street Style Hiking Boots, Fashion Hiking Footwear, Trendy Winter Boots""",
        "category": "Fashion Footwear"
    },
    {
        "original_query": "Dress Shoes",
        "trend_topic": "Vintage Oxfords",
        "description": "Classic oxford shoes with vintage-inspired detailing.",
        "reformulated_queries": """Retro Oxford Shoes, Classic Dress Oxfords, 
            Vintage Style Formal Shoes, Traditional Oxford Footwear, Classic Dress Shoes""",
        "category": "Formal Wear"
    },
    {
        "original_query": "Dress Shoes",
        "trend_topic": "Modern Loafers",
        "description": "Contemporary loafers with sleek design and comfort features.",
        "reformulated_queries": """Modern Slip-On Loafers, Contemporary Dress Shoes, 
            Comfortable Formal Loafers, Business Casual Shoes, Sleek Office Footwear""",
        "category": "Formal Wear"
    },
    {
        "original_query": "Socks for Men",
        "trend_topic": "Gaming Patterns",
        "description": "Colorful socks featuring retro gaming and console designs.",
        "reformulated_queries": """Gaming Console Socks, Retro Game Pattern Socks, 
            Video Game Theme Socks, Classic Gaming Socks, Pixel Art Sock Designs""",
        "category": "Gaming Theme"
    },
    {
        "original_query": "Athletic Socks",
        "trend_topic": "Compressionn Pro",
        "description": "High-performance compression socks for athletes.",
        "reformulated_queries": """Sports Compression Socks, Athletic Support Socks, 
            Performance Compression Wear, Runner's Compression Socks, Training Support Socks""",
        "category": "Athletic Wear"
    },
    {
        "original_query": "Athletic Socks",
        "trend_topic": "Moisture Wick",
        "description": "Moisture-wicking athletic socks with arch support.",
        "reformulated_queries": """Sweat Wicking Sports Socks, Dry Fit Athletic Socks, 
            Moisture Control Sport Socks, Quick Dry Athletic Socks, Breathable Sport Socks""",
        "category": "Athletic Wear"
    },
    {
        "original_query": "Casual Shoes",
        "trend_topic": "Eco Canvas",
        "description": "Sustainable canvas shoes made from recycled materials.",
        "reformulated_queries": """Eco-Friendly Canvas Shoes, Recycled Material Sneakers, 
            Sustainable Casual Footwear, Green Canvas Shoes, Environmental Friendly Sneakers""",
        "category": "Sustainable Fashion"
    },
    {
        "original_query": "Casual Shoes",
        "trend_topic": "Retro Sneakers",
        "description": "Vintage-inspired sneakers with modern comfort features.",
        "reformulated_queries": """Classic Style Sneakers, Retro Fashion Shoes, 
            Vintage Look Trainers, Old School Sneakers, Traditional Sport Shoes""",
        "category": "Fashion Footwear"
    },
    {
        "original_query": "Slippers",
        "trend_topic": "Memory Foam",
        "description": "Plush memory foam slippers for ultimate comfort.",
        "reformulated_queries": """Comfort Foam Slippers, Soft House Shoes, 
            Memory Foam House Footwear, Cushioned Indoor Slippers, Plush Home Shoes""",
        "category": "Home Comfort"
    },
    {
        "original_query": "Slippers",
        "trend_topic": "Outdoor Sole",
        "description": "Indoor-outdoor slippers with durable rubber soles.",
        "reformulated_queries": """Indoor Outdoor Slippers, Hard Sole House Shoes, 
            Durable Slipper Shoes, All Purpose Slippers, Garden Slip Ons""",
        "category": "Home Comfort"
    },
    {
        "original_query": "Kids Shoes",
        "trend_topic": "Light Up Sneaks",
        "description": "Light-up sneakers with cartoon character designs.",
        "reformulated_queries": """Light Up Children's Shoes, Kids Character Sneakers, 
            Flashing Light Shoes, Animated Kids Footwear, Fun Light Up Trainers""",
        "category": "Children's Wear"
    },
    {
        "original_query": "Kids Shoes",
        "trend_topic": "Growth Fit",
        "description": "Adjustable shoes that accommodate growing feet.",
        "reformulated_queries": """Expandable Kids Shoes, Growing Feet Footwear, 
            Adjustable Children's Shoes, Flexible Size Kids Shoes, Growth Spurt Footwear""",
        "category": "Children's Wear"
    },
    {
        "original_query": "Beach Shoes",
        "trend_topic": "Water Guard",
        "description": "Quick-drying water shoes with protective soles.",
        "reformulated_queries": """Water Protection Shoes, Quick Dry Beach Footwear, 
            Swimming Shoes, Protective Water Shoes, Beach Protection Footwear""",
        "category": "Summer Wear"
    },
    {
        "original_query": "Beach Shoes",
        "trend_topic": "Coral Safe",
        "description": "Eco-friendly water shoes safe for marine environments.",
        "reformulated_queries": """Reef Safe Water Shoes, Eco Water Footwear, 
            Marine Friendly Beach Shoes, Environmental Water Shoes, Ocean Safe Footwear""",
        "category": "Sustainable Fashion"
    }

]

def populate_database():
    with app.app_context():
        # Clear existing data
        TrendingCollection.query.delete()
        
        # Add new data
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
        print("Database populated successfully!")

if __name__ == "__main__":
    populate_database()
