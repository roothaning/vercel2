#!/bin/bash

# Node.js sürümü kontrol et
echo "Using Node.js version $(node -v)"
echo "Using npm version $(npm -v)"

# Python bağımlılıklarını atla
export PYTHON_VERSION=3.10
export SKIP_PYTHON_INSTALL=true
export SKIP_GO_INSTALL=true

# Değişkenleri ekrana yazdır
echo "PYTHON_VERSION: $PYTHON_VERSION"
echo "SKIP_PYTHON_INSTALL: $SKIP_PYTHON_INSTALL"
echo "SKIP_GO_INSTALL: $SKIP_GO_INSTALL"

# Build işlemini çalıştır
npm ci && npm run build