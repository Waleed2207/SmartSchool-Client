import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFan,
  faFire,
  faSnowflake,
  faTint,
  faMagic,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: "#333",
    color: "#fff",
    fontSize: "14px",
    padding: "8px",
  },
}));

export const ModeControl = ({ acState }) => {
  const [acInternalState, setAcInternalState] = useState(acState);
  const [mode, setMode] = useState("cool");
  const [loading, setLoading] = useState(false);

  const fetchCurrentMode = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/sensibo`);
      console.log({ response });
      const currentMode = response.data.state.mode;
      setMode(currentMode);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching current mode:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentMode();
  }, []);


  const updateMode = async (newMode) => {
    try {
      const deviceId = "9EimtVDZ";
      const response = await axios.post(`${SERVER_URL}/sensibo/mode`, {
        deviceId,
        mode: newMode,
      });
      console.log("Mode updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating mode:", error);
    }
  };


  const onModeChange = async (newMode) => {
    setMode(newMode);
    await updateMode(newMode);
  };

  const classes = useStyles();
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
          <Tooltip
            title={tooltip}
            classes={{ tooltip: classes.tooltip }}
            key={id}
          >
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
