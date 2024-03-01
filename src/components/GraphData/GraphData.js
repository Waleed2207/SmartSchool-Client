export const staticGraphData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        type: 'bar', // Specify the type as bar to create a bar chart
        label: 'Energy Consumption',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 65, 59, 70, 75],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        type: 'line', // Specify the type as line for the average line
        label: 'Average Energy Consumption',
        data: new Array(12).fill(50), // This will create a horizontal line at y=50
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0, // No points for the line
      }
    ],
  };
  
  export const chartOptions = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Energy Consumption Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Energy Consumption (kW)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };
  