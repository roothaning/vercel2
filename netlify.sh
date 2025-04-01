#!/bin/bash

# Node.js sürümü kontrol et
echo "Using Node.js version $(node -v)"
echo "Using npm version $(npm -v)"

# Go bağımlılıklarını atla
export SKIP_GO_INSTALL=true

# Build işlemini çalıştır
npm run build