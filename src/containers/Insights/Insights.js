import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, LineController, LineElement, BarController, BarElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { generateMonthLabels, generateYears } from '../../utils/utils';
import styles from './Insights.module.scss';
import { Bar } from 'react-chartjs-2';




Chart.register(LineController, LineElement, BarController, BarElement, PointElement, LinearScale, CategoryScale);

const Insights = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [timeRange, setTimeRange] = useState('monthly');
  const [graphData, setGraphData] = useState({ labels: [], data: [] });
  const [selectedYear, setSelectedYear] = useState(2023);
  const [monthLabels, setMonthLabels] = useState(generateMonthLabels(selectedYear));

  const currentYear = new Date().getFullYear();
  const availableYears = generateYears(2020, currentYear);

  useEffect(() => {
    if (timeRange === 'monthly') {
      fetchGraphData(selectedDevice, timeRange, selectedYear);
    }
  }, [selectedYear]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/devices');
        if (isMounted) {
          setDevices(response.data);
          if (selectedDevice === null) {
            setSelectedDevice(response.data[0].device);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.log(error);
        }
      }
    };

    fetchData();

    const fetchAndUpdateGraphData = async () => {
      if (timeRange === 'monthly') {
        await fetchGraphData(selectedDevice, timeRange, selectedYear);
      } else {
        await fetchGraphData(selectedDevice, timeRange);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [selectedDevice, timeRange, selectedYear]);

  useEffect(() => {
    const fetchAndUpdateGraphData = async () => {
      if (timeRange === 'monthly') {
        await fetchGraphData(selectedDevice, timeRange, selectedYear);
      } else {
        await fetchGraphData(selectedDevice, timeRange);
      }
    };

    if (selectedDevice !== '') {
      fetchAndUpdateGraphData();
    }
  }, [selectedDevice, timeRange]);



  const fetchGraphData = async (device, timeRange, year = null) => {
    try {
      let avgEnergy = 0;
      const response = await axios.get('http://127.0.0.1:5000/graph-data', {
        params: { device, time_range: timeRange, year },
      });

      console.log(response.data)

      // Initialize an empty dataset for all months
      const monthLabels = generateMonthLabels(year);
      const emptyData = {
        labels: monthLabels,
        data: new Array(12).fill(0),
      };

      if (timeRange === 'monthly' && year !== null) {
        response.data.labels.forEach((label, index) => {
          const date = new Date(label);
          const monthIndex = date.getMonth();
          const labelYear = date.getFullYear();

          if (labelYear === year) {
            emptyData.data[monthIndex] = response.data.data[index];
          }
        });

        avgEnergy = emptyData.data.reduce((acc, cur) => acc + cur, 0) / 12;
      } else {
        emptyData.labels = response.data.labels;
        emptyData.data = response.data.data;
      }

      setGraphData({ ...emptyData, avgEnergy });
    } catch (error) {
      console.log(error);
    }
  };







  const handleSelectionChange = (e, type) => {
    if (type === 'device') {
      setSelectedDevice(e.target.value);
    } else if (type === 'timeRange') {
      setTimeRange(e.target.value);
    } else if (type === 'year') {
      setSelectedYear(parseInt(e.target.value));
    }
  };

  return (
    <div className={styles.insightsContainer}>
      <h1>Energy Consumption Insights</h1>
      <div className={styles.selectorsContainer}>
        <label>Device:</label>
        <select
          value={selectedDevice}
          onChange={(e) => handleSelectionChange(e, 'device')}
        >
          {devices.map((device) => (
            <option key={device.device} value={device.device}>
              {device.name}
            </option>
          ))}
        </select>
        <label>Time Range:</label>
        <select
          value={timeRange}
          onChange={(e) => handleSelectionChange(e, 'timeRange')}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        {timeRange === "monthly" && (
          <div>
            <label>Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => handleSelectionChange(e, 'year')}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className={styles.graphContainer}>
        {timeRange === "monthly" ? (
          <Bar
            data={{
              labels: graphData.labels,
              datasets: [
                {
                  label: "Energy Consumption",
                  data: graphData.data,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                },
                {
                  label: "Average Energy Consumption",
                  data: Array(12).fill(graphData.avgEnergy),
                  type: "line",
                  fill: false,
                  backgroundColor: "rgba(255, 0, 0, 1)",
                  borderColor: "rgba(255, 0, 0, 1)",
                  borderWidth: 2,
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  type: "category",
                  display: true,
                  grid: { display: false },
                  ticks: {
                    padding: 5,
                    callback: function (value, index, values) {
                      if (timeRange === "monthly") {
                        return monthLabels[index];
                      }
                      return value;
                    },
                    autoSkip: true,
                    maxTicksLimit: 12,
                    maxRotation: 0,
                    minRotation: 0,
                  },
                },
                y: {
                  type: "linear",
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Energy Consumption (kW)",
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  labels: {
                    boxWidth: 20,
                    padding: 10,
                  },
                },
              },
            }}
          />
        ) : (
          <Line
            data={{
              labels: graphData.labels,
              datasets: [
                {
                  label: "Energy Consumption",
                  data: graphData.data,
                  fill: false,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  type: "category",
                  display: true,
                  grid: { display: false },
                  ticks: {
                    padding: 5,
                    callback: function (value, index, values) {
                      if (timeRange === "monthly") {
                        return graphData.labels[index];
                      }
                      return value;
                    },
                    autoSkip: true,
                    maxTicksLimit: 12,
                    maxRotation: 0,
                    minRotation: 0,
                  },
                },
                y: {
                  type: "linear",
                  beginAtZero: true,
                },
              },
            }}
          />
        )}

      </div>
    </div>
  );


};

export default Insights;

