#!/bin/bash

# Exit on any error
set -e

echo "Checking AliExpress Scraper status on Fly.io..."

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

# Check app status
echo "App status:"
flyctl status

echo -e "\nChecking app logs (last 10 lines):"
flyctl logs --lines 10

echo -e "\nChecking app URL:"
APP_URL=$(flyctl info --json | grep -o '"Hostname": "[^"]*' | cut -d'"' -f4)
if [ -n "$APP_URL" ]; then
    echo "Your app is available at: https://$APP_URL"
    # Try to curl the app
    echo -e "\nTesting app response:"
    curl -s "https://$APP_URL" || echo "Couldn't connect to the app."
fi
