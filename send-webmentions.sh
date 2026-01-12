#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Warning: .env file not found, using defaults"
fi

# Use environment variables with fallback defaults
WEBMENTIONS_FILE="${WEBMENTIONS_FILE:-public/webmentions.json}"
SENT_CACHE="${SENT_CACHE:-.webmentions-sent}"
API_ENDPOINT="${API_ENDPOINT:-https://api.ritual.sh/webmention/send}"
API_KEY="${API_KEY:-your-secret-key}"

# Check for dry-run flag
DRY_RUN=false
if [ "$1" = "--dry-run" ] || [ "$1" = "-n" ]; then
    DRY_RUN=true
    echo "🔍 DRY RUN MODE - No webmentions will be sent"
    echo "================================================"
fi

# Create cache file if it doesn't exist
touch "$SENT_CACHE"

# Read the webmentions JSON
if [ ! -f "$WEBMENTIONS_FILE" ]; then
    echo "No webmentions.json found"
    exit 0
fi

# Count totals
TOTAL=0
ALREADY_SENT=0
TO_SEND=0

# Process each link
jq -c '.[]' "$WEBMENTIONS_FILE" | while read -r mention; do
    source=$(echo "$mention" | jq -r '.source')
    target=$(echo "$mention" | jq -r '.target')
    
    TOTAL=$((TOTAL + 1))
    
    # Create unique key for this source->target pair
    key="${source}|${target}"
    
    # Check if already sent
    if grep -Fxq "$key" "$SENT_CACHE"; then
        if [ "$DRY_RUN" = true ]; then
            echo "⏭️  Already sent: $source -> $target"
        else
            echo "Already sent: $source -> $target"
        fi
        ALREADY_SENT=$((ALREADY_SENT + 1))
        continue
    fi
    
    TO_SEND=$((TO_SEND + 1))
    
    if [ "$DRY_RUN" = true ]; then
        echo "📤 Would send: $source -> $target"
    else
        echo "Sending webmention: $source -> $target"
        
        # Send to your API
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_ENDPOINT" \
            -H "Content-Type: application/json" \
            -d "{\"auth\":\"$API_KEY\",\"source\":\"$source\",\"target\":\"$target\"}")
        
        http_code=$(echo "$response" | tail -n1)

        # If successful (200, 201, or 202), add to cache
        if [ "$http_code" = "200" ] || [ "$http_code" = "201" ] || [ "$http_code" = "202" ]; then
            echo "$key" >> "$SENT_CACHE"
            echo "✓ Sent successfully"
        else
            echo "✗ Failed with status $http_code"
        fi
        
        # Be nice to endpoints - don't spam
        sleep 1
    fi
done

# Summary
echo ""
echo "================================================"
if [ "$DRY_RUN" = true ]; then
    echo "🔍 DRY RUN SUMMARY"
else
    echo "✅ Webmentions processing complete"
fi
echo "Total links found: $TOTAL"
echo "Already sent: $ALREADY_SENT"
echo "To send: $TO_SEND"