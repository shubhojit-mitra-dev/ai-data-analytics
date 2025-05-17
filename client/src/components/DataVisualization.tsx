import { useEffect, useRef, useState } from 'react';
import type { QueryResult } from '../types';

interface DataVisualizationProps {
  data: QueryResult;
}

const DataVisualization = ({ data }: DataVisualizationProps) => {
  const { results } = data;
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Function to determine if data is suitable for visualization
  const canVisualize = (data: Record<string, unknown>[]): boolean => {
    // Need at least one record
    if (data.length === 0) return false;
    
    // Need at least one numeric field for basic charts
    const sample = data[0];
    const fields = Object.keys(sample);
    
    const numericFields = fields.filter(
      field => typeof sample[field] === 'number'
    );
    
    return numericFields.length > 0;
  };

  useEffect(() => {
    if (!chartRef.current || !canVisualize(results)) return;

    // Basic canvas-based chart rendering
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determine fields to use
    const fields = Object.keys(results[0]);
    const numericFields = fields.filter(field => 
      typeof results[0][field] === 'number' && results[0][field] !== null
    );
    
    const categoricalFields = fields.filter(field => 
      typeof results[0][field] === 'string' || 
      (typeof results[0][field] === 'object' && results[0][field] !== null)
    );

    // Use the first numeric field for values
    const valueField = numericFields[0];
    
    // Use the first categorical field for labels 
    // If no categorical field, use index
    const labelField = categoricalFields.length > 0 ? categoricalFields[0] : '';

    // Prepare data
    const chartValues = results.map(row => Number(row[valueField]) || 0);
    const chartLabels = labelField ? results.map(row => String(row[labelField] || '')) : 
                                     results.map((_, index) => `Item ${index + 1}`);

    // Find min and max values for scaling
    const maxValue = Math.max(...chartValues);
    const valueScale = canvas.height / (maxValue || 1);

    // Chart configuration
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    ctx.font = '10px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';

    // Draw title
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${valueField} by ${labelField || 'Item'}`, canvas.width / 2, 15);
    ctx.font = '10px Arial';

    if (chartType === 'bar') {
      const barWidth = chartWidth / chartValues.length * 0.8;
      const barSpacing = chartWidth / chartValues.length * 0.2;
      
      // Draw bars
      chartValues.forEach((value, i) => {
        const barHeight = value * valueScale * 0.9; // 90% of chart height
        const x = padding.left + i * (barWidth + barSpacing) + barSpacing/2;
        const y = canvas.height - padding.bottom - barHeight;
        
        // Draw bar
        ctx.fillStyle = `hsl(${210 + i*15}, 70%, 60%)`;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.fillText(
          chartLabels[i].substring(0, 8) + (chartLabels[i].length > 8 ? '...' : ''), 
          x + barWidth/2, 
          canvas.height - padding.bottom + 15
        );
        
        // Draw value on top of bar
        ctx.fillText(
          value.toString(), 
          x + barWidth/2, 
          y - 5
        );
      });
    } else if (chartType === 'line') {
      // Draw line chart
      const pointWidth = chartWidth / (chartValues.length - 1);
      
      // Draw axes
      ctx.strokeStyle = '#ccc';
      ctx.beginPath();
      ctx.moveTo(padding.left, canvas.height - padding.bottom);
      ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom);
      ctx.stroke();
      
      // Draw line
      ctx.strokeStyle = 'rgb(59, 130, 246)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      chartValues.forEach((value, i) => {
        const x = padding.left + i * pointWidth;
        const y = canvas.height - padding.bottom - (value * valueScale * 0.9);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Draw data point
        ctx.fillStyle = 'rgb(59, 130, 246)';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.fillText(
          chartLabels[i].substring(0, 8) + (chartLabels[i].length > 8 ? '...' : ''), 
          x, 
          canvas.height - padding.bottom + 15
        );
        
        // Draw value on top of point
        ctx.fillText(value.toString(), x, y - 10);
      });
      
      ctx.stroke();
    } else if (chartType === 'pie') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2 * 0.8;
      
      let total = chartValues.reduce((sum, value) => sum + value, 0);
      if (total === 0) total = 1; // Avoid division by zero
      
      let startAngle = 0;
      
      // Draw pie slices
      chartValues.forEach((value, i) => {
        const sliceAngle = 2 * Math.PI * (value / total);
        
        ctx.fillStyle = `hsl(${210 + i*25}, 70%, 60%)`;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        // Draw label line and text
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 1.2;
        const labelX = centerX + Math.cos(midAngle) * labelRadius;
        const labelY = centerY + Math.sin(midAngle) * labelRadius;
        
        ctx.fillStyle = '#333';
        ctx.textAlign = labelX > centerX ? 'left' : 'right';
        ctx.fillText(
          `${chartLabels[i]} (${value})`, 
          labelX, 
          labelY
        );
        
        startAngle += sliceAngle;
      });
    }

  }, [results, chartType]);

  if (!canVisualize(results)) {
    return (
      <div className="bg-white rounded-md p-4 border border-gray-200">
        <p className="text-gray-500 text-center">
          The query results don't contain suitable data for visualization.
          <br />
          Charts require at least one numeric field.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Data Visualization</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              chartType === 'line' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setChartType('line')}
          >
            Line Chart
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              chartType === 'pie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setChartType('pie')}
          >
            Pie Chart
          </button>
        </div>
      </div>
      
      <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
        <canvas 
          ref={chartRef} 
          width={600} 
          height={300} 
          className="w-full h-full"
        />
      </div>
      
      <p className="mt-2 text-xs text-gray-500">
        Note: This is a simple chart implementation. For more advanced visualizations, 
        consider using libraries like Chart.js, Recharts, or D3.js.
      </p>
    </div>
  );
};

export default DataVisualization;