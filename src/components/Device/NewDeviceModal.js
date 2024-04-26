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
  text-align: center;
  border-radius: 30px;
  border-style: solid;
  padding: 5px;
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
const NameSection = ({ spaceId, setName }) => {
  return (
    <>
      <div>
        Name: <NameInput type="text" onChange={(e) => setName(e.currentTarget.value)} />
      </div>
      <div>
        spaceId: <NameInput type="text" value={spaceId} readOnly />
      </div>
    </>
  );
};
export const NewDeviceModal = ({ setIsModalOpen, spaceId, roomId, fetchRoomDevices }) => {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    await axios.post(`${SERVER_URL}/api-device/devices`, {
      device: {
        name,
      },
      space_id: spaceId,
      room_id: roomId,
    });
    setIsModalOpen(false);
    fetchRoomDevices();
  };

  return (
    <NewDeviceModalContainer>
      {/* <ModalContent> */}

      <NameSection spaceId={spaceId} setName={setName} />
      <ModalButtonsContainer>
        <ButtonStyledNew onClick={handleAdd}>Add</ButtonStyledNew>
        <ButtonStyledNew onClick={() => setIsModalOpen(false)}>
          Close
        </ButtonStyledNew>
      </ModalButtonsContainer>
      {/* </ModalContent> */}
    </NewDeviceModalContainer>
  );
};
