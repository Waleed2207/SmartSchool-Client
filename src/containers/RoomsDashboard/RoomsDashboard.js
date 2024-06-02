import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Room from "../../components/Rooms/Room";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import classes from "./RoomsDashboard.module.scss";
import axios from "axios";
import { SERVER_URL } from "../../consts";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import iconMapping from './../../utils/fontawesome.icons';

const NavLinkStyled = styled(NavLink)`
  color: green;
  // padding: 10rem;
`;

const RoomsDashboard = () => {
    const [roomsTest, setRoomsTest] = useState([]);
    const { spaceId } = useParams();
    
    console.log(spaceId);
    useEffect(() => {
        const getRooms = async () => {
            try {
                // const roomNamespace = "SmartHome"; // Assuming dynamic assignment or configuration
                // const response = await axios.get(`${SERVER_URL}/api-room/rooms-name/${roomNamespace}`);
                const response = await axios.get(`${SERVER_URL}/api-room/rooms/space/${spaceId}`);

                console.log(response.data);
                // Check if the response data is an array; if not, wrap it in an array
                const data = Array.isArray(response.data) ? response.data : [response.data];
                setRoomsTest(data);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
                // Optionally set roomsTest to an empty array or handle the error differently
                setRoomsTest([]);
            }
        };
        getRooms();
    }, [spaceId]);

    const navigate = useNavigate();

    const onClickRoomHandler = (roomId) => {
          // navigate(`/room/${roomId}`);
      navigate(`/spaces/${spaceId}/rooms-dashboard/room/${roomId}`);

    };

  return (
      <div className={classes.Container}>
          <NavLinkStyled to={`/spaces/${spaceId}/rooms`} className={classes.BackLink}>
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>Back to Rooms Dashboard</span>
          </NavLinkStyled>
          <div className={roomsTest.length === 1 ? `${classes.RoomsContainer} ${classes.RoomsContainerStart}` : classes.RoomsContainer}>
              {roomsTest.map((roomData) => (
                  <div
                      data-test={`room-card-${roomData.id}`}
                      key={roomData.id}
                      className={roomsTest.length === 1 ? classes.ColumnSingle : classes.Column}
                      onClick={() => onClickRoomHandler(roomData.id, spaceId)}  // Added spaceId as a parameter
                  >
                      <Room
                          id={roomData.id}
                          name={roomData.name} // Assuming name is a property of the room object
                          icon={iconMapping[roomData.icon]} // Assuming icon is a property of the room object
                          devicesCount={roomData.devices ? roomData.devices.length : 0}
                      />
                  </div>
              ))}
          </div>
          <Outlet />
      </div>
  );
};

RoomsDashboard.propTypes = {
  fetchRooms: PropTypes.func,
  rooms: PropTypes.object,
};

export default RoomsDashboard;

// import React, { useEffect, useState } from "react";
// import Room from "../../components/Rooms/Room";
// import { Outlet, useNavigate, useParams } from "react-router-dom";
// import classes from "./RoomsDashboard.module.scss";
// import axios from "axios";
// import { SERVER_URL } from "../../consts";
// import styled from "styled-components";
// import { NavLink } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
// import iconMapping from './../../utils/fontawesome.icons';

// const NavLinkStyled = styled(NavLink)`
//   color: green;
// `;

// const RoomsDashboard = () => {
//   const [rooms, setRooms] = useState([]);
//   const { spaceId } = useParams();
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const getRooms = async () => {
//       try {
//         const response = await axios.get(`${SERVER_URL}/api-room/rooms/space/${spaceId}`);
//         const data = Array.isArray(response.data) ? response.data : [response.data];
//         setRooms(data);
//       } catch (error) {
//         console.error('Failed to fetch rooms:', error);
//         setRooms([]);
//       }
//     };
//     getRooms();
//   }, [spaceId]);

//   const onClickRoomHandler = (roomId) => {
//     navigate(`/spaces/${spaceId}/rooms-dashboard/room/${roomId}`);
//   };

//   return (
//     <div className={classes.Container}>
//       <NavLinkStyled to={`/spaces/${spaceId}/rooms`} className={classes.BackLink}>
//         <FontAwesomeIcon icon={faChevronLeft} />
//         <span>Back to Rooms Dashboard</span>
//       </NavLinkStyled>
//       <div className={rooms.length === 1 ? `${classes.RoomsContainer} ${classes.RoomsContainerStart}` : classes.RoomsContainer}>
//         {rooms.map((roomData) => (
//           <div
//             data-test={`room-card-${roomData.id}`}
//             key={roomData.id}
//             className={rooms.length === 1 ? classes.ColumnSingle : classes.Column}
//             onClick={() => onClickRoomHandler(roomData.id)}
//           >
//             <Room
//               id={roomData.id}
//               name={roomData.name}
//               icon={typeof roomData.iconMapping === 'string' ? roomData.iconMapping : "ClassRoom"}
//               devicesCount={roomData.devices ? roomData.devices.length : 0}
//               spaceId={spaceId}
//             />
//           </div>
//         ))}
//       </div>
//       <Outlet />
//     </div>
//   );
// };

// export default RoomsDashboard;
