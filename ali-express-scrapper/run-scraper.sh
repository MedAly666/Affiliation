#!/bin/bash

# Exit on any error
set -e

# Usage info
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  echo "Usage: ./run-scraper.sh [options]"
  echo "Options:"
  echo "  -l, --logs    Show logs after triggering the scraper"
  echo "  -h, --help    Show this help message"
  exit 0
fi

echo "Triggering AliExpress Scraper manually..."

# Check if Fly CLI is installed
if ! command -v flyctl &> /dev/null; then
    echo "Fly CLI is not installed. Installing..."
    curl -L https://fly.io/install.sh | sh
    export FLYCTL_INSTALL="/home/medaly/.fly"
    export PATH="$FLYCTL_INSTALL/bin:$PATH"
fi

# Login to Fly.io if not already logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "Please login to Fly.io:"
    flyctl auth login
fi

# Run the scraper
echo "Starting the scraper..."
flyctl ssh console -C 'bun run index.ts'

# Show logs if requested
if [ "$1" == "-l" ] || [ "$1" == "--logs" ]; then
  echo "Showing logs..."
  flyctl logs
fi

echo "Scraper has been triggered!"
