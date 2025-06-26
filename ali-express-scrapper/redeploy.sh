#!/bin/bash

# Exit on any error
set -e

echo "Redeploying AliExpress Scraper to Fly.io..."

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

# Force kill and destroy any existing machines
echo "Shutting down any existing machines..."
flyctl machines destroy --force || true

# Deploy the app
echo "Deploying application with fixed configuration..."
flyctl deploy

# Ensure machines are started
echo "Starting machines..."
flyctl machines start

# Wait a moment for the machines to fully start
echo "Waiting for machines to start..."
sleep 10

# Check the status
echo "Checking status..."
flyctl status

echo "Deployment complete!"
echo "To view logs, run: flyctl logs"
echo "To trigger a manual run: flyctl ssh console -C 'bun run index.ts'"
echo "To check your app status: flyctl status"
