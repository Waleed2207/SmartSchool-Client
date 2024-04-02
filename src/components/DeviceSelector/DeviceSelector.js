import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../consts'; // Make sure to define this constant

const DeviceSelector = ({ selectedDevice, onSelectDevice }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    let isMounted = true; // Track whether the component is mounted

    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api-device/devices`);
        if (isMounted) {
          setDevices(response.data);
          if (selectedDevice === null) {
            onSelectDevice(response.data[0].device);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching devices:', error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Clean up the isMounted flag when the component unmounts
    };
  }, [selectedDevice, onSelectDevice]);

  return (
    <div>
      <label>Device:</label>
      <select value={selectedDevice} onChange={onSelectDevice}>
        {devices.map((device) => (
          <option key={device.device} value={device.device}>
            {device.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DeviceSelector;
