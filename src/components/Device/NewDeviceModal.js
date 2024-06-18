// import axios from "axios";
// import React, { useState } from "react";
// import styled from "styled-components";
// import { SERVER_URL } from "../../consts";

// const NewDeviceModalContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   text-align: center;
// `;

// const NameInput = styled.input`
//   width: 80%;
//   height: 30px;
//   text-align: center;
//   border-radius: 30px;
//   border-style: solid;
//   padding: 5px;
// `;

// const ModalContent = styled.div`
//   display: flex;
//   width: 100%;
// `;

// const ModalButtonsContainer = styled.div`
//   margin-top: 60px;
//   display: flex;
//   gap: 10px;
// `;

// const ButtonStyledNew = styled.div`
//   background-color: #f6f7ff;
//   display: flex;
//   color: "#3B5998";
//   font-size: 14px;
//   align-items: center;
//   text-align: center;
//   justify-content: center;
//   border: 1px solid #d8deea !important;
//   min-width: 65px;
//   min-height: 30px;
//   padding: 0 0.7rem;
//   border-radius: 4px;
//   transition: 0.3s;
//   :hover {
//     cursor: pointer;
//     background-color: #d8deea;
//     border-color: black;
//     opacity: 1;
//   }
//   color: #3b5998;
// `;

// const NameSection = ({ spaceId, setName }) => {
//   return (
//     <>
//       <div>
//         Name: <NameInput type="text" onChange={(e) => setName(e.currentTarget.value)} />
//       </div>
//       <div>
//         spaceId: <NameInput type="text" value={spaceId} readOnly />
//       </div>
//     </>
//   );
// };

// export const NewDeviceModal = ({ setIsModalOpen, spaceId, roomId, fetchRoomDevices }) => {
//   const [deviceName, setDeviceName] = useState('');
//   const [deviceId, setDeviceId] = useState('');

//   const handleAddDevice = async () => {
//     const data = {
//       space_id: spaceId,
//       name: deviceName,
//       device_id: deviceId,
//       roomId,
//     };
//     console.log('Sending data:', data);
//     try {
//       const response = await axios.post(`${SERVER_URL}/api-device/devices`, data);
//       if (response.status === 200) {
//         fetchRoomDevices(); // Refresh the list of devices in the room
//         setIsModalOpen(false); // Close the modal
//       }
//     } catch (error) {
//       console.error('Error adding device:', error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <NewDeviceModalContainer>
//       <NameSection spaceId={spaceId} setName={setDeviceName} />
//       <input
//         type="text"
//         value={deviceId}
//         onChange={(e) => setDeviceId(e.target.value)}
//         placeholder="Device ID"
//       />
//       <ModalButtonsContainer>
//         <ButtonStyledNew onClick={handleAddDevice}>Add</ButtonStyledNew>
//         <ButtonStyledNew onClick={() => setIsModalOpen(false)}>Close</ButtonStyledNew>
//       </ModalButtonsContainer>
//     </NewDeviceModalContainer>
//   );
// };





import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SERVER_URL } from "../../consts";

const NewDeviceModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const NameInput = styled.input`
  width: 80%;
  height: 30px;
  text-align: center;
  border-radius: 30px;
  border-style: solid;
  padding: 5px;
  margin-bottom: 10px;
`;

const ModalButtonsContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const ButtonStyledNew = styled.div`
  background-color: #f6f7ff;
  display: flex;
  color: "#3B5998";
  font-size: 14px;
  align-items: center;
  text-align: center;
  justify-content: center;
  border: 1px solid #d8deea !important;
  min-width: 65px;
  min-height: 30px;
  padding: 0 0.7rem;
  border-radius: 4px;
  transition: 0.3s;
  :hover {
    cursor: pointer;
    background-color: #d8deea;
    border-color: black;
    opacity: 1;
  }
  color: #3b5998;
`;

const NameSection = ({ setName, deviceName }) => {
  return (
    <div>
      Name: <NameInput type="text" value={deviceName} onChange={(e) => setName(e.currentTarget.value)} />
    </div>
  );
};

export const NewDeviceModal = ({ setIsModalOpen, spaceId, roomId, fetchRoomDevices }) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    if (!deviceId.startsWith(spaceId)) {
      setDeviceId(`${spaceId}-${deviceName}`);
    }
  }, [deviceName, spaceId]);

  const handleAddDevice = async () => {
    const data = {
      space_id: spaceId,
      name: deviceName,
      device_id: deviceId,
      roomId,
    };
    console.log('Sending data:', data);
    try {
      const response = await axios.post(`${SERVER_URL}/api-device/devices`, data);
      if (response.status === 200) {
        fetchRoomDevices(); // Refresh the list of devices in the room
        setIsModalOpen(false); // Close the modal
      }
    } catch (error) {
      console.error('Error adding device:', error.response?.data?.message || error.message);
    }
  };

  return (
    <NewDeviceModalContainer>
      <NameSection setName={setDeviceName} deviceName={deviceName} />
      <div>
        spaceId: <NameInput type="text" value={spaceId} readOnly />
      </div>
      <div>
        Device ID: <NameInput type="text" value={deviceId} onChange={(e) => setDeviceId(e.currentTarget.value)} />
      </div>
      <ModalButtonsContainer>
        <ButtonStyledNew onClick={handleAddDevice}>Add</ButtonStyledNew>
        <ButtonStyledNew onClick={() => setIsModalOpen(false)}>Close</ButtonStyledNew>
      </ModalButtonsContainer>
    </NewDeviceModalContainer>
  );
};
