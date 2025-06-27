#!/bin/bash

# Install backend dependencies
pip install -r trending_collections_app/backend/requirements.txt

# Initialize database
cd trending_collections_app/backend
python init_db.py
cd ..

# Build frontend and copy to backend static folder
cd frontend
npm install
npm run build
mkdir -p ../backend/static
cp -r build/* ../backend/static/