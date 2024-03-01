import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import DeviceSelector from '../../components/DeviceSelector/DeviceSelector';
import Graph from '../../components/Graph/Graph';
import { staticGraphData, chartOptions } from '../../components/GraphData/GraphData';
import styles from './Insights.module.scss'; // Make sure this is the correct path to your styles file
import { SERVER_URL } from '../../consts'; // Ensure SERVER_URL is correctly defined

const Insights = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Define the available years and selected year
    const availableYears = [2020, 2021, 2022, 2023]; // Example years
    const [selectedYear, setSelectedYear] = useState(availableYears[0]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api-device/devices`);
                if (isMounted) {
                    setDevices(response.data);
                    setSelectedDevice(response.data[0]?.device); // Set to the first device by default
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

    const handleDeviceChange = (event) => {
        setSelectedDevice(event.target.value);
    };

    // Handler for year selection change
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        // Here, you can also perform actions based on the new year selection,
        // such as fetching new data or updating graphs.
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
                    {/* Year Selector */}
                    <div>
                        <label>Year:</label>
                        <select
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
            <div className={styles.graphContainer}> {/* Apply styles here */}
                <Graph data={staticGraphData} options={chartOptions} />
            </div>
        </div>
    );
};

export default Insights;
