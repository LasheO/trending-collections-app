#!/bin/bash

# Install backend dependencies
pip install -r trending_collections_app/backend/requirements.txt

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Build frontend and copy to backend static folder
cd trending_collections_app/frontend
npm install
npm run build
mkdir -p ../backend/static
cp -r build/* ../backend/static/