#!/bin/bash

# Detaylı build script
echo "Starting build with Node $(node -v) and npm $(npm -v)"

echo "Installing dependencies with legacy peer deps flag..."
npm install --legacy-peer-deps

echo "Listing installed packages..."
npm list --depth=0

echo "Building project..."
npm run build

echo "Build completed successfully!"