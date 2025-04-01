#!/bin/bash

# Node.js sürümü kontrol et
echo "Using Node.js version $(node -v)"
echo "Using npm version $(npm -v)"

# İhtiyaç duyulmayan dillerin kurulumunu atla
export NETLIFY_USE_PYTHON=false
export NETLIFY_USE_YARN=false
export NETLIFY_USE_PNPM=false
export NETLIFY_USE_GO=false
export NETLIFY_USE_RUBY=false
export SKIP_PYTHON_INSTALL=true
export SKIP_GO_INSTALL=true

# Değişkenleri ekrana yazdır
echo "NETLIFY_USE_PYTHON: $NETLIFY_USE_PYTHON"
echo "SKIP_PYTHON_INSTALL: $SKIP_PYTHON_INSTALL"
echo "SKIP_GO_INSTALL: $SKIP_GO_INSTALL"

# Bağımlılıkları kur ve build işlemini çalıştır
npm ci
npm run build