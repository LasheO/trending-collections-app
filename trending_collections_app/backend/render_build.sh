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
cp -r build/* ../backend/static/

# Create a simple index.html file directly in the static folder as a fallback
echo '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Trending Collections</title>
  <script>
    // Redirect to the actual index.html
    window.location.href = "/index.html";
  </script>
</head>
<body>
  <p>Loading Trending Collections...</p>
</body>
</html>' > ../backend/static/index.html

echo "Build completed successfully"