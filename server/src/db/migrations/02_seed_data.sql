-- Data seeding script for AI SQL Data Agent database

-- Seed regions table
INSERT INTO regions (name, country, zone, population, economic_index, "Q1", "Q2", "Q3", "Q4", x_factor) 
VALUES 
  ('New York', 'USA', 'East', 8500000, 85.7, true, true, true, true, 4.2),
  ('Los Angeles', 'USA', 'West', 4000000, 82.3, true, true, true, true, 3.8),
  ('Chicago', 'USA', 'Central', 2700000, 78.9, true, true, true, true, 3.5),
  ('Houston', 'USA', 'South', 2300000, 77.4, true, true, true, true, 3.2),
  ('Miami', 'USA', 'South', 450000, 75.6, true, true, true, true, 4.0),
  ('Toronto', 'Canada', 'North', 2800000, 83.2, true, true, true, true, 3.9),
  ('Vancouver', 'Canada', 'West', 675000, 82.5, true, true, true, true, 3.7),
  ('Montreal', 'Canada', 'East', 1700000, 80.1, true, true, true, true, 3.4),
  ('London', 'UK', 'North', 8900000, 84.3, true, true, true, true, 4.1),
  ('Manchester', 'UK', 'North', 550000, 76.8, true, true, true, true, 3.3),
  ('Birmingham', 'UK', 'Central', 1100000, 75.2, true, true, true, false, 3.1),
  ('Sydney', 'Australia', 'East', 5300000, 83.5, false, true, true, true, 4.3),
  ('Melbourne', 'Australia', 'South', 5000000, 82.7, false, true, true, true, 4.0),
  ('Brisbane', 'Australia', 'North', 2400000, 79.8, false, true, true, true, 3.6),
  ('Perth', 'Australia', 'West', 2000000, 78.5, false, true, true, true, 3.5);

-- Seed products table
INSERT INTO products (name, category, price, cost, prd_desc, mfg_date, exp_date, prd_code, "stock", "status") 
VALUES 
  ('Laptop Pro', 'Electronics', 1299.99, 850.00, 'High-performance laptop for professionals', '2024-01-15', '2027-01-15', 'LP-001', 120, 'active'),
  ('Smartphone X', 'Electronics', 899.99, 550.00, 'Latest smartphone with advanced features', '2024-02-20', '2026-02-20', 'SPX-002', 200, 'active'),
  ('Wireless Headphones', 'Electronics', 199.99, 80.00, 'Noise-cancelling wireless headphones', '2024-03-05', '2026-03-05', 'WH-003', 150, 'active'),
  ('Coffee Maker', 'Home Appliances', 89.99, 35.00, 'Programmable coffee maker with timer', '2024-01-10', '2025-01-10', 'CM-004', 80, 'active'),
  ('Blender Ultra', 'Home Appliances', 79.99, 30.00, 'High-power blender for smoothies and more', '2024-02-15', '2025-02-15', 'BU-005', 90, 'active'),
  ('Smart Watch', 'Electronics', 249.99, 120.00, 'Smart watch with health monitoring', '2024-03-10', '2026-03-10', 'SW-006', 100, 'active'),
  ('Desk Chair', 'Furniture', 159.99, 70.00, 'Ergonomic office chair', '2024-01-05', NULL, 'DC-007', 60, 'active'),
  ('Bookshelf', 'Furniture', 129.99, 50.00, '5-shelf bookcase for home or office', '2024-02-10', NULL, 'BS-008', 40, 'active'),
  ('Table Lamp', 'Home Decor', 49.99, 20.00, 'Modern table lamp with adjustable brightness', '2024-03-15', NULL, 'TL-009', 120, 'active'),
  ('Wall Clock', 'Home Decor', 29.99, 12.00, 'Decorative wall clock', '2024-01-20', NULL, 'WC-010', 100, 'active'),
  ('T-shirt Basic', 'Clothing', 19.99, 5.00, 'Cotton basic t-shirt', '2024-02-25', NULL, 'TB-011', 300, 'active'),
  ('Jeans Classic', 'Clothing', 59.99, 25.00, 'Classic fit jeans', '2024-03-01', NULL, 'JC-012', 200, 'active'),
  ('Running Shoes', 'Footwear', 89.99, 40.00, 'Lightweight running shoes', '2024-01-25', NULL, 'RS-013', 150, 'active'),
  ('Casual Sneakers', 'Footwear', 69.99, 30.00, 'Comfortable casual sneakers', '2024-02-05', NULL, 'CS-014', 180, 'active'),
  ('Winter Jacket', 'Clothing', 129.99, 60.00, 'Insulated winter jacket', '2024-03-20', NULL, 'WJ-015', 80, 'active'),
  ('Tablet Mini', 'Electronics', 399.99, 220.00, 'Compact tablet with high-resolution display', '2024-01-30', '2026-01-30', 'TM-016', 90, 'active'),
  ('Gaming Console', 'Electronics', 499.99, 300.00, 'Next-gen gaming console', '2024-02-28', '2027-02-28', 'GC-017', 60, 'limited'),
  ('Toaster', 'Home Appliances', 49.99, 18.00, '2-slice toaster with multiple settings', '2024-03-25', '2025-03-25', 'TS-018', 70, 'active'),
  ('Microwave Oven', 'Home Appliances', 119.99, 55.00, 'Countertop microwave oven', '2024-01-12', '2025-01-12', 'MO-019', 50, 'active'),
  ('Vacuum Cleaner', 'Home Appliances', 149.99, 65.00, 'Cordless vacuum cleaner', '2024-02-18', '2025-02-18', 'VC-020', 40, 'active');

