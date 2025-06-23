#!/bin/bash

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run tests with reduced output and no watch mode
echo "Running tests..."
CI=true npm test -- --transformIgnorePatterns "node_modules/(?!@mui)/" --watchAll=false