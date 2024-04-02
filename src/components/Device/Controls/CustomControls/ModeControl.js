import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan, faFire, faSnowflake, faTint, faMagic } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../../consts";

const ModeButton = styled.button`
  margin: 0 5px;
  border: none;
  background-color: transparent;
  color: ${({ color }) => color};
  font-weight: ${({ color }) => (color !== "transparent" ? "bold" : "normal")};
  cursor: pointer;
  &:hover {
    color: ${({ color }) => (color !== "transparent" ? color : "#888")};
  }
`;

const ModeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

export const ModeControl = ({ acState, device_room_idds }) => {
  const [acInternalState, setAcInternalState] = useState(acState);
  const [mode, setMode] = useState("cool");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentMode = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}/api-sensors/sensibo`);
        if (response.data && response.data.mode) {
          setMode(response.data.mode);
        } else {
          console.error("Unexpected response structure:", response.data);
          setMode("cool"); // Example default value
        }
      } catch (error) {
        console.error("Error fetching current mode:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMode();
  }, [device_room_idds]);

  const updateMode = async (newMode) => {
    try {
      const deviceId = "4ahpAkJ9"; // Example device ID
      await axios.post(`${SERVER_URL}/api-sensors/sensibo/mode`, { deviceId, mode: newMode });
      console.log("Mode updated successfully");
    } catch (error) {
      console.error("Error updating mode:", error);
    }
  };

  const onModeChange = async (newMode) => {
    setMode(newMode);
    await updateMode(newMode);
  };

  const modes = [
    { id: "cool", icon: faSnowflake, color: "blue", tooltip: "Cool" },
    { id: "heat", icon: faFire, color: "red", tooltip: "Heat" },
    { id: "fan", icon: faFan, color: "black", tooltip: "Fan" },
    { id: "dry", icon: faTint, color: "purple", tooltip: "Dry" },
    { id: "automatic", icon: faMagic, color: "green", tooltip: "Automatic" },
  ];

  return (
    <ModeContainer>
      {loading ? (
        <p>Loading mode...</p>
      ) : (
        modes.map(({ id, icon, color, tooltip }) => (
          <Tooltip title={tooltip} key={id} sx={{ backgroundColor: "#333", color: "#fff", fontSize: "14px", padding: "8px" }}>
            <ModeButton
              color={acInternalState && mode === id ? color : "grey"}
              onClick={() => {
                onModeChange(id);
                setAcInternalState(!acInternalState);
              }}
            >
              <FontAwesomeIcon icon={icon} size="3x" />
            </ModeButton>
          </Tooltip>
        ))
      )}
    </ModeContainer>
  );
};
