// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import {
//   fetchRoomDevices,
// } from "./../../../store/devices/devices.actions";
// import { NavLink } from "react-router-dom";
// import { useParams } from "react-router";

// import classes from "./RoomDevices.module.scss";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import { toggleAcState } from "../../../services/ac.service";
// import { Device } from "../../../components/Device/Device";
// import { SERVER_URL } from "../../../consts";
// import _ from "lodash";
// import styled, { keyframes } from "styled-components";
// import { NewDevice } from "../../../components/Device/NewDevice";
// import Modal from "react-modal";
// import { NewDeviceModal } from "../../../components/Device/NewDeviceModal";
// import pumpService from '../../../services/pump.service';
// import RoomMap from '../../..//components/RoomMap/RoomMap';
// import iconMapping from './../../../utils/fontawesome.icons';
// import houseMapClasses from '../../../components/RoomMap/RoomMap.module.scss';

// Modal.setAppElement('#root') 

// const fadeIn = keyframes`
//   0% {
//     opacity: 0;
//     width: 0;
//     height: 0;
//   }
//   50% {
//     opacity: 1;
//     width: 45%;
//     height: 40%;
//   }
//   100% {
//     opacity: 1;
//     width: 40%; /* Final width value */
//     height: 35%; /* Final height value */
//   }
// `;

// export const ModalStyled = styled(Modal)`
//   position: fixed;
//   top: 45%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background: #fff;
//   border-radius: 4px;
//   width: 40%;
//   height: 35%;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
//   margin: 1rem;
//   padding: 2rem
//   overflow: auto;
//   display: flex;
//   justify-content: center;
//   border: none;
//   outline: none;

//   //animation
//   opacity: 0;
//   width: 0;
//   height: 0;
//   animation: ${fadeIn} 0.3s ease-in-out forwards;
// `;

// const DevicesSection = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   // padding: 10px;
//   gap: 2rem;
//   @media (max-width: 912px) {
//     justify-content: center

//   }
//   // Media query for mobile devices
//   @media (max-width: 480px) {
//     justify-content: center

//   }

// `;

// const RoomContainer = styled.div`
//   padding: 30px;
//   margin-right: 5rem;
//   margin-left: 5rem;
//   @media (max-width: 768px) {
//     justify-content: center
//     padding: 15px;
//     margin-right: 2rem;
//     margin-left: 2rem;
//   }
//   // Media query for mobile devices
//   @media (max-width: 480px) {
//     padding: 10px;
//     margin-right: 1rem;
//     justify-content: center
//     margin-left: 1rem;
//   }
// `;

// const NavLinkStyled = styled(NavLink)`
//   color: green;
//   // padding: 10rem;
// `;

// const DEVICES_IDS_MAP = {
//   AC: "4ahpAkJ9",
//   LAUNDRY: "0e4be594-13bb-fe76-f092-c8dbdede80b2",
//   HEATER: "061751378caab5219d31",
//   PUMP: "061751378caab5219d33"
// };


// const H1 = styled.p`
//   font-size: 2rem;

//   @media (max-width: 768px) { /* Tablet view */
//     font-size: 1.5rem;
//   }

//   @media (max-width: 480px) { /* Mobile view */
//     font-size: 1.5rem;
//   }
// `;

// const togglePump = async (state, duration) => {
//   try {
//     const response = await pumpService.controlPump(state, duration);
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// };

// const laundryToggle = async ({ state, id }) => {
//   try {
//     const response = await axios.post(`${SERVER_URL}/smartthings/toggle`, {
      
