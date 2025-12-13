#!/bin/bash
# Script to create new Hugo content w/ filename sanitization
# Usage: ./new.sh [-d] [-s] <type> <title>
#   -d: Add date prefix (YYYY-MM-DD)
#   -s: Single page format (.md instead of /)
set -e

# Initialize flags
ADD_DATE=false
SINGLE_PAGE=false

# Parse flags
while getopts "ds" opt; do
  case $opt in
    d)
      ADD_DATE=true
      ;;
    s)
      SINGLE_PAGE=true
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# Shift past the options
shift $((OPTIND-1))

# Check if required arguments are provided
if [ $# -lt 2 ]; then
  echo "Usage: $0 [-d] [-s] <type> <title>"
  echo "  -d: Add date prefix (YYYY-MM-DD)"
  echo "  -s: Single page format (.md instead of /)"
  echo "Example: $0 -d -s blog 'My Awesome Post'"
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

# Add date prefix if flag is set
if [ "$ADD_DATE" = true ]; then
  DATE_PREFIX=$(date +%Y-%m-%d)
  SAFE_TITLE="${DATE_PREFIX}-${SAFE_TITLE}"
fi

# Construct the filename based on format
if [ "$SINGLE_PAGE" = true ]; then
  FILENAME="${SAFE_TITLE}.md"
else
  FILENAME="${SAFE_TITLE}/"
fi

# Construct the full path
CONTENT_PATH="${TYPE}/${FILENAME}"

# Create the content using hugo
echo "Creating new content: content/${CONTENT_PATH}"
hugo new "${CONTENT_PATH}"

echo "Content created successfully!"
echo "File: ${CONTENT_PATH}"