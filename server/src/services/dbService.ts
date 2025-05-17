import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Execute a SQL query against the Supabase database
 * @param sql The SQL query to execute
 * @returns The query results
 */
export const executeQuery = async (sql: string) => {
  try {
    // Debug: log the incoming SQL
    console.log('Raw SQL received:', sql);
    
    // Remove trailing semicolons which can cause syntax errors with RPC calls
    const cleanSql = sql.trim().replace(/;+$/, '');
    console.log('SQL after removing trailing semicolons:', cleanSql);
    
    // Remove comments, whitespace, and normalize before checking
    const normalizedSql = cleanSql
      .replace(/\/\*.*?\*\//gs, '') // Remove /* */ style comments
      .replace(/--.*?$/gm, '')     // Remove -- style comments
      .replace(/^\s+/gm, '')       // Remove leading whitespace from each line
      .trim();
    // Debug: log the normalized SQL
    console.log('Normalized SQL for validation:', normalizedSql);
    
    // More robust check - extract and validate the first significant SQL command
    const sqlWithoutLeadingComments = normalizedSql.replace(/^(\s|\/\*[\s\S]*?\*\/|--.*?[\r\n])*/, '');
    const firstKeyword = sqlWithoutLeadingComments.split(/\s+/)[0].toUpperCase();
    
    if (firstKeyword === 'SELECT' || firstKeyword === 'WITH') {
      // Use 'products' table for connection test instead of 'queries'
      const { data, error } = await supabase.from('products').select('*').limit(0);
      
      if (error) {
        throw new Error(`Supabase connection error: ${error.message}`);
      }
      
      // Execute the raw SQL query with cleaned SQL (no trailing semicolons)
      const { data: results, error: queryError } = await supabase.rpc('execute_sql_query', {
        sql_query: cleanSql
      });
      
      if (queryError) {
        throw new Error(`Query execution error: ${queryError.message}`);
      }
      
      return results;
    } else {
      console.error('Non-SELECT query attempted:', sqlWithoutLeadingComments);
      throw new Error('Only SELECT queries are supported for security reasons');
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get database schema information
 * @returns Schema information for prompt engineering
 */
export const getSchemaInfo = async () => {
  return `
    Table regions: id (serial), name (varchar), country (varchar), zone (varchar), population (integer), economic_index (numeric), Q1 (boolean), Q2 (boolean), Q3 (boolean), Q4 (boolean), x_factor (numeric)
    
    Table products: id (serial), name (varchar), category (varchar), price (numeric), cost (numeric), prd_desc (text), mfg_date (date), exp_date (date), prd_code (varchar), stock (integer), status (varchar)
    
    Table users: id (serial), name (varchar), email (varchar), role (varchar), joined_date (date), last_active (timestamp), t1 (boolean), t2 (boolean), t3 (boolean), usr_pref (jsonb)
    
    Table sales: id (serial), date (date), amount (numeric), product_id (integer), user_id (integer), region_id (integer), qty (integer), dscnt (numeric), c1 (varchar), c2 (varchar), p1 (boolean), p2 (boolean), s (integer), ts (timestamp)
    
    Table inventory: id (serial), product_id (integer), region_id (integer), qty_available (integer), last_restocked (timestamp), min_stock_level (integer), max_stock_level (integer), flag (varchar)
    
    Relationships:
    - sales.product_id references products.id
    - sales.user_id references users.id
    - sales.region_id references regions.id
    - inventory.product_id references products.id
    - inventory.region_id references regions.id
  `;
};