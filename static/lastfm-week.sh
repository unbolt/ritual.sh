#!/bin/bash

# Last.fm Weekly Stats Script
# Fetches your Last.fm listening statistics for the past week
#
# Requirements:
#   - curl (for API requests)
#   - jq (for JSON parsing)
#
# Usage: ./lastfm-week.sh
#
# Setup:
#   Create a .env file with:
#     LASTFM_API_KEY=your_api_key_here
#     LASTFM_USERNAME=your_username_here
#
# Output: Markdown-formatted stats with top artists and track counts
#
# Download from: https://ritual.sh/resources/lastfm-stats/

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Check required variables
if [ -z "$LASTFM_API_KEY" ] || [ -z "$LASTFM_USERNAME" ]; then
    echo "Error: LASTFM_API_KEY and LASTFM_USERNAME must be set in .env file"
    exit 1
fi

API_BASE="http://ws.audioscrobbler.com/2.0/"

# Get current timestamp
NOW=$(date +%s)
# Get timestamp from 7 days ago
WEEK_AGO=$((NOW - 604800))

# Fetch top artists for the week
TOP_ARTISTS=$(curl -s "${API_BASE}?method=user.gettopartists&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&period=7day&limit=5")

# Fetch recent tracks to count this week's scrobbles
RECENT_TRACKS=$(curl -s "${API_BASE}?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&from=${WEEK_AGO}&to=${NOW}&limit=1")

# Get total track count
TOTAL_TRACKS=$(echo "$RECENT_TRACKS" | jq -r '.recenttracks["@attr"].total')

# Output in markdown format
echo "## Last.fm Weekly Stats"
echo ""
echo "**Total Tracks:** ${TOTAL_TRACKS}"
echo ""
echo "**Top 5 Artists:**"
echo ""

# Parse and display top 5 artists as markdown links
echo "$TOP_ARTISTS" | jq -r '.topartists.artist[] | "- [\(.name)](\(.url)) - \(.playcount) plays"'