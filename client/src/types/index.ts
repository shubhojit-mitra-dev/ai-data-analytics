export interface QueryResult {
  results: Record<string, unknown>[];
  sql: string;
  explanation: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number | unknown;
}