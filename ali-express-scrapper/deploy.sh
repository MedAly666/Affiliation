#!/bin/bash

# Exit on any error
set -e

echo "Deploying AliExpress Scraper to Fly.io..."

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

# Check if app already exists
if ! flyctl apps list | grep -q "ali-express-scrapper"; then
    echo "Creating new Fly.io app..."
    flyctl apps create ali-express-scrapper
fi

# Set secrets
echo "Setting up environment variables..."
read -p "Enter your SUPABASE_URL: " SUPABASE_URL
read -p "Enter your SUPABASE_KEY: " SUPABASE_KEY

flyctl secrets set SUPABASE_URL="$SUPABASE_URL" SUPABASE_KEY="$SUPABASE_KEY"

# Deploy the app
echo "Deploying application..."
flyctl deploy

echo "Deployment complete! Your scraper will run every 6 hours."
echo "To view logs, run: flyctl logs"
echo "To trigger a manual run: flyctl ssh console -C 'bun run index.ts'"