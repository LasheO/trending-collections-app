#!/bin/bash

# Install backend dependencies
pip install -r trending_collections_app/backend/requirements.txt

# Initialize database
cd trending_collections_app/backend
python init_db.py

# Build frontend
cd ../frontend
npm install
npm run build

# Create static directory and copy files correctly
rm -rf ../backend/static
mkdir -p ../backend/static

# Copy the build files directly to static folder
cp -r build/* ../backend/static/

# Debug: List files in static directory
echo "Files in static directory:"
ls -la ../backend/static/

echo "Build completed successfully"