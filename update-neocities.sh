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

echo -e "${BLUE}Removing existing files...${NC}"
rm -rf public/

# Build the Hugo site
echo -e "${BLUE}Building Hugo site...${NC}"
hugo

if [ $? -ne 0 ]; then
    echo -e "${RED}Hugo build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Hugo build successful!${NC}"

# Remove folders that shouldn't be uploaded to Neocities
FOLDERS_TO_REMOVE=(
    "about"
    "archives"
    "audio"
    "blog"
    "buttons"
    "gear"
    "guestbook"
    "media"
    "now"
    "resources"
    "tags"
    "test"
    "updates"
    "uses"
    "fonts"
    "images"
    "js"
)

echo -e "${BLUE}Removing excluded folders from public...${NC}"
for folder in "${FOLDERS_TO_REMOVE[@]}"; do
    if [ -d "public/$folder" ]; then
        rm -rf "public/$folder"
        echo -e "  ${GREEN}✓${NC} Removed $folder/"
    fi
done
echo -e "${GREEN}✓ Folder cleanup complete!${NC}"

# Remove specific files that shouldn't be uploaded
FILES_TO_REMOVE=(
    "index.html"
    "404.html"
)

echo -e "${BLUE}Removing excluded files from public...${NC}"
for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "public/$file" ]; then
        rm -f "public/$file"
        echo -e "  ${GREEN}✓${NC} Removed $file"
    fi
done
echo -e "${GREEN}✓ File cleanup complete!${NC}"

echo ""

# Count total files
cd public
total_files=$(find . -type f | wc -l)
current=0

echo -e "${BLUE}Uploading $total_files files to Neocities...${NC}"
echo "========================================"
echo ""

# Upload files using the API
find . -type f | while read file; do
    cleanfile="${file#./}"
    ((current++))
    
    # Calculate progress percentage
    percentage=$((current * 100 / total_files))
    
    # Create progress bar with simple characters
    filled=$((percentage / 2))
    empty=$((50 - filled))
    bar=$(printf "%${filled}s" | tr ' ' '=')
    space=$(printf "%${empty}s" | tr ' ' '-')
    
    # Upload and capture response
    response=$(curl -s -H "Authorization: Bearer $NEOCITIES_API_KEY" \
        -F "$cleanfile=@$file" \
        "https://neocities.org/api/upload")
    
    # Parse result from JSON - check if response contains "success"
    if echo "$response" | grep -q '"result"[[:space:]]*:[[:space:]]*"success"'; then
        result="success"
    else
        result="error"
    fi
    
    # Display progress with color
    printf "[${YELLOW}%s${NC}%s] %3d%% (%d/%d) " "$bar" "$space" "$percentage" "$current" "$total_files"
    
    # Show file status
    if [ "$result" = "success" ]; then
        echo -e "${GREEN}✓${NC} $cleanfile"
    else
        echo -e "${RED}✗${NC} $cleanfile - ERROR"
        echo "   Response: $response"
    fi
done

echo ""
echo "========================================"
echo -e "${GREEN}✓ Deployment complete!${NC}"