//       state,
//       deviceId: id,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const toggleHeater = async (value) => {
//   try {
//     const response = await axios.post(`${SERVER_URL}/heater`, { value });
//     console.log('toogllle hteaer!!!!')
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const IDS_TOGGLES_MAP = {
//   [DEVICES_IDS_MAP.AC]: toggleAcState,
//   [DEVICES_IDS_MAP.LAUNDRY]: laundryToggle,
//   [DEVICES_IDS_MAP.HEATER]: toggleHeater,
//   [DEVICES_IDS_MAP.PUMP]: togglePump,
// };



// const RoomDevices = () => {
//   const [devices, setDevices] = React.useState([]);
//   const [laundryDetails, setLaundryDetails] = React.useState({});
//   const [room, setRoom] = useState({});
//   const [roomDevices, setRoomDevices] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [pumpState, setPumpState] = useState('OFF');
//   const [pumpDuration, setPumpDuration] = useState(0.05);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
    
    
//   const openHouseMap = () => {
//       setModalIsOpen(true);
//   };
  
//   const { id,spaceId } = useParams();


//   const fetchLaundryDetails = async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}/laundry/details/`);
//       setLaundryDetails(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     const laundryDevice = devices.find((device) => device.name === "laundry");
//     if (laundryDevice) {
//       fetchLaundryDetails();
//     }
//   }, [devices]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const devicesFromDB = await axios.get(`${SERVER_URL}/api-device/devices`);
//         setDevices(devicesFromDB.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);


//   const fetchRoomData = async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}/api-room/rooms/${id}`);
//       setRoom(response.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const fetchRoomDevices = async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}/api-device/room-devices/${id}`);
//       setRoomDevices(_.get(response, "data.data", []));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handlePumpToggle = async ({ state, duration }) => {
//     try {
//       const newState = pumpState === 'ON' ? 'OFF' : 'ON';
//       await pumpService.controlPump(newState, duration * 60); // Convert minutes to seconds
//       setPumpState(newState);
//     } catch (error) {
//       console.error(error);
//     }
//   };


//   useEffect(() => {
//     fetchRoomData();
//     fetchRoomDevices();
//   }, []);

//   useEffect(() => {
//   }, [roomDevices]);

//   if (!devices) return null;

//   return (
//     <RoomContainer>
//       <NavLinkStyled to={`/spaces/${spaceId}/rooms-dashboard`} className={classes.BackLink}>
//         <FontAwesomeIcon icon={faChevronLeft} />
//         <span>Back to Rooms</span>
//       </NavLinkStyled>
//       <div className={classes.RoomsPage}>
//             <button className={classes.RoomsPageButton} onClick={openHouseMap}>Rooms Map</button>
//           </div>
//           <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={() => setModalIsOpen(false)}
//                 contentLabel="Rooms Map"
//                 className={houseMapClasses.Modal}
//             >
//                 <RoomMap onClose={() => setModalIsOpen(false)} spaceId={spaceId} id={id} />
//           </Modal>
//       <H1>{_.get(room, "name")}</H1>
//       <DevicesSection>
//         {roomDevices.map((device) => {
//           const rooms = _.get(device, "rooms", []);
//           const { device_id } = device;
//           return (
//             <div key={device_id} className={classes.Column}>
//               <Device
//                 spaceId={spaceId}
//                 device={device}
//                 onToggleDeviceSwitch={
//                   device.device_name === 'pump' ?
//                     () => handlePumpToggle({ state: pumpState, duration: pumpDuration })
//                     : IDS_TOGGLES_MAP[device_id]
//                 }
//                 laundryDetails={
//                   device.device_name === "laundry" ? laundryDetails : null
//                 }
//               />
//             </div>
//           );
//         })}
//         <NewDevice setIsModalOpen={setIsModalOpen} />
//       </DevicesSection>

//       {isModalOpen &&
//         <ModalStyled isOpen={isModalOpen}>
//           <NewDeviceModal setIsModalOpen={setIsModalOpen} spaceId={spaceId} roomId={id} fetchRoomDevices={fetchRoomDevices} />
//         </ModalStyled>
//       }
//     </RoomContainer>
//   );

// };

// RoomDevices.propTypes = {
//   fetchRoomDevices: PropTypes.func,
// };

// const mapStateToProps = (state) => ({
//   devices: state.devices.devices,
// });

// const mapDispatchToProps = {
//   fetchRoomDevices,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(RoomDevices);




import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import Modal from "react-modal";
import { NewDeviceModal } from "../../../components/Device/NewDeviceModal";
import { Device } from "../../../components/Device/Device";
import { SERVER_URL } from "../../../consts";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import classes from "./RoomDevices.module.scss";
import pumpService from '../../../services/pump.service';
import RoomMap from '../../../components/RoomMap/RoomMap';
import houseMapClasses from '../../../components/RoomMap/RoomMap.module.scss';
import iconMapping from '../../../utils/fontawesome.icons';
import { NewDevice } from "../../../components/Device/NewDevice"; // Import NewDevice component
import { toggleAcState } from "../../../services/ac.service"; // Import toggleAcState function

Modal.setAppElement('#root');

const fadeIn = keyframes`
  0% {
    opacity: 0;
    width: 0;
    height: 0;
  }
  50% {
    opacity: 1;
    width: 45%;
    height: 40%;
  }
  100% {
    opacity: 1;
    width: 40%; /* Final width value */
    height: 35%; /* Final height value */
  }
`;

const ModalStyled = styled(Modal)`
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 4px;
  width: 40%;
  height: 35%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin: 1rem;
  padding: 2rem;
  overflow: auto;
  display: flex;
  justify-content: center;
  border: none;
  outline: none;

  //animation
  opacity: 0;
  width: 0;
  height: 0;
  animation: ${fadeIn} 0.3s ease-in-out forwards;
`;

const DevicesSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  @media (max-width: 912px) {
    justify-content: center;
  }
  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const RoomContainer = styled.div`
  padding: 30px;
  margin-right: 5rem;
  margin-left: 5rem;
  @media (max-width: 768px) {
    justify-content: center;
    padding: 15px;
    margin-right: 2rem;
    margin-left: 2rem;
  }
  @media (max-width: 480px) {
    padding: 10px;
    margin-right: 1rem;
    justify-content: center;
    margin-left: 1rem;
  }
`;

const NavLinkStyled = styled(NavLink)`
  color: green;
`;

const H1 = styled.p`
  font-size: 2rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const DEVICES_IDS_MAP = {
  AC: "4ahpAkJ9",
  LAUNDRY: "0e4be594-13bb-fe76-f092-c8dbdede80b2",
  HEATER: "061751378caab5219d31",
  PUMP: "061751378caab5219d33"
};

const togglePump = async (state, duration) => {
  try {
    const response = await pumpService.controlPump(state, duration);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const laundryToggle = async ({ state, id }) => {
  try {
    const response = await axios.post(`${SERVER_URL}/smartthings/toggle`, {
      state,
      deviceId: id,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const toggleHeater = async (value) => {
  try {
    const response = await axios.post(`${SERVER_URL}/heater`, { value });
    console.log('toggle heater!!!!')
    return response;
  } catch (error) {
    console.error(error);
  }
};

const IDS_TOGGLES_MAP = {
  [DEVICES_IDS_MAP.AC]: toggleAcState,
  [DEVICES_IDS_MAP.LAUNDRY]: laundryToggle,
  [DEVICES_IDS_MAP.HEATER]: toggleHeater,
  [DEVICES_IDS_MAP.PUMP]: togglePump,
};

const RoomDevices = () => {
  const [devices, setDevices] = useState([]);
  const [laundryDetails, setLaundryDetails] = useState({});
  const [room, setRoom] = useState({});
  const [roomDevices, setRoomDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pumpState, setPumpState] = useState('OFF');
  const [pumpDuration, setPumpDuration] = useState(0.05);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { id, spaceId } = useParams();

  const openHouseMap = () => {
    setModalIsOpen(true);
  };

  const fetchLaundryDetails = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/laundry/details/`);
      setLaundryDetails(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const laundryDevice = devices.find((device) => device.name === "laundry");
    if (laundryDevice) {
      fetchLaundryDetails();
    }
  }, [devices]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devicesFromDB = await axios.get(`${SERVER_URL}/api-device/devices`);
        setDevices(devicesFromDB.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-room/rooms/${id}`);
      setRoom(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRoomDevices = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-device/room-devices/${id}`);
      setRoomDevices(_.get(response, "data.data", []));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePumpToggle = async ({ state, duration }) => {
    try {
      const newState = pumpState === 'ON' ? 'OFF' : 'ON';
      await pumpService.controlPump(newState, duration * 60); // Convert minutes to seconds
      setPumpState(newState);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoomData();
    fetchRoomDevices();
  }, []);

  useEffect(() => {}, [roomDevices]);

  if (!devices) return null;

  return (
    <RoomContainer>
      <NavLinkStyled to={`/spaces/${spaceId}/rooms-dashboard`} className={classes.BackLink}>
        <FontAwesomeIcon icon={faChevronLeft} />
        <span>Back to Rooms</span>
      </NavLinkStyled>
      <div className={classes.RoomsPage}>
        <button className={classes.RoomsPageButton} onClick={openHouseMap}>Rooms Map</button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Rooms Map"
        className={houseMapClasses.Modal}
      >
        <RoomMap onClose={() => setModalIsOpen(false)} spaceId={spaceId} id={id} />
      </Modal>
      <H1>{_.get(room, "name")}</H1>
      <DevicesSection>
        {roomDevices.map((device) => {
          const { device_id } = device;
          return (
            <div key={device_id} className={classes.Column}>
              <Device
                spaceId={spaceId}
                device={device}
                onToggleDeviceSwitch={
                  device.device_name === 'pump'
                    ? () => handlePumpToggle({ state: pumpState, duration: pumpDuration })
                    : IDS_TOGGLES_MAP[device_id]
                }
                laundryDetails={
                  device.device_name === "laundry" ? laundryDetails : null
                }
              />
            </div>
          );
        })}
        <NewDevice setIsModalOpen={setIsModalOpen} />
      </DevicesSection>
      {isModalOpen &&
        <ModalStyled isOpen={isModalOpen}>
          <NewDeviceModal setIsModalOpen={setIsModalOpen} spaceId={spaceId} roomId={id} fetchRoomDevices={fetchRoomDevices} />
        </ModalStyled>
      }
    </RoomContainer>
  );
};

export default RoomDevices;
