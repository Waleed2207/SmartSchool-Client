// import Switch from '@mui/material/Switch';
// import { Button, CircularProgress, Snackbar, MuiAlert } from '@material-ui/core';
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Temperature } from "./Controls/CustomControls/Temperature";
import { SnackBar } from "../Snackbar/SnackBar";
import Switch from "../UI/Switch/Switch";
import ModeControl from "./Controls/Mode/ModeControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import { SERVER_URL } from "../../consts";
import { AcControls } from "./Controls/CustomControls/AcControls";
import { LaundryControls } from "./Controls/CustomControls/LaundryControls";
import { PumpControls } from "./Controls/CustomControls/PumpControls";


const DeviceCard = styled.div`
  width: 18rem;
  min-width: 18rem;
  height: ${({ height }) => height};
  border: 1px solid;
  // margin: 1rem;
  padding: 1rem;
  border-radius: 10px;
  border-color: #e4e6eb;
  min-height: 8rem;
  // background-color: ${({ color }) => color}
  transition: width 0.4s, height 0.4s;
  &.expanded {
    height: 300px;
    width: ${({ isLaundryDevice }) => (isLaundryDevice ? "30rem" : "18rem")};
  }
`;

const ControlContainer = styled.div`
  transition: opacity 0.4s ease-in-out;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
`;

const TestBox = styled.div`
  width: 100px;
  height: 100px;
  background: red;
  transition: width 2s;

  &:hover {
    width: 300px;
  }
`;

// const DeviceCard = styled.div`
//   width: 100%;
//   background-color: white;
//   border: 1px solid;
//   padding: 1rem;
//   border-radius: 10px;
//   border-color: #e4e6eb;
//   min-height: 8rem;
//   overflow: hidden;
//   transition: height 0.3s ease-in-out;

//   &.expanded {
//     height: auto;
//   }
// `;

const DeviceContainer = styled.div`
  display: flex;
  width: 18rem;
  height: 50rem;
  gap: 1rem;
  flex-direction: column;
`;

const AcControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  // flex-wrap: wrap;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Controls = styled.div`
  display: flex;
`;

const StyledSwitch = styled(Switch)`
  && {
    color: blue;

    &:hover {
      background-color: green;
    }

    &.Mui-checked {
      color: blue;
    }

    &.Mui-checked:hover {
      background-color: yellow;
    }
  }
`;

const ShowControlsContainer = styled.div`
  width: 12rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  cursor: pointer;
`;


const ShowControlsIcon = styled(FontAwesomeIcon)`
  transition: transform 0.5s ease;

  ${({ rotate }) => rotate && css`transform: rotate(180deg)`}
`;

const ShowControlsText = styled.span`
  margin-left: 10px;
`;

const H2 = styled.p`
  font-size: 1.3rem;
`;

const ShowControls = ({ setOpenControlsCard, openControlsCard }) => {

  const [rotate, setRotate] = useState(false);

  return (
    <ShowControlsContainer
      onClick={() => {
        setOpenControlsCard(!openControlsCard);
        setRotate(!rotate);
      }}
    >
      <ShowControlsIcon
        icon={faChevronDown}
        size="1x"
        rotate={rotate ? 'rotate' : ''}
      />

      <ShowControlsText>
        {`${openControlsCard ? "Hide" : "Show"} Controls`}
      </ShowControlsText>
    </ShowControlsContainer>
  );
};

export const Device = ({ device, onToggleDeviceSwitch, pumpDuration, setPumpDuration }) => {
  const [state, setState] = useState(device.state === "on");
  const [temperature, setTemperature] = useState(24);
  const [openSeccessSnackBar, setOpenSuccessSnackbar] = useState(false);
  const [openFailureSnackBar, setOpenFailureSnackbar] = useState(false);
  const [openControlsCard, setOpenControlsCard] = useState(false);

  const { room_id, device_id, device_name, id } = device;

  const isAcDevice = device_name.toLowerCase() === "ac";
  const isHeaterDevice = device_name.toLowerCase() === "heater";
  const isLaundryDevice = device_name.toLowerCase() === "laundry";
  const isPumpDevice = device_name.toLowerCase() === "pump";

  const isWithControls = isAcDevice || isLaundryDevice || isPumpDevice;

  const onUpdateModeValueHandler = (controlId, updatedMode) => {
    // Update the AC mode by sending a request to your Node.js server.
    // Replace this with the actual API call to your server.
    console.log(`Updated mode for device ${controlId}: ${updatedMode}`);
  };


  const onDeviceChange = async (e) => {
    const newState = e.target.checked;
    setState(newState);

    // If the device is a pump, use SpeechSynthesisUtterance to play an audio message
    if (isPumpDevice) {
      let msg;

      if (newState) { // Pump is turned on
        msg = new SpeechSynthesisUtterance("Watering system activated");
      } else { // Pump is turned off
        msg = new SpeechSynthesisUtterance("Watering system deactivated");
      }

      window.speechSynthesis.speak(msg);
    }

    let response, roomDeviceResponse;
    if (onToggleDeviceSwitch) {
      response = await onToggleDeviceSwitch({
        state: newState,
        id: device.id,
        temperature,
      });
    }
    roomDeviceResponse = await axios.put(`${SERVER_URL}/room-devices`, { state: newState, id });
    if (response.statusCode === 200) {
      setOpenSuccessSnackbar(true);
    } else {
      setOpenFailureSnackbar(true);
    }
  };




  const onChangeTemperature = (value) => {
    setTemperature(value);
  };

  const handleCloseSnackBar = () => {
    setOpenSuccessSnackbar(false);
  };

  return (
    <DeviceCard
      height={openControlsCard ? "auto" : "8rem"}
      className={openControlsCard ? "expanded" : ""}
      isLaundryDevice={isLaundryDevice}
    >
      <TopRow>
        <H2>{device_name}</H2>
        <Switch onChange={(e) => onDeviceChange(e)} checked={state} />
      </TopRow>
      {openSeccessSnackBar && (
        <SnackBar
          message={`${device.device_name.toUpperCase()} is now ${state ? "ON" : "OFF"
            }`}
          isOpen={true}
          handleCloseSnackBar={handleCloseSnackBar}
          color="green"
        />
      )}
      {openFailureSnackBar && (
        <SnackBar
          message={`Unable to turn ${state ? "ON" : "OFF"
            } ${device.name.toUpperCase()}`}
          isOpen={true}
          handleCloseSnackBar={handleCloseSnackBar}
          color="red"
        />
      )}
      {isWithControls && (
        <ShowControls
          setOpenControlsCard={setOpenControlsCard}
          openControlsCard={openControlsCard}
          onClick={() => {
            setOpenControlsCard(!openControlsCard);
          }}
        />
      )}
      <ControlContainer isVisible={openControlsCard}>
        {openControlsCard && (isAcDevice ? (
          <AcControls
            temperature={temperature}
            onChangeValue={(value) => onChangeTemperature(value)}
            acState={state}
          />
        ) : isPumpDevice ? (
          <PumpControls
            pumpDuration={pumpDuration}
            setPumpDuration={setPumpDuration}
          />
        ) : (
          <LaundryControls />
        ))}
      </ControlContainer>
    </DeviceCard>
  );
};
