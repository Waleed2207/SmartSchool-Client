
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { SnackBar } from "../Snackbar/SnackBar";
import Switch from "../UI/Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
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


const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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
  const [mode, setMode] = useState(""); 
  const { room_id, device_id, device_name, id } = device;
  const[color,setcolor] = useState("green");
  const isAcDevice = device_name.toLowerCase() === "ac";
  const isHeaterDevice = device_name.toLowerCase() === "heater";
  const isLaundryDevice = device_name.toLowerCase() === "laundry";
  const isPumpDevice = device_name.toLowerCase() === "pump";
// Assuming you're inside a React functional component
  const [temperatureUnit, setTemperatureUnit] = useState('C'); // Default to Celsius

  const isWithControls = isAcDevice || isLaundryDevice || isPumpDevice;
  const [motionDetected, setMotionDetected] = useState(false);

  const onUpdateModeValueHandler = (controlId, updatedMode) => {
    // Update the AC mode by sending a request to your Node.js server.
    // Replace this with the actual API call to your server.
    console.log(`Updated mode for device ${controlId}: ${updatedMode}`);
  };

  useEffect(() => {
    const fetchAcState = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api-sensors/sensibo`);
        console.log("Response from /sensibo:", response.data);
  
        if (response.data?.mode) {
          const { on, mode, targetTemperature, temperatureUnit } = response.data;
          setState(on);
          setMode(mode);
          setTemperature(targetTemperature); // Make sure this line correctly updates the temperature
          //setTemperatureUnit(temperatureUnit); // Assuming you've defined this state as well
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error('Error fetching AC state:', error);
      // For example, you might want to set default values:
      setState(false);
      setMode('cool'); // Set to your default mode
      setTemperature(24); // Set to your default temperature
      }
    };
  
    if (isAcDevice) {
      fetchAcState();
    }
  }, [isAcDevice]); // Make sure SERVER_URL and other dependencies are correctly listed if needed
  

// -----------------------------motion-dected----------------------------------
useEffect(() => {
  const fetchMotionState = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-sensors/motion-state`);
      const isMotionDetected = response.data.motionDetected;
      if (isMotionDetected !== motionDetected) {
        setMotionDetected(isMotionDetected);
      }
    } catch (error) {
      console.error('Error fetching motion state:', error);
      setOpenFailureSnackbar(true); // Generic failure notification
    }
  };
  const intervalId = setInterval(fetchMotionState, 2000);
  return () => clearInterval(intervalId);
}, [motionDetected]);

useEffect(() => {
  if (device.device_name.toLowerCase() === 'light') {
    const lightState = motionDetected ? 'on' : 'off';
    setState(motionDetected);
    setcolor(motionDetected ? "green" : "red");

    if (motionDetected) {
      setOpenSuccessSnackbar(true);
      setOpenFailureSnackbar(false);  // Ensure to hide failure snackbar when motion is detected
    } else {
      // Failure snackbar for no motion detected and light turned off
      setOpenSuccessSnackbar(false);
      setOpenFailureSnackbar(true);
    }
  }
}, [motionDetected, device.device_name]);


// -------------------------------------DeviceChange---------------------------------------------
      
    const onDeviceChange = async (device, e) => {
      const newState = e.target.checked;
      console.log(device, newState);
      setState(newState); 
      setcolor(newState ? "green" : "red");
      const deviceId = device.id.includes("YNahUQcM") ? "YNahUQcM" : "4ahpAkJ9";
      // console.log(deviceId);

      try {
        let requests = [];
        const basePayload = { state: newState, id: deviceId };
        if (device.device_name.toLowerCase() === 'ac') {
          console.log("is here");
          requests.push(axios.post(`${SERVER_URL}/api-sensors/sensibo`, basePayload));

          if (newState && typeof temperature !== 'undefined') {
            requests.push(axios.post(`${SERVER_URL}/api-sensors/sensibo`, { ...basePayload, temperature }));
          }
        } else if (device.device_name.toLowerCase() === 'light') {
          console.log('Light is turn on:', newState ? "ON" : "OFF");
          requests.push(axios.post(`${SERVER_URL}/api-sensors/motion-detected`, { state: newState ? 'on' : 'off' }));
        }
        else if (device.device_name.toLowerCase() === 'tv') {
          console.log(device.device_name);
          console.log('TV is turned:', newState ? "ON" : "OFF");
          // Adjust the payload to match the expected API format
          const payloadForPlug = {  deviceId: '5', state: newState };
                  requests.push(axios.post(`${SERVER_URL}/api-mindolife/change-feature-state`, payloadForPlug));
        }
        else if (device.device_name.toLowerCase() === 'bulb') {
          console.log(device.device_name);
          console.log('Plug is turned:', newState ? "ON" : "OFF");
          // Adjust the payload to match the expected API format
          const payloadForPlug = {  deviceId: '4', state: newState };
                  requests.push(axios.post(`${SERVER_URL}/api-mindolife/change-feature-state`, payloadForPlug));
        }
        
        const results = await Promise.allSettled(requests);
        let allSuccessful = true;
        results.forEach(result => {
          if (result.status === 'fulfilled' && result.value.status === 200) {
            console.log(result.value.data); // Log successful response
          } else {
            allSuccessful = false;
            if (result.reason && result.reason.response) {
              console.error('Request failed:', result.reason.response.data);
            } else {
              console.error('Request failed with no server response');
            }
          }
        });

        if (allSuccessful) {
          setOpenSuccessSnackbar(true);
        } else {
          setOpenFailureSnackbar(true);
        }
      } catch (error) {
        console.error('Error updating device state or temperature:', error);
        setOpenFailureSnackbar(true);
      }
    };



  const onChangeTemperature = async (newTemperature) => {
    setTemperature(newTemperature); // update the local state optimistically
  
    try {
      // Perform the POST request to the server to update the temperature
      const response = await axios.post(`${SERVER_URL}/api-sensors/sensibo`, {
        state: state,
        temperature: newTemperature,
        id: device.id,
      });
  
      // Check for a successful response
      if (response.status === 200) {
        console.log('Temperature updated successfully');
        // You might not need to set the temperature again if you're optimistic
      } else {
        console.error('Failed to update temperature:', response.status);
        setOpenFailureSnackbar(true);
        // Rollback if necessary
        setTemperature(temperature); // reset to the previous temperature
      }
    } catch (error) {
      console.error('Error updating temperature:', error);
      setOpenFailureSnackbar(true);
      // Rollback if necessary
      setTemperature(temperature); // reset to the previous temperature
    }
  };
  
  

  const handleCloseSnackBar = () => {
    setOpenSuccessSnackbar(false);
    setOpenFailureSnackbar(false);
  };
  
  return (
    <DeviceCard
      height={openControlsCard ? "auto" : "8rem"}
      className={openControlsCard ? "expanded" : ""}
      isLaundryDevice={isLaundryDevice}
    >
      <TopRow>
        <H2>{device_name}</H2>
        <Switch
          onChange={(e) => onDeviceChange(device, e)}
          checked={state}
        />
      </TopRow>
      {openSeccessSnackBar && (
        <SnackBar
          message={`${device.device_name.toUpperCase()} is now ${state ? "ON" : "OFF"
            }`}
          isOpen={true}
          handleCloseSnackBar={handleCloseSnackBar}
          color={color}
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