-- Seed users table
INSERT INTO users (name, email, role, joined_date, last_active, t1, t2, t3, usr_pref) 
VALUES 
  ('John Smith', 'john.smith@example.com', 'customer', '2023-01-15', '2024-05-10 10:30:00', true, false, false, '{"theme": "dark", "notifications": true}'),
  ('Jane Doe', 'jane.doe@example.com', 'customer', '2023-02-20', '2024-05-09 14:45:00', false, true, false, '{"theme": "light", "notifications": true}'),
  ('Robert Johnson', 'robert.j@example.com', 'customer', '2023-03-05', '2024-05-11 09:15:00', false, false, true, '{"theme": "dark", "notifications": false}'),
  ('Emily Wilson', 'emily.w@example.com', 'customer', '2023-01-10', '2024-05-10 16:20:00', true, true, false, '{"theme": "light", "notifications": true}'),
  ('Michael Brown', 'michael.b@example.com', 'customer', '2023-02-15', '2024-05-11 11:30:00', false, true, false, '{"theme": "dark", "notifications": true}'),
  ('Sarah Davis', 'sarah.d@example.com', 'customer', '2023-03-10', '2024-05-09 13:45:00', false, false, true, '{"theme": "light", "notifications": false}'),
  ('David Miller', 'david.m@example.com', 'customer', '2023-01-05', '2024-05-10 10:15:00', true, false, false, '{"theme": "dark", "notifications": true}'),
  ('Lisa Taylor', 'lisa.t@example.com', 'customer', '2023-02-10', '2024-05-11 15:30:00', false, true, false, '{"theme": "light", "notifications": true}'),
  ('James Anderson', 'james.a@example.com', 'customer', '2023-03-15', '2024-05-09 09:45:00', false, false, true, '{"theme": "dark", "notifications": false}'),
  ('Jennifer Thomas', 'jennifer.t@example.com', 'customer', '2023-01-20', '2024-05-10 14:15:00', true, true, false, '{"theme": "light", "notifications": true}'),
  ('William Jackson', 'william.j@example.com', 'customer', '2023-02-25', '2024-05-11 10:30:00', false, true, false, '{"theme": "dark", "notifications": true}'),
  ('Linda White', 'linda.w@example.com', 'customer', '2023-03-01', '2024-05-09 16:45:00', false, false, true, '{"theme": "light", "notifications": false}'),
  ('Richard Harris', 'richard.h@example.com', 'customer', '2023-01-25', '2024-05-10 11:15:00', true, false, false, '{"theme": "dark", "notifications": true}'),
  ('Patricia Martin', 'patricia.m@example.com', 'customer', '2023-02-05', '2024-05-11 13:30:00', false, true, false, '{"theme": "light", "notifications": true}'),
  ('Thomas Thompson', 'thomas.t@example.com', 'customer', '2023-03-20', '2024-05-09 10:45:00', false, false, true, '{"theme": "dark", "notifications": false}');

