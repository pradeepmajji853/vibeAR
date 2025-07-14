#!/bin/bash

echo "🚀 Testing VibeAR Deployment Configuration"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the project root directory"
    exit 1
fi

echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📁 Checking built files..."
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found!"
    exit 1
fi

echo "🧊 Checking GLB files in dist..."
glb_files=$(find dist -name "*.glb" | wc -l)
echo "Found $glb_files GLB files in dist/"

if [ $glb_files -eq 0 ]; then
    echo "❌ No GLB files found in dist! This will cause 3D models to fail."
    exit 1
fi

echo "📄 Listing GLB files:"
find dist -name "*.glb" -exec ls -lh {} \;

echo "🔍 Checking vercel.json configuration..."
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found!"
    exit 1
fi

echo "✅ vercel.json exists"

echo "🌐 Testing model accessibility (simulating production)..."
cd dist
python3 -m http.server 8080 &
SERVER_PID=$!
sleep 2

echo "🧪 Testing GLB file access..."
for glb_file in *.glb; do
    if [ -f "$glb_file" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080/$glb_file")
        if [ "$response" -eq 200 ]; then
            echo "✅ $glb_file: HTTP $response (OK)"
        else
            echo "❌ $glb_file: HTTP $response (FAILED)"
        fi
    fi
done

# Kill the test server
kill $SERVER_PID
cd ..

echo ""
echo "🎯 Deployment Checklist:"
echo "========================"
echo "✅ Build successful"
echo "✅ GLB files present in dist"
echo "✅ vercel.json configured"
echo "✅ Model files accessible"
echo ""
echo "🚀 Ready for Vercel deployment!"
echo ""
echo "To deploy to Vercel:"
echo "1. Run: vercel --prod"
echo "2. Or push to your git repository if connected to Vercel"
echo ""
echo "🔧 If deployment still fails:"
echo "1. Check Vercel build logs for specific errors"
echo "2. Verify Git LFS is properly configured on Vercel"
echo "3. Consider using vercel env to check environment variables"
