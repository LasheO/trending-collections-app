from app import app
from models import TrendingCollection

with app.app_context():
    trends = TrendingCollection.query.all()
    print(f"Number of trends in database: {len(trends)}")
    for trend in trends[:5]:  # Show first 5 trends
        print(f"\nQuery: {trend.original_query}")
        print(f"Topic: {trend.trend_topic}")
