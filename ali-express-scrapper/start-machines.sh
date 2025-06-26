#!/bin/bash

# Exit on any error
set -e

echo "Starting AliExpress Scraper machines on Fly.io..."

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

# Start all machines
echo "Starting all machines..."
flyctl machines start

# Wait a moment for the machines to fully start
echo "Waiting for machines to start..."
sleep 10

# Check the status
echo "Checking status..."
flyctl status

echo "Machines should now be running!"
echo "To view logs, run: flyctl logs"
