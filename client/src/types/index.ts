// Define the structure of the API response from our backend
export interface QueryResult {
  results: Record<string, string | number | boolean | null | undefined>[];
  sql: string;
  explanation: string;
  naturalLanguageResponse?: string;
}

// Type for chart data when working with visualization components
export interface ChartData {
  [key: string]: string | number | boolean | null;
}