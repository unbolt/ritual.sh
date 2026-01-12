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

echo "DEBUG: Configuration"
echo "===================="
echo "API_ENDPOINT: $API_ENDPOINT"
echo "API_KEY: ${API_KEY:0:10}... (first 10 chars)"
echo "WEBMENTIONS_FILE: $WEBMENTIONS_FILE"
echo ""

# Read the webmentions JSON
if [ ! -f "$WEBMENTIONS_FILE" ]; then
    echo "No webmentions.json found at $WEBMENTIONS_FILE"
    exit 0
fi

# Get first mention for testing
first_mention=$(jq -c '.[0]' "$WEBMENTIONS_FILE")
source=$(echo "$first_mention" | jq -r '.source')
target=$(echo "$first_mention" | jq -r '.target')

echo "DEBUG: Testing with first webmention"
echo "====================================="
echo "Source: $source"
echo "Target: $target"
echo ""

# Create the JSON payload
payload=$(jq -n \
    --arg auth "$API_KEY" \
    --arg source "$source" \
    --arg target "$target" \
    '{auth: $auth, source: $source, target: $target}')

echo "DEBUG: Payload"
echo "=============="
echo "$payload" | jq '.'
echo ""

echo "DEBUG: Sending request..."
echo "========================="

# Send with verbose output
response=$(curl -v -X POST "$API_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    2>&1)

echo ""
echo "DEBUG: Full Response"
echo "===================="
echo "$response"
echo ""

# Extract just the HTTP status and response body
http_status=$(echo "$response" | grep "< HTTP" | tail -1)
response_body=$(echo "$response" | sed -n '/^{/,/^}/p' | tail -1)

echo ""
echo "DEBUG: Parsed Results"
echo "====================="
echo "HTTP Status: $http_status"
echo "Response Body: $response_body"
