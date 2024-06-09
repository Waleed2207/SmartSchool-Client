import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import DeviceSelector from '../../components/DeviceSelector/DeviceSelector';
import LineChart from '../../components/LineChart/LineChart';
import styles from './Insights.module.scss';
import { SERVER_URL } from '../../consts';
import { staticGraphData, chartOptions } from '../../components/GraphData/GraphData';

const Insights = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const availableYears = [2020, 2021, 2022, 2023];
    const [selectedYear, setSelectedYear] = useState(availableYears[3]);
    const [graphData, setGraphData] = useState(staticGraphData);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api-device/devices`);
                if (isMounted) {
                    setDevices(response.data);
                    setSelectedDevice(response.data[0]?.device);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error(error);
                    setError(error);
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const generateRandomGraphData = useCallback(() => {
        console.log('Generating random graph data for device:', selectedDevice, 'and year:', selectedYear);
        const newGraphData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Energy Consumption',
                    data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
        console.log('New graph data:', newGraphData);
        setGraphData(newGraphData);
    }, [selectedDevice, selectedYear]);

    useEffect(() => {
        if (selectedDevice) {
            generateRandomGraphData();
        }
    }, [selectedDevice, generateRandomGraphData]);

    const handleDeviceChange = (event) => {
        setSelectedDevice(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    if (loading) {
        return <div>Loading devices...</div>;
    }

    if (error) {
        return <div>Error fetching devices: {error.message}</div>;
    }

    return (
        <div>
            <Header title="Energy Consumption Insights" />
            {devices.length > 0 && (
                <div className={styles.selectorsContainer}>
                    <DeviceSelector
                        selectedDevice={selectedDevice}
                        onSelectDevice={handleDeviceChange}
                    />
                    <div>
                        <label>Year:</label>
                        <select value={selectedYear} onChange={handleYearChange}>
                            {availableYears.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
            <div className={styles.graphContainer}>
                <LineChart graphData={graphData} options={chartOptions} />
            </div>
        </div>
    );
};

export default Insights;
