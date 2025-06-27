#!/bin/bash

# Install backend dependencies
pip install -r trending_collections_app/backend/requirements.txt

# Build frontend and copy to backend static folder
cd trending_collections_app/frontend
npm install
npm run build
mkdir -p ../backend/static
cp -r build/* ../backend/static/