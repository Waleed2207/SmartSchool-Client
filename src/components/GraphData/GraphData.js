// GraphData.js
export const staticGraphData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
        {
            label: 'Energy Consumption',
            data: [65, 59, 80, 81, 56, 55, 40, 45, 65, 59, 70, 75],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: 'rgb(75, 192, 192)',
        },
        {
            label: 'Average Energy Consumption',
            data: new Array(12).fill(50),
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            borderDash: [5, 5],
        }
    ],
};

export const chartOptions = {
    responsive: true,
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
