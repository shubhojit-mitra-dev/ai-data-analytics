-- Create database schema for AI SQL Data Agent
-- This schema intentionally includes some "dirty" elements to challenge the AI

-- Regions table
CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  zone VARCHAR(50), -- North, South, East, West
  population INTEGER,
  economic_index NUMERIC(10, 2), -- Economic performance indicator
  "Q1" BOOLEAN, -- Intentionally cryptic column name (Quarter 1 active)
  "Q2" BOOLEAN, -- Intentionally cryptic column name (Quarter 2 active)
  "Q3" BOOLEAN, -- Intentionally cryptic column name (Quarter 3 active)
  "Q4" BOOLEAN, -- Intentionally cryptic column name (Quarter 4 active)
  x_factor NUMERIC(5, 2) -- Ambiguous column name
);

-- Products table with inconsistent naming
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL,
  cost NUMERIC(10, 2),
  prd_desc TEXT, -- Abbreviated column name (product description)
  mfg_date DATE, -- Abbreviated column name (manufacturing date)
  exp_date DATE, -- Abbreviated column name (expiration date)
  prd_code VARCHAR(50), -- Abbreviated column name (product code)
  "stock" INTEGER, -- Quoted column name
  "status" VARCHAR(20) -- Quoted column name
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE,
  role VARCHAR(50),
  joined_date DATE,
  last_active TIMESTAMP,
  t1 BOOLEAN, -- Intentionally cryptic (tier 1 customer)
  t2 BOOLEAN, -- Intentionally cryptic (tier 2 customer)
  t3 BOOLEAN, -- Intentionally cryptic (tier 3 customer)
  usr_pref JSONB -- Abbreviated column name (user preferences)
);

-- Sales table with various columns including some unnamed ones
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  product_id INTEGER REFERENCES products(id),
  user_id INTEGER REFERENCES users(id),
  region_id INTEGER REFERENCES regions(id),
  qty INTEGER, -- Quantity sold
  dscnt NUMERIC(5, 2), -- Discount applied (percentage)
  c1 VARCHAR(50), -- Intentionally cryptic (channel - online/in-store)
  c2 VARCHAR(50), -- Intentionally cryptic (campaign code)
  p1 BOOLEAN, -- Intentionally cryptic (promotion 1 applied)
  p2 BOOLEAN, -- Intentionally cryptic (promotion 2 applied)
  s INTEGER, -- Intentionally cryptic (satisfaction score 1-10)
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of sale record
);

-- Additional linking table to make schema more complex
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  region_id INTEGER REFERENCES regions(id),
  qty_available INTEGER,
  last_restocked TIMESTAMP,
  min_stock_level INTEGER,
  max_stock_level INTEGER,
  "flag" VARCHAR(10) -- Ambiguous column name
);

-- Create indexes for better performance
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_sales_product ON sales(product_id);
CREATE INDEX idx_sales_user ON sales(user_id);
CREATE INDEX idx_sales_region ON sales(region_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_region ON inventory(region_id);