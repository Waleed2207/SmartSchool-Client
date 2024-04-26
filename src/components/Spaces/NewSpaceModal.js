import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { SERVER_URL } from "../../consts";

export const NewDeviceModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  //   margin-top: 40px;
`;

export const NameInput = styled.input`
  //   display: ${(props) => (props.editing ? "block" : "none")};
  width: 80%;
  height: 30px;
  border-radius: 30px;
  border-style: solid;
  padding-left: 30px;
`;

const ModalContent = styled.div`
  display: flex;
  width: 100%;
  // flex-direction: ;
`;

export const ModalButtonsContainer = styled.div`
  margin-top: 60px;
  display: flex;
  gap: 10px;
`;

export const ButtonStyledNew = styled.div`
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

const NameSection = ({ label, value, onChange }) => (
    <>
      {label}: <NameInput value={value} onChange={(e) => onChange(e.target.value)} />
    </>
  );

export const NewSpaceModal = ({ setIsModalOpen, refreshSpaces }) => {
    const [type, setType] = useState("");
    const [icon, setIcon] = useState("");
    const [raspIp, setRaspIp] = useState("");
  
    const handleAdd = async () => {
        const spaceDetails = {
            spaceDetails: {  
              type,
              icon,
              rasp_ip: raspIp
            }
          };     
        try {
        const response = await axios.post(`${SERVER_URL}/api-space/spaces`, spaceDetails);
        console.log('Space added:', response.data);
        setIsModalOpen(false);
        if (refreshSpaces) {
            refreshSpaces();  // Refresh the list of spaces after adding a new one
          }
      } catch (error) {
        console.error('Error adding space:', error.response ? error.response.data : error);
    }
    };
  
    return (
      <NewDeviceModalContainer>
        <NameSection label="Type" value={type} onChange={setType} />
        <NameSection label="Icon" value={icon} onChange={setIcon} />
        <NameSection label="Raspberry Pi IP" value={raspIp} onChange={setRaspIp} />
        
        <ModalButtonsContainer>
          <ButtonStyledNew onClick={handleAdd}>Add</ButtonStyledNew>
          <ButtonStyledNew onClick={() => setIsModalOpen(false)}>Close</ButtonStyledNew>
        </ModalButtonsContainer>
      </NewDeviceModalContainer>
    );
  };
