import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import DeviceSelector from '../../components/DeviceSelector/DeviceSelector';
import LineChart from '../../components/LineChart/LineChart'; // Ensure this import is correct
import { staticGraphData, chartOptions } from '../../components/GraphData/GraphData';
import styles from './Insights.module.scss';
import { SERVER_URL } from '../../consts';
//import { Bar } from 'some-chart-library';
const Insights = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const availableYears = [2020, 2021, 2022, 2023];
    const [selectedYear, setSelectedYear] = useState(availableYears[0]);

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
                <LineChart graphData={staticGraphData} options={chartOptions} />
            </div>
        </div>
    );
};

export default Insights;
