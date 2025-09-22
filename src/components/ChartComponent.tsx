import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { ChartData } from '../services/chartService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartComponentProps {
  chartData: ChartData;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData }) => {
  const renderChart = () => {
    switch (chartData.type) {
      case 'bar':
        return <Bar data={chartData.data} options={chartData.options} />;
      case 'line':
        return <Line data={chartData.data} options={chartData.options} />;
      case 'doughnut':
        return <Doughnut data={chartData.data} options={chartData.options} />;
      case 'pie':
        return <Pie data={chartData.data} options={chartData.options} />;
      default:
        return <Bar data={chartData.data} options={chartData.options} />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 my-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">{chartData.title}</h4>
      <div className="h-80">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartComponent;
