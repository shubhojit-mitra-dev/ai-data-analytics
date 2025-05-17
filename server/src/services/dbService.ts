import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

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
    const { data, error } = await supabase.rpc('execute_sql_query', { query: sql });
    
    if (error) {
      throw new Error(`Database query error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};