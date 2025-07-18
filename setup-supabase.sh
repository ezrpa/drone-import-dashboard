#!/bin/bash

# Supabase Migration Setup Script
# Run this script to complete the Supabase database setup

echo "🚀 Setting up Supabase migrations for Drone Import Dashboard..."

# Step 1: Login to Supabase (requires manual token input)
echo "📝 Step 1: Login to Supabase"
echo "Please get your access token from: https://app.supabase.com/account/tokens"
echo "Then run: npx supabase login --token YOUR_ACCESS_TOKEN"
echo ""

# Step 2: Link to project
echo "🔗 Step 2: Link to your Supabase project"
echo "Run: npx supabase link --project-ref puamcecvqbgwtyugztzd"
echo ""

# Step 3: Push migrations
echo "⬆️  Step 3: Push migrations to database"
echo "Run: npx supabase db push"
echo ""

echo "✅ After completing these steps, your database will be ready!"
echo ""
echo "Migration file created at: supabase/migrations/20250717235149_drone-import-schema.sql"
echo "This includes:"
echo "  - drone_analyses table for storing analysis results"
echo "  - drone_models table for drone specifications"
echo "  - Proper indexes and Row Level Security policies"
echo "  - Triggers for automatic timestamp updates"
echo ""
echo "🌐 Dashboard URL: https://ezrpa.github.io/drone-import-dashboard"