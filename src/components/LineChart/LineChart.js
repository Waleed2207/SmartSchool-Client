import React from 'react';
import { Chart , CategoryScale, Title, Tooltip, Legend ,PointElement, LineElement, LinearScale} from 'chart.js';
import { Line } from 'react-chartjs-2'; // Import the Line component

import { BarElement, BarController } from 'chart.js';
Chart.register(BarElement, LinearScale, BarController, Title, Tooltip, Legend,PointElement, LineElement, CategoryScale);


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
