# Supabase Database Setup

This guide will help you complete the Supabase database setup for the Drone Import Dashboard.

## Prerequisites

- ✅ Supabase CLI installed (`npm install supabase --save-dev`)
- ✅ Migration file created (`supabase/migrations/20250717235149_drone-import-schema.sql`)
- ✅ Supabase project initialized

## Setup Steps

### 1. Login to Supabase CLI

First, you need to authenticate with Supabase:

```bash
# Get your access token from: https://app.supabase.com/account/tokens
npx supabase login --token YOUR_ACCESS_TOKEN_HERE
```

**To get your access token:**
1. Visit https://app.supabase.com/account/tokens
2. Create a new token or copy an existing one
3. Replace `YOUR_ACCESS_TOKEN_HERE` with your actual token

### 2. Link to Your Supabase Project

```bash
npx supabase link --project-ref puamcecvqbgwtyugztzd
```

This links your local project to the Supabase project with the provided credentials.

### 3. Push Migrations to Database

```bash
npx supabase db push
```

This will execute the migration file and create all necessary tables, indexes, and policies.

## What Gets Created

The migration will create:

### Tables
- **`drone_analyses`** - Stores saved analysis results
  - `id`, `drone_model`, `condition`, `purchase_price`
  - `quantity`, `total_cost_usd`, `total_cost_ars`
  - `cost_per_drone`, `profit_per_drone`, `total_profit`
  - `import_advantage`, `exchange_rate`, `target_margin`
  - `freight_multiplier`, `challenge_multiplier`
  - `analysis_data` (JSONB) - Complete analysis data
  - Timestamps: `created_at`, `updated_at`

- **`drone_models`** - Stores drone specifications
  - `id`, `model_name`, `category`, `new_price`
  - `used_price_min`, `used_price_max`, `camera_type`
  - `battery_life`, `use_case`, `depreciation`
  - `argentina_price_ars`, `challenges`, `import_advantage`
  - `model_data` (JSONB) - Complete model data
  - Timestamps: `created_at`, `updated_at`

### Features
- **Indexes** for optimal performance
- **Row Level Security (RLS)** with public policies
- **Automatic timestamps** with triggers
- **UUID primary keys** for better distribution

## Verification

After setup, you can verify the tables exist:

```bash
npx supabase db diff
```

Or check in your Supabase dashboard at: https://app.supabase.com/project/puamcecvqbgwtyugztzd

## Dashboard Integration

The dashboard is already configured to use these tables:
- **Save Analysis** - Stores current analysis in `drone_analyses`
- **History** - Loads saved analyses from `drone_analyses`
- **Load/Delete** - Manages saved analyses

Environment variables are already set in `.env`:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_SUPABASE_SERVICE_ROLE_KEY`

## Quick Setup Script

Run the setup script for guided instructions:

```bash
./setup-supabase.sh
```

## Troubleshooting

If you encounter issues:

1. **Authentication Error**: Ensure your access token is valid
2. **Project Link Error**: Verify the project ref `puamcecvqbgwtyugztzd`
3. **Migration Error**: Check the SQL syntax in the migration file

For more help, visit: https://supabase.com/docs/guides/cli