-- Seed inventory table
INSERT INTO inventory (product_id, region_id, qty_available, last_restocked, min_stock_level, max_stock_level, "flag") 
VALUES 
  (1, 1, 25, '2024-05-01 08:00:00', 10, 50, 'normal'),
  (1, 2, 18, '2024-05-01 09:30:00', 10, 50, 'normal'),
  (1, 3, 15, '2024-05-01 10:15:00', 10, 50, 'normal'),
  (2, 1, 40, '2024-05-02 08:00:00', 15, 60, 'normal'),
  (2, 2, 35, '2024-05-02 09:30:00', 15, 60, 'normal'),
  (2, 3, 30, '2024-05-02 10:15:00', 15, 60, 'normal'),
  (3, 1, 30, '2024-05-03 08:00:00', 10, 50, 'normal'),
  (3, 2, 25, '2024-05-03 09:30:00', 10, 50, 'normal'),
  (3, 3, 20, '2024-05-03 10:15:00', 10, 50, 'normal'),
  (4, 4, 15, '2024-05-04 08:00:00', 5, 30, 'normal'),
  (4, 5, 12, '2024-05-04 09:30:00', 5, 30, 'low'),
  (4, 6, 8, '2024-05-04 10:15:00', 5, 30, 'low'),
  (5, 4, 18, '2024-05-05 08:00:00', 5, 30, 'normal'),
  (5, 5, 15, '2024-05-05 09:30:00', 5, 30, 'normal'),
  (5, 6, 10, '2024-05-05 10:15:00', 5, 30, 'normal'),
  (6, 7, 20, '2024-05-06 08:00:00', 10, 40, 'normal'),
  (6, 8, 18, '2024-05-06 09:30:00', 10, 40, 'normal'),
  (6, 9, 15, '2024-05-06 10:15:00', 10, 40, 'normal'),
  (7, 7, 12, '2024-05-07 08:00:00', 5, 20, 'normal'),
  (7, 8, 10, '2024-05-07 09:30:00', 5, 20, 'normal'),
  (7, 9, 8, '2024-05-07 10:15:00', 5, 20, 'low'),
  (8, 10, 8, '2024-05-08 08:00:00', 5, 20, 'low'),
  (8, 11, 6, '2024-05-08 09:30:00', 5, 20, 'low'),
  (8, 12, 4, '2024-05-08 10:15:00', 5, 20, 'critical'),
  (9, 10, 25, '2024-05-09 08:00:00', 10, 40, 'normal'),
  (9, 11, 20, '2024-05-09 09:30:00', 10, 40, 'normal'),
  (9, 12, 15, '2024-05-09 10:15:00', 10, 40, 'normal'),
  (10, 13, 20, '2024-05-10 08:00:00', 10, 40, 'normal'),
  (10, 14, 18, '2024-05-10 09:30:00', 10, 40, 'normal'),
  (10, 15, 15, '2024-05-10 10:15:00', 10, 40, 'normal');

-- Seed sales table with data including Q1, Q2, Q3, Q4 periods to simulate quarterly sales
-- Q1 sales (January-March)
INSERT INTO sales (date, amount, product_id, user_id, region_id, qty, dscnt, c1, c2, p1, p2, s) 
VALUES 
  -- January sales
  ('2024-01-05', 1299.99, 1, 1, 1, 1, 0, 'online', 'new-year', false, false, 9),
  ('2024-01-10', 1799.98, 1, 2, 2, 2, 10, 'online', 'new-year', true, false, 8),
  ('2024-01-15', 899.99, 2, 3, 3, 1, 0, 'in-store', 'winter', false, false, 10),
  ('2024-01-20', 1799.98, 2, 4, 4, 2, 5, 'online', 'winter', true, false, 7),
  ('2024-01-25', 199.99, 3, 5, 5, 1, 0, 'in-store', 'winter', false, false, 9),
  ('2024-01-28', 399.98, 3, 6, 6, 2, 0, 'online', 'winter', false, false, 8),
  -- February sales
  ('2024-02-03', 89.99, 4, 7, 7, 1, 0, 'in-store', 'valentine', false, false, 7),
  ('2024-02-08', 179.98, 4, 8, 8, 2, 10, 'online', 'valentine', true, false, 8),
  ('2024-02-12', 79.99, 5, 9, 9, 1, 0, 'in-store', 'valentine', false, false, 9),
  ('2024-02-14', 159.98, 5, 10, 10, 2, 15, 'online', 'valentine', true, true, 10),
  ('2024-02-18', 249.99, 6, 11, 11, 1, 0, 'in-store', 'winter', false, false, 8),
  ('2024-02-22', 499.98, 6, 12, 12, 2, 5, 'online', 'winter', false, false, 7),
  -- March sales (lower due to seasonal factors in southern zone)
  ('2024-03-02', 159.99, 7, 13, 4, 1, 0, 'in-store', 'spring', false, false, 8),
  ('2024-03-06', 319.98, 7, 14, 5, 2, 0, 'online', 'spring', false, false, 7),
  ('2024-03-10', 129.99, 8, 15, 4, 1, 0, 'in-store', 'spring', false, false, 9),
  ('2024-03-15', 259.98, 8, 1, 5, 2, 0, 'online', 'spring', false, false, 8),
  ('2024-03-20', 49.99, 9, 2, 4, 1, 0, 'in-store', 'spring', false, false, 7),
  ('2024-03-25', 99.98, 9, 3, 5, 2, 5, 'online', 'spring', true, false, 8),
  ('2024-03-30', 29.99, 10, 4, 4, 1, 0, 'in-store', 'spring', false, false, 9);

