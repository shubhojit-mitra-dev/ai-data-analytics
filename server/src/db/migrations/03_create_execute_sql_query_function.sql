-- Create function to execute raw SQL queries via RPC
DROP FUNCTION IF EXISTS public.execute_sql_query(text);
CREATE OR REPLACE FUNCTION public.execute_sql_query(sql_query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Execute the incoming query and aggregate results into JSONB array
  EXECUTE format(
    'SELECT jsonb_agg(row_to_json(t)) FROM (%s) AS t',
    sql_query
  ) INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;