
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

  @media (max-width: 768px) { /* Tablet view */
  width: 18rem;
  min-width: 18rem
  min-height: 7rem;
  height: 7rem;
}

  @media (max-width: 480px) { /* Mobile view */
  width: 16rem;
  min-width: 16rem;
    min-height: 7rem;
    height: 7rem;

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

  @media (max-width: 768px) { /* Tablet view */
   margin-bottom: 0rem;
}

  @media (max-width: 480px) { /* Mobile view */
    margin-bottom: 0rem;
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

export const Device = ({ device, onToggleDeviceSwitch, pumpDuration, setPumpDuration, spaceId }) => {
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
  const [raspberryPiIP, setRaspberryPiIP] = useState('');
  const isWithControls = isAcDevice || isLaundryDevice || isPumpDevice;
  const [motionDetected, setMotionDetected] = useState(false);
  const [roomIDState, setRoomIDState] = useState('');
  const [deviceIDState, setDeviceIDState] = useState('');
  const [spaceIDState, setSpaceIDState] = useState('');
  const onUpdateModeValueHandler = (controlId, updatedMode) => {
    // Update the AC mode by sending a request to your Node.js server.
    // Replace this with the actual API call to your server.
    console.log(`Updated mode for device ${controlId}: ${updatedMode}`);
  };

  const fetchRaspberryPiIP = async (spaceId) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-space/spaces/${spaceId}`);
      if (response.data && response.data.data) {
        // Check if response.data and response.data.data objects exist
        setRaspberryPiIP(response.data.data.rasp_ip); // Store the IP in state
        return response.data.data.rasp_ip; // Access the rasp_ip from within the nested data object
      }
      console.error("Raspberry Pi IP not found in response:", response.data);
      setRaspberryPiIP(''); // Clear state if no IP found
      return null; // Return null if rasp_ip is not found
    } catch (error) {
      console.error("Failed to fetch Raspberry Pi IP:", error);
      setRaspberryPiIP('');
      return null; // Return null and handle the error as appropriate
    }
  };
  
  useEffect(() => {
    if (spaceId) {
      fetchRaspberryPiIP(spaceId);
    }
  }, [spaceId]);

  useEffect(() => {
    const fetchAcState = async () => {
          if (!raspberryPiIP || !device_id) {
            console.error('Raspberry Pi IP address or Device ID is missing.');
            return;
        }
        console.log("Ras_IP: " + raspberryPiIP, "device_id: " + device_id);
        try { 
            const response = await axios.get(`${SERVER_URL}/api-sensors/sensibo?rasp_ip=${encodeURIComponent(raspberryPiIP)}&device_id=${encodeURIComponent(device_id)}`);
            if (response.data?.mode) {
                const { on, mode, targetTemperature, temperatureUnit } = response.data;
                setState(on);
                setMode(mode);
                setTemperature(targetTemperature);
            } else {
                throw new Error("Unexpected response structure or missing data");
            }
        } catch (error) {
            console.error('Error fetching AC state:', error);
            setState(false);
            setMode('cool');
            setTemperature(24);
            if (error.response && error.response.status === 500) {
                console.error("Server error:", error.response.data);
            }
        }
    };
    if (isAcDevice && raspberryPiIP && device_id){
        fetchAcState();
    }
}, [isAcDevice, raspberryPiIP, device_id]); // Ensure to listen to changes in raspberryPiIP as well

  

// -----------------------------motion-dected----------------------------------
    useEffect(() => {
      const fetchMotionState = async () => {
        try {
          const response = await axios.get(`${SERVER_URL}/api-sensors/motion-state`);
          // const { isMotionDetected, ROOM_ID, SPACE_ID, DEVICE_ID } = response.data;
          const isMotionDetected = response.data.motionDetected;
          const ROOM_ID = response.data.ROOM_ID;
          const DEVICE_ID = response.data.DEVICE_ID;
          const SPACE_ID = response.data.SPACE_ID;
          if (isMotionDetected !== motionDetected) {
            setMotionDetected(isMotionDetected);
          }
          if (ROOM_ID !== roomIDState) {
            setRoomIDState(ROOM_ID);
          }
          if (DEVICE_ID !== deviceIDState) {
            setDeviceIDState(DEVICE_ID);
          }
          if (SPACE_ID !== spaceIDState) {
            setSpaceIDState(SPACE_ID);
          }  
        } catch (error) {
          console.error('Error fetching motion state:', error);
          setOpenFailureSnackbar(true); // Generic failure notification
        }
      };
      const intervalId = setInterval(fetchMotionState, 2000);
      return () => clearInterval(intervalId);
    }, [motionDetected, roomIDState, deviceIDState, spaceIDState]);

    useEffect(() => {
      if (device.device_name.toLowerCase() === 'light' && device.device_id === deviceIDState) {
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
    }, [motionDetected, device.device_name, device.device_id , deviceIDState]);


// -------------------------------------DeviceChange---------------------------------------------
      
    const onDeviceChange = async (device, e, spaceId, device_id) => {
      const newState = e.target.checked;
      console.log(device, newState);
      setState(newState); 
      setcolor(newState ? "green" : "red");
      // const deviceId = device.id.includes("YNahUQcM") ? "YNahUQcM" : "4ahpAkJ9";
      // console.log(deviceId);
      try {
        const raspberryPiIP = await fetchRaspberryPiIP(spaceId);
        if (!raspberryPiIP) {
          console.error("No IP found for the given space ID:", spaceId);
          return; // Exit the function if no IP address is found
        }
        let requests = [];
        const ACPayload = { state: newState, id: device_id, rasp_ip: raspberryPiIP };
        const basePayload = { state: newState, deviceId: device_id, rasp_ip: raspberryPiIP };
        const LIGHTPayload = {  id: device_id, rasp_ip: raspberryPiIP , Control: 'manual' };
        if (device.device_name.toLowerCase() === 'ac') {
          console.log("is here");
          requests.push(axios.post(`${SERVER_URL}/api-sensors/sensibo`, ACPayload));

          if (newState && typeof temperature !== 'undefined') {
            requests.push(axios.post(`${SERVER_URL}/api-sensors/sensibo`, { ...ACPayload, temperature }));
          }
        } else if (device.device_name.toLowerCase() === 'light') {
          console.log('Light is turn on:', newState ? "ON" : "OFF");
          requests.push(axios.post(`${SERVER_URL}/api-sensors/action`, { ...LIGHTPayload, state: newState ? 'on' : 'off' }));
        }
        else if (device.device_name.toLowerCase() === 'tv') {
          console.log(device.device_name);
          console.log('TV is turned:', newState ? "ON" : "OFF");
          // Adjust the payload to match the expected API format
          // const payloadForPlug = {  deviceId: '5', state: newState,  rasp_ip: raspberryPiIP };
                  requests.push(axios.post(`${SERVER_URL}/api-mindolife/change-feature-state`, basePayload));
        }
        else if (device.device_name.toLowerCase() === 'bulb') {
          console.log(device.device_name);
          console.log('Plug is turned:', newState ? "ON" : "OFF");
          // Adjust the payload to match the expected API format
          // const payloadForPlug = {  deviceId: '4', state: newState };
                  requests.push(axios.post(`${SERVER_URL}/api-mindolife/change-feature-state`, basePayload));
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



  const onChangeTemperature = async (newTemperature, spaceId, device_id) => {
    setTemperature(newTemperature); // update the local state optimistically
  
    try {
      const raspberryPiIP = await fetchRaspberryPiIP(spaceId);
      if (!raspberryPiIP) {
        console.error("No IP found for the given space ID:", spaceId);
        return; // Exit the function if no IP address is found
      }
      // Perform the POST request to the server to update the temperature
      const response = await axios.post(`${SERVER_URL}/api-sensors/sensibo`, {
        state: state,
        temperature: newTemperature,
        id: device_id,
        rasp_ip: raspberryPiIP
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
          onChange={(e) => onDeviceChange(device, e, spaceId ,device_id)}
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
            onChangeValue={(value) => onChangeTemperature(value, spaceId, device_id)}
            acState={state}
            device_id={device_id}
            raspberryPiIP={raspberryPiIP}         
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