-- Q2 sales (April-June) with significantly lower sales in the southern zone
INSERT INTO sales (date, amount, product_id, user_id, region_id, qty, dscnt, c1, c2, p1, p2, s) 
VALUES 
  -- April sales
  ('2024-04-03', 1299.99, 1, 5, 1, 1, 0, 'online', 'spring', false, false, 8),
  ('2024-04-08', 1799.98, 1, 6, 2, 2, 5, 'online', 'spring', true, false, 7),
  ('2024-04-12', 899.99, 2, 7, 3, 1, 0, 'in-store', 'spring', false, false, 9),
  ('2024-04-15', 1799.98, 2, 8, 4, 2, 10, 'online', 'spring', true, false, 8),
  -- Reduced sales in southern zone
  ('2024-04-18', 89.99, 4, 9, 4, 1, 20, 'in-store', 'spring', true, true, 6),
  ('2024-04-22', 99.98, 5, 10, 5, 2, 25, 'online', 'spring', true, true, 5),
  -- May sales
  ('2024-05-01', 249.99, 6, 11, 6, 1, 0, 'in-store', 'may-sale', false, false, 8),
  ('2024-05-05', 499.98, 6, 12, 7, 2, 5, 'online', 'may-sale', true, false, 9),
  ('2024-05-09', 159.99, 7, 13, 8, 1, 0, 'in-store', 'may-sale', false, false, 7),
  ('2024-05-12', 319.98, 7, 14, 9, 2, 0, 'online', 'may-sale', false, false, 8),
  -- Reduced sales in southern zone
  ('2024-05-15', 49.99, 9, 15, 4, 1, 30, 'in-store', 'may-sale', true, true, 5),
  ('2024-05-18', 59.98, 9, 1, 5, 2, 35, 'online', 'may-sale', true, true, 4),
  -- June sales
  ('2024-06-02', 199.99, 3, 2, 10, 1, 0, 'in-store', 'summer', false, false, 9),
  ('2024-06-07', 399.98, 3, 3, 11, 2, 5, 'online', 'summer', true, false, 8),
  ('2024-06-12', 129.99, 8, 4, 12, 1, 0, 'in-store', 'summer', false, false, 7),
  ('2024-06-17', 259.98, 8, 5, 13, 2, 10, 'online', 'summer', true, false, 6),
  -- Reduced sales in southern zone
  ('2024-06-22', 99.99, 9, 6, 4, 1, 40, 'in-store', 'summer', true, true, 3),
  ('2024-06-27', 119.98, 10, 7, 5, 2, 45, 'online', 'summer', true, true, 2);

