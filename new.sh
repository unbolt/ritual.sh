#!/bin/bash

# Script to create new Hugo content w/ filename sanitization
# Usage: ./new.sh <type> <title>

set -e

# Check if required arguments are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <type> <title>"
    echo "Example: $0 blog 'My Awesome Post'"
    exit 1
fi

TYPE="$1"
shift
TITLE="$*"

SAFE_TITLE=$(echo "$TITLE" | \
    tr '[:upper:]' '[:lower:]' | \
    sed 's/ /-/g' | \
    sed 's/\//-/g' | \
    sed 's/[^a-z0-9_-]//g' | \
    sed 's/-\+/-/g' | \
    sed 's/^-//;s/-$//')

# Construct the filename with date
FILENAME="${SAFE_TITLE}/"

# Construct the full path
CONTENT_PATH="${TYPE}/${FILENAME}"

# Create the content using hugo
echo "Creating new content: content/${CONTENT_PATH}"
hugo new "${CONTENT_PATH}"

echo "Content created successfully!"
echo "File: ${CONTENT_PATH}"