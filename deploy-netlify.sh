#!/bin/bash

# FilmFusion Netlify Deployment Preparation Script
# This script prepares your project for Netlify deployment

echo "🎬 FilmFusion - Netlify Deployment Preparation"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if netlify.toml exists
if [ ! -f "netlify.toml" ]; then
    echo "❌ Error: netlify.toml not found. This file is required for Netlify deployment."
    exit 1
fi

echo "✅ Project structure verified"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Test build
echo "🔨 Testing production build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful"

# Clean up build directory (Netlify will rebuild)
rm -rf build

echo ""
echo "🚀 Your project is ready for Netlify deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Netlify"
echo "3. Set the following environment variables in Netlify:"
echo "   - REACT_APP_API_BASE_URL=https://artistic-sparkle-production.up.railway.app/api"
echo "   - REACT_APP_GOOGLE_CLIENT_ID=1059821168279-l3f82nmslol1brmlr9co2l4gph4rk3oe.apps.googleusercontent.com"
echo "   - REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p"
echo "   - GENERATE_SOURCEMAP=false"
echo ""
echo "4. Deploy your site"
echo "5. Update your Railway backend CORS_ORIGIN with your Netlify URL"
echo ""
echo "📖 For detailed instructions, see NETLIFY_DEPLOYMENT.md"
echo ""
echo "Happy deploying! 🎉"
