-- ==========================================
-- KETO APP DATABASE SCHEMA
-- ==========================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'basic_30',
  subscription_status TEXT NOT NULL DEFAULT 'active',
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  payhip_sale_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_tier CHECK (
    subscription_tier IN ('basic_30', 'advanced_6m', 'pro_12m')
  ),
  CONSTRAINT valid_status CHECK (
    subscription_status IN ('active', 'expired', 'cancelled')
  )
);

-- 2. Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  servings INTEGER NOT NULL DEFAULT 1,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  calories INTEGER NOT NULL,
  protein DECIMAL(5,1) NOT NULL,
  fat DECIMAL(5,1) NOT NULL,
  carbs DECIMAL(5,1) NOT NULL,
  fiber DECIMAL(5,1) NOT NULL DEFAULT 0,
  net_carbs DECIMAL(5,1) NOT NULL,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  tips JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_difficulty CHECK (
    difficulty IN ('easy', 'medium', 'hard')
  )
);

-- 3. Meal Plans Table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  
  CONSTRAINT valid_plan_type CHECK (
    plan_type IN ('basic_30', 'advanced_6m', 'pro_12m')
  ),
  CONSTRAINT valid_meal_type CHECK (
    meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')
  ),
  
  UNIQUE(plan_type, day_number, meal_type, order_index)
);

-- 4. Completed Days Table
CREATE TABLE IF NOT EXISTS completed_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, plan_type, day_number)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_meal_plans_plan_day ON meal_plans(plan_type, day_number);
CREATE INDEX IF NOT EXISTS idx_completed_days_user ON completed_days(user_id, plan_type);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_days ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Completed Days Policies
CREATE POLICY "Users can view own completed days"
  ON completed_days FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed days"
  ON completed_days FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public Read for Recipes and Meal Plans
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read recipes"
  ON recipes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read meal plans"
  ON meal_plans FOR SELECT
  USING (true);

-- ==========================================
-- SAMPLE DATA (1 Recipe + 1 Day Plan)
-- ==========================================

-- Insert Sample Recipe
INSERT INTO recipes (
  title, description, prep_time, cook_time, servings, difficulty,
  calories, protein, fat, carbs, fiber, net_carbs,
  ingredients, instructions, tags
) VALUES (
  'Avocado Scrambled Eggs',
  'Quick and healthy keto breakfast with avocado and eggs',
  5, 5, 1, 'easy',
  420, 25, 35, 5, 3, 2,
  '[
    {"item": "Large eggs", "amount": "3", "unit": "pieces"},
    {"item": "Ripe avocado", "amount": "0.5", "unit": "piece"},
    {"item": "Butter", "amount": "1", "unit": "tbsp"},
    {"item": "Salt and pepper", "amount": "to taste", "unit": ""}
  ]'::jsonb,
  '[
    "Whisk eggs in a bowl with salt and pepper",
    "Heat butter in a pan over medium heat",
    "Pour eggs and gently scramble until cooked",
    "Slice avocado",
    "Serve eggs with avocado slices on top"
  ]'::jsonb,
  ARRAY['breakfast', 'easy', 'quick']
);

-- Get the recipe ID for meal plan
DO $$
DECLARE
  recipe_id UUID;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Avocado Scrambled Eggs';
  
  -- Insert Day 7 Breakfast
  INSERT INTO meal_plans (plan_type, day_number, meal_type, recipe_id, order_index)
  VALUES ('basic_30', 7, 'breakfast', recipe_id, 1);
END $$;