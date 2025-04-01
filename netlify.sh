#!/bin/bash

# Basit build script
echo "Starting build with Node $(node -v) and npm $(npm -v)"

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Build completed successfully!"