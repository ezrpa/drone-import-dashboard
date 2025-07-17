-- Supabase SQL Schema for Drone Import Dashboard

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
    analysis_data JSONB, -- Store complete analysis data
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
    challenges JSONB, -- Array of challenges
    import_advantage DECIMAL(5,2),
    model_data JSONB, -- Complete model data
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

-- Policies for public read access (since this is a demo/public tool)
CREATE POLICY "Allow public read on drone_analyses" ON drone_analyses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on drone_analyses" ON drone_analyses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on drone_analyses" ON drone_analyses
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on drone_analyses" ON drone_analyses
    FOR DELETE USING (true);

CREATE POLICY "Allow public read on drone_models" ON drone_models
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on drone_models" ON drone_models
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on drone_models" ON drone_models
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on drone_models" ON drone_models
    FOR DELETE USING (true);

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

-- Sample data insertion (optional)
-- You can run this to populate some initial drone model data
/*
INSERT INTO drone_models (model_name, category, new_price, used_price_min, used_price_max, camera_type, battery_life, use_case, depreciation, argentina_price_ars, challenges, import_advantage, model_data) VALUES
('DJI Phantom Standard', 'Consumer', 537, 250, 400, 'HD', 28, 'General Purpose', 0.30, 800000, '["Older model", "Large size"]', 2.4, '{}'),
('DJI Mini 4 Pro', 'Consumer', 759, 450, 650, '4K HDR', 34, 'Content Creation', 0.15, 1400000, '["Popular model - good availability"]', 2.5, '{}'),
('DJI Air 3S', 'Prosumer', 1299, 800, 1100, 'Dual 4K', 45, 'Professional Photo/Video', 0.18, 2200000, '["High demand", "Complex dual camera"]', 2.0, '{}');
*/