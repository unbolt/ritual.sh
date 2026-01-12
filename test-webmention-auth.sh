#!/bin/bash

# Simple test to verify API authentication
# Usage: ./test-webmention-auth.sh YOUR_API_KEY

API_KEY="${1:-your-secret-key}"
API_ENDPOINT="${API_ENDPOINT:-https://api.ritual.sh/webmention/send}"

echo "Testing webmention API authentication"
echo "======================================"
echo "Endpoint: $API_ENDPOINT"
echo "API Key: ${API_KEY:0:10}... (truncated)"
echo ""

# Test 1: Wrong auth (should get 401)
echo "Test 1: Wrong auth (expecting 401 Unauthorized)"
echo "------------------------------------------------"
curl -v -X POST "$API_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"auth":"wrong-key","source":"https://ritual.sh/test/","target":"https://example.com/test/"}' \
    2>&1 | grep -E "(< HTTP|Unauthorized|error)"

echo ""
echo ""

# Test 2: Correct auth (should get 400 or 201 depending on whether endpoints exist)
echo "Test 2: Correct auth (expecting 400 'No endpoint found' or 201 success)"
echo "------------------------------------------------------------------------"
curl -v -X POST "$API_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{\"auth\":\"$API_KEY\",\"source\":\"https://ritual.sh/test/\",\"target\":\"https://example.com/test/\"}" \
    2>&1 | grep -E "(< HTTP|success|error|endpoint)"

echo ""
echo ""

# Test 3: Missing auth (should get 401)
echo "Test 3: Missing auth (expecting 401 Unauthorized)"
echo "--------------------------------------------------"
curl -v -X POST "$API_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"source":"https://ritual.sh/test/","target":"https://example.com/test/"}' \
    2>&1 | grep -E "(< HTTP|Unauthorized|error)"
