import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ButtonStyledNew, ModalButtonsContainer } from "./RuleModal";
import axios from "axios";
import { SERVER_URL } from "../../consts";
import { addRoomToRule } from "./suggestions.service";

export const ChooseRoomModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  //   margin-top: 40px;
`;

const ModalTitle = styled.p`
  font-size: 22px;
`;

const RoomsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  & > *:not(:last-child) {
    margin-bottom: 10px; /* Adjust the value as per your requirement */
  }
`;

const RoomInput = ({
  room,
  roomsWithCurrentDevice,
  checkedRooms,
  handleCheckboxChange,
}) => {
  const isValidRoom = roomsWithCurrentDevice.includes(room.id);
  return (
    <label key={room.id} style={{ color: isValidRoom ? "black" : "gray" }}>
      <input
        type="checkbox"
        name={room.name.toString()}
        checked={checkedRooms[room.name] || false}
        onChange={handleCheckboxChange}
        disabled={!isValidRoom}
      />
      {room.name}
    </label>
  );
};

export default function ChooseRoomModal({ setIsModalOpen, selectedRule }) {
  const [showContent, setShowContent] = useState(false);
  const [checkedRooms, setCheckedRooms] = useState({});
  const [rooms, setRooms] = useState([]);
  const [roomsWithCurrentDevice, setRoomsWithCurrentDevice] = useState([]);

  const isAddEnabled =
  Object.values(checkedRooms).filter(room => room).length;



  useEffect(() => {
    setTimeout(() => setShowContent(true), 150);
  }, []);

  useEffect(() => {
    const getRooms = async () => {
      const response = await axios.get(`${SERVER_URL}/rooms`);
      setRooms(response.data);
    };

    const getRoomsThatContainsCurrentDevice = async () => {
      const action = selectedRule.split('TURN ')[1];
      const device = action.split(" ")[0];
      const response = await axios.get(`${SERVER_URL}/devices/rooms/${device}`);
      const connectedRooms = response.data;
      setRoomsWithCurrentDevice(connectedRooms.map((room) => room.room_id));
    };

    getRooms();
    getRoomsThatContainsCurrentDevice();
  }, []);


  const handleAdd = () => {
    if(!isAddEnabled) return;
    Object.entries(checkedRooms).map((room) => {
      if (room[1]) addRoomToRule(selectedRule, room[0]);
    });
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (event) => {
    setCheckedRooms({
      ...checkedRooms,
      [event.target.name]: event.target.checked,
    });
  };



  return (
    <ChooseRoomModalContainer>
      <ModalTitle>Choose room</ModalTitle>
      <RoomsListContainer>
        {rooms.map((room) => (
          <RoomInput
            room={room}
            roomsWithCurrentDevice={roomsWithCurrentDevice}
            checkedRooms={checkedRooms}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}
      </RoomsListContainer>

      <ModalButtonsContainer>
        <ButtonStyledNew onClick={handleAdd} disabled={!isAddEnabled}>Add</ButtonStyledNew>
        <ButtonStyledNew onClick={() => setIsModalOpen(false)}>
          Cancel
        </ButtonStyledNew>
      </ModalButtonsContainer>
    </ChooseRoomModalContainer>
  );
}
