import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import type { QueryResult, ChartData } from '../types';

interface DataVisualizationProps {
  data: QueryResult | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const DataVisualization = ({ data }: DataVisualizationProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [xKey, setXKey] = useState<string>('');
  const [yKey, setYKey] = useState<string>('');
  const [availableKeys, setAvailableKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!data?.results || data.results.length === 0) {
      setChartData([]);
      setAvailableKeys([]);
      return;
    }

    // Get all keys from the first item
    const keys = Object.keys(data.results[0]);
    setAvailableKeys(keys);

    // Try to guess numeric values for Y axis and text/date for X axis
    const numericKeys = keys.filter(key => 
      typeof data.results[0][key] === 'number'
    );
    
    const nonNumericKeys = keys.filter(key => 
      typeof data.results[0][key] !== 'number'
    );

    // Set default X and Y keys
    if (nonNumericKeys.length > 0 && numericKeys.length > 0) {
      setXKey(nonNumericKeys[0]);
      setYKey(numericKeys[0]);
    } else if (keys.length >= 2) {
      setXKey(keys[0]);
      setYKey(keys[1]);
    }

    // Format data for charts
    if (data.results.length <= 10) {
      // For small datasets, we can use the data directly
      setChartData(data.results as ChartData[]);
    } else {
      // For larger datasets, take first 10 items
      setChartData(data.results.slice(0, 10) as ChartData[]);
    }

    // Guess the best chart type based on data
    if (data.results.length <= 5) {
      setChartType('pie');
    } else if (nonNumericKeys.includes('date') || nonNumericKeys.some(k => k.includes('date') || k.includes('time'))) {
      setChartType('line');
    } else {
      setChartType('bar');
    }
  }, [data]);

  if (!data || !data.results || data.results.length === 0 || chartData.length === 0) {
    return null;
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                nameKey={xKey}
                dataKey={yKey}
                outerRadius={150}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-8">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="chart-type" className="block text-sm font-medium text-gray-700">
            Chart Type
          </label>
          <select
            id="chart-type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="x-axis" className="block text-sm font-medium text-gray-700">
            X Axis
          </label>
          <select
            id="x-axis"
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {availableKeys.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="y-axis" className="block text-sm font-medium text-gray-700">
            Y Axis / Value
          </label>
          <select
            id="y-axis"
            value={yKey}
            onChange={(e) => setYKey(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {availableKeys.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      </div>
      
      {renderChart()}
    </div>
  );
};

export default DataVisualization;