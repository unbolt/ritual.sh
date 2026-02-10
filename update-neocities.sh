#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: .env file not found!${NC}"
    exit 1
fi

# Check if API key is set
if [ -z "$NEOCITIES_API_KEY" ]; then
    echo -e "${RED}Error: NEOCITIES_API_KEY not set in .env file!${NC}"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Clean up public folder and create redirect files
echo -e "${BLUE}Cleaning public folder...${NC}"
rm -rf public/
mkdir -p public/log

# Create index.html with redirect to https://ritual.sh
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=https://ritual.sh">
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to <a href="https://ritual.sh">ritual.sh</a>...</p>
</body>
</html>
EOF

# Create log/index.html with redirect to https://ritual.sh/logs/
cat > public/log/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=https://ritual.sh/log/">
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to <a href="https://ritual.sh/log/">ritual.sh/log/</a>...</p>
</body>
</html>
EOF

echo -e "${GREEN}✓ Redirect files created!${NC}"
echo ""

# Upload the redirect files
cd public
echo -e "${BLUE}Uploading files to Neocities...${NC}"
echo "========================================"
echo ""

# Upload index.html
response=$(curl -s -H "Authorization: Bearer $NEOCITIES_API_KEY" \
    -F "index.html=@index.html" \
    "https://neocities.org/api/upload")

if echo "$response" | grep -q '"result"[[:space:]]*:[[:space:]]*"success"'; then
    echo -e "${GREEN}✓${NC} index.html"
else
    echo -e "${RED}✗${NC} index.html - ERROR"
    echo "   Response: $response"
fi

# Upload log/index.html
response=$(curl -s -H "Authorization: Bearer $NEOCITIES_API_KEY" \
    -F "log/index.html=@log/index.html" \
    "https://neocities.org/api/upload")

if echo "$response" | grep -q '"result"[[:space:]]*:[[:space:]]*"success"'; then
    echo -e "${GREEN}✓${NC} log/index.html"
else
    echo -e "${RED}✗${NC} log/index.html - ERROR"
    echo "   Response: $response"
fi

echo ""
echo "========================================"
echo -e "${GREEN}✓ Deployment complete!${NC}"