# Database Migration Instructions

The Supabase project has been linked successfully! Now you need to run the migration to create the database schema.

## Option 1: Using Supabase CLI (Recommended)

If you have the database password:

```bash
npx supabase db push
```

When prompted, enter your database password. You can find/reset it at:
https://supabase.com/dashboard/project/puamcecvqbgwtyugztzd/settings/database

## Option 2: Manual SQL Execution

If you prefer to run the SQL manually, copy and paste the following into your Supabase SQL Editor:

### Go to SQL Editor
1. Visit: https://supabase.com/dashboard/project/puamcecvqbgwtyugztzd/sql
2. Create a new query
3. Copy and paste the SQL below:

```sql
-- Drone Import Dashboard Schema

-- Table for storing drone analyses
CREATE TABLE drone_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drone_model TEXT NOT NULL,
    condition TEXT NOT NULL,
    purchase_price DECIMAL(10,2),
    quantity INTEGER NOT NULL,
    total_cost_usd DECIMAL(12,2) NOT NULL,
    total_cost_ars DECIMAL(15,2) NOT NULL,
    cost_per_drone DECIMAL(10,2) NOT NULL,
    profit_per_drone DECIMAL(10,2),
    total_profit DECIMAL(12,2),
    import_advantage DECIMAL(5,2),
    exchange_rate DECIMAL(8,2),
    target_margin DECIMAL(5,2),
    freight_multiplier DECIMAL(5,2),
    challenge_multiplier DECIMAL(5,2),
    analysis_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing drone model data
CREATE TABLE drone_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    new_price DECIMAL(10,2),
    used_price_min DECIMAL(10,2),
    used_price_max DECIMAL(10,2),
    camera_type TEXT,
    battery_life INTEGER,
    use_case TEXT,
    depreciation DECIMAL(5,4),
    argentina_price_ars DECIMAL(15,2),
    challenges JSONB,
    import_advantage DECIMAL(5,2),
    model_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_drone_analyses_created_at ON drone_analyses(created_at DESC);
CREATE INDEX idx_drone_analyses_drone_model ON drone_analyses(drone_model);
CREATE INDEX idx_drone_analyses_import_advantage ON drone_analyses(import_advantage DESC);
CREATE INDEX idx_drone_models_category ON drone_models(category);
CREATE INDEX idx_drone_models_model_name ON drone_models(model_name);

-- Enable Row Level Security (RLS)
ALTER TABLE drone_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_models ENABLE ROW LEVEL SECURITY;

-- Policies for public access
CREATE POLICY "Allow public read on drone_analyses" ON drone_analyses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on drone_analyses" ON drone_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on drone_analyses" ON drone_analyses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on drone_analyses" ON drone_analyses FOR DELETE USING (true);

CREATE POLICY "Allow public read on drone_models" ON drone_models FOR SELECT USING (true);
CREATE POLICY "Allow public insert on drone_models" ON drone_models FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on drone_models" ON drone_models FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on drone_models" ON drone_models FOR DELETE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_drone_analyses_updated_at BEFORE UPDATE ON drone_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drone_models_updated_at BEFORE UPDATE ON drone_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click "Run" to execute the SQL

## Verification

After running the migration, you should see:
- ✅ `drone_analyses` table created
- ✅ `drone_models` table created  
- ✅ Indexes created for performance
- ✅ RLS policies enabled
- ✅ Triggers for automatic timestamps

## Dashboard Features

Once the database is set up, the dashboard will have:
- 💾 **Save Analysis** - Store current configurations
- 📜 **History** - View saved analyses  
- 🔄 **Load** - Restore previous configurations
- 🗑️ **Delete** - Remove saved analyses

## Connection Details

The dashboard is already configured with:
- **Project URL**: https://puamcecvqbgwtyugztzd.supabase.co
- **Anon Key**: Configured in environment variables
- **Dashboard**: https://ezrpa.github.io/drone-import-dashboard

## Troubleshooting

If the Save/Load features don't work:
1. Verify tables exist in Supabase dashboard
2. Check RLS policies are enabled
3. Ensure environment variables are set correctly