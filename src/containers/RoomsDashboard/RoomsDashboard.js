import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Room from "../../components/Rooms/Room";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import classes from "./RoomsDashboard.module.scss";
import axios from "axios";
import { SERVER_URL } from "../../consts";

const RoomsDashboard = () => {
  const [roomsTest, setRoomsTest] = useState([]);
  useEffect(() => {
    const getRooms = async () => {
      const response = await axios.get(`${SERVER_URL}/rooms`);
      console.log(response.data)
      setRoomsTest(response.data);
    };
    getRooms();
  }, []);

  const navigate = useNavigate();

  const onClickRoomHandler = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className={classes.Row}>
      {roomsTest.map((roomData) => {
        const { id, name, icon, devices } = roomData;
        return (
          <div
            data-test={`room-card-${id}`}
            key={id}
            className={classes.Column}
            onClick={() => onClickRoomHandler(id)}
          >
            <Room
              id={id}
              name={name}
              icon={icon}
              devicesCount={devices.length}
            />
          </div>
        );
      })}
      <Outlet />
    </div>
  );
};

RoomsDashboard.propTypes = {
  fetchRooms: PropTypes.func,
  rooms: PropTypes.object,
};

export default RoomsDashboard;
