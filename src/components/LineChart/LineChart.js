import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2'; // Import the Line component

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Your custom component to display the line chart
const LineChart = ({ graphData, options }) => { // Include options in the props
  return (
    <Line
      data={graphData} // Use the graphData prop directly
      options={options} // Use the options prop
    />
  );
};

export default LineChart;
