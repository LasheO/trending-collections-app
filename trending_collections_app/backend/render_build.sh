#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting build process..."

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r trending_collections_app/backend/requirements.txt

# Initialize database
echo "Initializing database..."
cd trending_collections_app/backend
python init_db.py
cd ../..

# Build frontend
echo "Building frontend..."
cd trending_collections_app/frontend
npm install
npm run build
cd ../..

# Prepare static directory
echo "Preparing static directory..."
rm -rf trending_collections_app/backend/static
mkdir -p trending_collections_app/backend/static

# Copy the build files to the static folder
echo "Copying build files to static folder..."
cp -r trending_collections_app/frontend/build/* trending_collections_app/backend/static/

# Fix the paths in index.html
echo "Fixing paths in index.html..."
if [ -f "trending_collections_app/backend/static/index.html" ]; then
    # Replace "/static/" with just "static/" in the index.html file
    sed -i 's|"/static/|"static/|g' trending_collections_app/backend/static/index.html
fi

# Debug: List files in static directory
echo "Files in static directory:"
ls -la trending_collections_app/backend/static/

# Debug: Check for JS and CSS files
if [ -d "trending_collections_app/backend/static/static" ]; then
    echo "Found nested static directory with contents:"
    ls -la trending_collections_app/backend/static/static/
    
    if [ -d "trending_collections_app/backend/static/static/js" ]; then
        echo "JS files:"
        ls -la trending_collections_app/backend/static/static/js/
    fi
    
    if [ -d "trending_collections_app/backend/static/static/css" ]; then
        echo "CSS files:"
        ls -la trending_collections_app/backend/static/static/css/
    fi
fi

echo "Build completed successfully"