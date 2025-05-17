import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Execute a SQL query on the Supabase database
 * @param sql The SQL query to execute
 * @returns The query results
 */
export const executeQuery = async (sql: string) => {
  try {
    console.log('Executing SQL query:', sql);
    const { data, error } = await supabase.rpc('execute_sql_query', { query: sql });
    
    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database query error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

/**
 * Get database schema information
 * @returns Schema information for prompt engineering
 */
export const getSchemaInfo = async () => {
  const tables = [
    {
      name: 'regions',
      description: 'Contains geographic regions data with cryptic columns Q1-Q4 representing activity in quarters',
      columns: [
        { name: 'id', type: 'serial', description: 'Primary key' },
        { name: 'name', type: 'varchar', description: 'Region name' },
        { name: 'country', type: 'varchar', description: 'Country name' },
        { name: 'zone', type: 'varchar', description: 'Geographic zone (North, South, East, West, Central)' },
        { name: 'population', type: 'integer', description: 'Population count' },
        { name: 'economic_index', type: 'numeric', description: 'Economic performance indicator' },
        { name: 'Q1', type: 'boolean', description: 'Whether region was active in Q1' },
        { name: 'Q2', type: 'boolean', description: 'Whether region was active in Q2' },
        { name: 'Q3', type: 'boolean', description: 'Whether region was active in Q3' },
        { name: 'Q4', type: 'boolean', description: 'Whether region was active in Q4' },
        { name: 'x_factor', type: 'numeric', description: 'Ambiguous performance metric' }
      ]
    },
    {
      name: 'products',
      description: 'Product catalog with details and inventory info',
      columns: [
        { name: 'id', type: 'serial', description: 'Primary key' },
        { name: 'name', type: 'varchar', description: 'Product name' },
        { name: 'category', type: 'varchar', description: 'Product category' },
        { name: 'price', type: 'numeric', description: 'Retail price' },
        { name: 'cost', type: 'numeric', description: 'Cost to company' },
        { name: 'prd_desc', type: 'text', description: 'Product description' },
        { name: 'mfg_date', type: 'date', description: 'Manufacturing date' },
        { name: 'exp_date', type: 'date', description: 'Expiration date if applicable' },
        { name: 'prd_code', type: 'varchar', description: 'Product code/SKU' },
        { name: 'stock', type: 'integer', description: 'Total stock available' },
        { name: 'status', type: 'varchar', description: 'Product status (active, discontinued, etc.)' }
      ]
    },
    {
      name: 'users',
      description: 'Customer information with cryptic tier indicators',
      columns: [
        { name: 'id', type: 'serial', description: 'Primary key' },
        { name: 'name', type: 'varchar', description: 'Customer name' },
        { name: 'email', type: 'varchar', description: 'Customer email' },
        { name: 'role', type: 'varchar', description: 'Customer role' },
        { name: 'joined_date', type: 'date', description: 'Date when customer joined' },
        { name: 'last_active', type: 'timestamp', description: 'Last activity timestamp' },
        { name: 't1', type: 'boolean', description: 'Tier 1 customer flag' },
        { name: 't2', type: 'boolean', description: 'Tier 2 customer flag' },
        { name: 't3', type: 'boolean', description: 'Tier 3 customer flag' },
        { name: 'usr_pref', type: 'jsonb', description: 'User preferences in JSON format' }
      ]
    },
    {
      name: 'sales',
      description: 'Sales transactions with cryptic columns for channels and promotions',
      columns: [
        { name: 'id', type: 'serial', description: 'Primary key' },
        { name: 'date', type: 'date', description: 'Sale date' },
        { name: 'amount', type: 'numeric', description: 'Sale amount' },
        { name: 'product_id', type: 'integer', description: 'Foreign key to products' },
        { name: 'user_id', type: 'integer', description: 'Foreign key to users' },
        { name: 'region_id', type: 'integer', description: 'Foreign key to regions' },
        { name: 'qty', type: 'integer', description: 'Quantity sold' },
        { name: 'dscnt', type: 'numeric', description: 'Discount percentage applied' },
        { name: 'c1', type: 'varchar', description: 'Channel (online, in-store)' },
        { name: 'c2', type: 'varchar', description: 'Campaign code' },
        { name: 'p1', type: 'boolean', description: 'Promotion 1 applied' },
        { name: 'p2', type: 'boolean', description: 'Promotion 2 applied' },
        { name: 's', type: 'integer', description: 'Satisfaction score (1-10)' },
        { name: 'ts', type: 'timestamp', description: 'Timestamp of sale record' }
      ]
    },
    {
      name: 'inventory',
      description: 'Inventory levels by product and region',
      columns: [
        { name: 'id', type: 'serial', description: 'Primary key' },
        { name: 'product_id', type: 'integer', description: 'Foreign key to products' },
        { name: 'region_id', type: 'integer', description: 'Foreign key to regions' },
        { name: 'qty_available', type: 'integer', description: 'Quantity available in stock' },
        { name: 'last_restocked', type: 'timestamp', description: 'Last restock timestamp' },
        { name: 'min_stock_level', type: 'integer', description: 'Minimum stock level threshold' },
        { name: 'max_stock_level', type: 'integer', description: 'Maximum stock capacity' },
        { name: 'flag', type: 'varchar', description: 'Stock status flag (normal, low, critical)' }
      ]
    }
  ];
  
  return tables;
};