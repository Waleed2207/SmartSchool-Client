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
import { Tooltip } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../../consts";

const ModeButton = styled.button(({ color }) => ({
  margin: '0 5px',
  border: 'none',
  backgroundColor: 'transparent',
  color: color,
  fontWeight: color !== 'transparent' ? 'bold' : 'normal',
  cursor: 'pointer',
  '&:hover': {
    color: color !== 'transparent' ? color : '#888',
  },
}));

const ModeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

export const ModeControl = ({ acState, device_room_idds }) => {
  const [loading, setLoading] = useState(false); // State for loading status
  const [acInternalState, setAcInternalState] = useState(acState); // State for the internal AC state
  const [mode, setMode] = useState("cool"); // State for the current mode
  const onModeChange = async (newMode) => {
    setMode(newMode);
    // ...rest of your logic to update the mode
  };
  const tooltipStyle = {
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '14px',
    padding: '8px',
  };

  // ...useEffect and other functions

  const modes = [
    { id: "cool", icon: faSnowflake, color: "blue", tooltip: "Cool" },
    // ...other modes
  ];

  return (
    <ModeContainer>
      {loading ? (
        <p>Loading mode...</p>
      ) : (
        modes.map(({ id, icon, color, tooltip }) => (
          <Tooltip
            title={tooltip}
            sx={tooltipStyle}
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
