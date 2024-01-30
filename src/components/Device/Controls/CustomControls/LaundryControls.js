// import Switch from '@mui/material/Switch';
// import { Button, CircularProgress, Snackbar, MuiAlert } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWater,
  faThermometerHalf,
  faSpinner,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import { SERVER_URL } from "../../../../consts";
import _ from "lodash";
import {
  LaundryControlsContainer,
  LaundrySpinContainer,
  LaundryTemperatureContainer,
  RinseContainer,
  SelectContainer,
} from "./controls.style";
import styled from "styled-components";

export const LaundryControls = () => {
  const [currentLaundryDetails, setCurrentLaundryDetails] = useState(null);

  useEffect(() => {
    const fetchLaundryDetails = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/laundry/details`);
        const data = await response.data;
        data.spin = data.spin === 0 ? "No spin" : `${data.spin} rpm`;
        setCurrentLaundryDetails(data);
      } catch (error) {
        console.error("Failed to fetch laundry details:", error);
      }
    };

    fetchLaundryDetails();
  }, []);

  const updateLaundryDetails = (key, value) => {
    const updatedDetails = { ...currentLaundryDetails, [key]: value };
    setCurrentLaundryDetails({ ...currentLaundryDetails, [key]: value });
    updateLaundryDetailsServer(updatedDetails);
  };

  const updateLaundryDetailsServer = async (updatedDetails) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/laundry/update`,
        updatedDetails
      );
      console.log("Updated laundry details on the server: ", response.data);
    } catch (error) {
      console.error("Failed to update laundry details on the server:", error);
    }
  };

  const temperatureOptions = [20, 30, 40, 60, 90];
  const rinseOptions = [1, 2, 3, 4, 5];
  const spinOptions = [
    "No spin",
    "Rinse Hold",
    "400 rpm",
    "800 rpm",
    "1000 rpm",
    "1200 rpm",
    "1400 rpm",
  ];

  return (
    <LaundryControlsContainer>
      <RinseContainer>
        <p style={{ marginBottom: "1.5rem" }}>Rinse:</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon icon={faWater} size="1x" />
          <SelectContainer>
            <Select
              value={_.get(currentLaundryDetails, "rinse", "2")}
              onChange={(e) => updateLaundryDetails("rinse", e.target.value)}
            >
              {rinseOptions.map((rinse) => (
                <MenuItem value={rinse} key={rinse}>
                  {rinse} time{rinse > 1 ? "s" : ""}
                </MenuItem>
              ))}
            </Select>
          </SelectContainer>
        </div>
      </RinseContainer>
      <LaundryTemperatureContainer>
        <p style={{ marginBottom: "1.5rem" }}>Temperature:</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon icon={faThermometerHalf} size="1x" />
          <SelectContainer>
            <Select
              value={_.get(currentLaundryDetails, "temperature", "60")}
              onChange={(e) =>
                updateLaundryDetails("temperature", e.target.value)
              }
            >
              {temperatureOptions.map((temp) => (
                <MenuItem value={temp} key={temp}>
                  {temp}°C
                </MenuItem>
              ))}
            </Select>
          </SelectContainer>
        </div>
      </LaundryTemperatureContainer>
      <LaundrySpinContainer>
        <p style={{ marginBottom: "1.5rem" }}>Spin:</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon icon={faCircleNotch} size="1x" />
          <SelectContainer>
            <Select
              value={_.get(currentLaundryDetails, "spin", "800 rpm")}
              onChange={(e) => updateLaundryDetails("spin", e.target.value)}
            >
              {spinOptions.map((spin) => (
                <MenuItem value={spin} key={spin}>
                  {spin}
                </MenuItem>
              ))}
            </Select>
          </SelectContainer>
        </div>
      </LaundrySpinContainer>
    </LaundryControlsContainer>
  );
};