-- Q3 sales (July-September) with recovery in the southern zone
INSERT INTO sales (date, amount, product_id, user_id, region_id, qty, dscnt, c1, c2, p1, p2, s) 
VALUES 
  -- July sales with recovery in southern zone
  ('2024-07-03', 399.99, 16, 8, 4, 1, 10, 'in-store', 'summer', true, false, 7),
  ('2024-07-08', 799.98, 16, 9, 5, 2, 5, 'online', 'summer', true, false, 8),
  ('2024-07-12', 499.99, 17, 10, 4, 1, 0, 'in-store', 'summer', false, false, 9),
  ('2024-07-17', 999.98, 17, 11, 5, 2, 0, 'online', 'summer', false, false, 10),
  -- Other regions
  ('2024-07-22', 49.99, 18, 12, 1, 1, 0, 'in-store', 'summer', false, false, 8),
  ('2024-07-27', 99.98, 18, 13, 2, 2, 5, 'online', 'summer', true, false, 7),
  -- August sales with good performance in southern zone
  ('2024-08-02', 119.99, 19, 14, 4, 1, 0, 'in-store', 'back-to-school', false, false, 9),
  ('2024-08-07', 239.98, 19, 15, 5, 2, 0, 'online', 'back-to-school', false, false, 8),
  ('2024-08-12', 149.99, 20, 1, 4, 1, 5, 'in-store', 'back-to-school', true, false, 10),
  ('2024-08-17', 299.98, 20, 2, 5, 2, 10, 'online', 'back-to-school', true, false, 9),
  -- Other regions
  ('2024-08-22', 899.99, 2, 3, 6, 1, 0, 'in-store', 'back-to-school', false, false, 8),
  ('2024-08-27', 1799.98, 2, 4, 7, 2, 5, 'online', 'back-to-school', true, false, 7),
  -- September sales with strong performance in all zones
  ('2024-09-03', 199.99, 3, 5, 4, 1, 0, 'in-store', 'fall', false, false, 9),
  ('2024-09-08', 399.98, 3, 6, 5, 2, 0, 'online', 'fall', false, false, 10),
  ('2024-09-13', 1299.99, 1, 7, 4, 1, 5, 'in-store', 'fall', true, false, 8),
  ('2024-09-18', 2599.98, 1, 8, 5, 2, 10, 'online', 'fall', true, false, 9),
  ('2024-09-23', 899.99, 2, 9, 1, 1, 0, 'in-store', 'fall', false, false, 7),
  ('2024-09-28', 1799.98, 2, 10, 2, 2, 0, 'online', 'fall', false, false, 8);

-- Q4 sales (October-December)
INSERT INTO sales (date, amount, product_id, user_id, region_id, qty, dscnt, c1, c2, p1, p2, s) 
VALUES 
  -- October sales
  ('2024-10-03', 249.99, 6, 11, 10, 1, 0, 'in-store', 'fall', false, false, 9),
  ('2024-10-08', 499.98, 6, 12, 11, 2, 0, 'online', 'fall', false, false, 8),
  ('2024-10-13', 159.99, 7, 13, 12, 1, 5, 'in-store', 'fall', true, false, 7),
  ('2024-10-18', 319.98, 7, 14, 13, 2, 10, 'online', 'fall', true, false, 8),
  ('2024-10-23', 129.99, 8, 15, 14, 1, 0, 'in-store', 'fall', false, false, 9),
  ('2024-10-28', 259.98, 8, 1, 15, 2, 0, 'online', 'fall', false, false, 10),
  -- November sales (Black Friday)
  ('2024-11-03', 49.99, 9, 2, 1, 1, 15, 'in-store', 'black-friday', true, false, 8),
  ('2024-11-08', 99.98, 9, 3, 2, 2, 20, 'online', 'black-friday', true, true, 9),
  ('2024-11-13', 29.99, 10, 4, 3, 1, 10, 'in-store', 'black-friday', true, false, 7),
  ('2024-11-18', 59.98, 10, 5, 4, 2, 15, 'online', 'black-friday', true, true, 8),
  ('2024-11-23', 19.99, 11, 6, 5, 1, 30, 'in-store', 'black-friday', true, true, 10),
  ('2024-11-28', 39.98, 11, 7, 6, 2, 35, 'online', 'black-friday', true, true, 9),
  -- December sales (Holiday season)
  ('2024-12-03', 59.99, 12, 8, 7, 1, 0, 'in-store', 'holiday', false, false, 8),
  ('2024-12-08', 119.98, 12, 9, 8, 2, 5, 'online', 'holiday', true, false, 9),
  ('2024-12-13', 89.99, 13, 10, 9, 1, 0, 'in-store', 'holiday', false, false, 10),
  ('2024-12-18', 179.98, 13, 11, 10, 2, 10, 'online', 'holiday', true, false, 8),
  ('2024-12-23', 69.99, 14, 12, 11, 1, 0, 'in-store', 'holiday', false, false, 9),
  ('2024-12-28', 139.98, 14, 13, 12, 2, 0, 'online', 'holiday', false, false, 10);