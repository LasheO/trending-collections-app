from app import app
from models import TrendingCollection

def view_trends():
    with app.app_context():
        trends = TrendingCollection.query.all()
        print(f"Total trends: {len(trends)}")
        for trend in trends:
            print(f"Query: {trend.original_query}")
            print(f"Topic: {trend.trend_topic}")
            print(f"Description: {trend.description}")
            print("-------------------")

if __name__ == "__main__":
    view_trends()
