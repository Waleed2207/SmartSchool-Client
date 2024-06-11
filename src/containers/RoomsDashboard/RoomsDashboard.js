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
import Modal from 'react-modal';
import HouseMap from '../../components/HouseMap/HouseMap';
import AddActivityForm from '../../components/AddActivityForm/AddActivityForm';
import RulesModal from "../../components/RulesModal/RulesModal";
import houseMapClasses from '../../components/HouseMap/HouseMap.module.scss';
import {jwtDecode} from 'jwt-decode'; // Correct import
import { ReactTyped as Typed } from 'react-typed';
import {LabelHeader } from '../RoomsDashboard/style'

const NavLinkStyled = styled(NavLink)`
  color: green;
  // padding: 10rem;
`;
Modal.setAppElement('#root') 
const RoomsDashboard = ({ token }) => {
    const [roomsTest, setRoomsTest] = useState([]);
    const { spaceId } = useParams();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [openAddActivityModal, setOpenAddActivityModal] = useState(false);
    const [tokenError, setTokenError] = useState(null);
    

    const navigate = useNavigate();

    const checkToken = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken);
            return decodedToken;
        } catch (error) {
            console.error('Invalid token:', error);
            setTokenError('Invalid token');
            return null;
        }
    };
    useEffect(() => {
        if (token) {
            const decoded = checkToken(token);
            if (!decoded) {
                setTokenError('Invalid token');
                console.error('Invalid token');
                // Uncomment the line below to redirect to login page
                // navigate('/login');
            }
        } else {
            setTokenError('Token not provided');
            console.error('Token not provided');
            // Uncomment the line below to redirect to login page
            // navigate('/login');
        }
    }, [token, navigate]);

    const handleOpenAddActivityModal = (e) => {
        e.stopPropagation();
        setOpenAddActivityModal(true);
    };

    const handleCloseAddActivityModal = () => {
        setOpenAddActivityModal(false);
    };

    const handleActivityAdded = () => {
        // Define this function or provide functionality if needed
        // Example: Refresh the activities list
    };
    const openHouseMap = () => {
        setModalIsOpen(true);
    };
    
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


    const onClickRoomHandler = (roomId) => {
          // navigate(`/room/${roomId}`);
      navigate(`/spaces/${spaceId}/rooms-dashboard/room/${roomId}`);

    };

  return (
      <div className={classes.Container}>
          <NavLinkStyled to={`/spaces`} className={classes.BackLink}>
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>Back to Space</span>
          </NavLinkStyled>
          <div className={classes.RoomsHeader}>
            <div className="hero-container" data-aos="fade-in" >
                <LabelHeader>
                    <Typed
                        className={classes.LabelHeader}
                        strings={['Welcome to the Rooms Dashboard...']}
                        typeSpeed={40}
                        backSpeed={50}
                        loop
                    />
                </LabelHeader>
                </div> 
          </div>
          <div className={classes.RoomsPage}>
            <button className={classes.RoomsPageButton} onClick={openHouseMap}>Rooms Map</button>
            <button className={classes.RoomsPageButton} onClick={handleOpenAddActivityModal}>Activity</button>
          </div>
            <RulesModal show={openAddActivityModal} onCloseModal={handleCloseAddActivityModal} title="Activity">
                {token ? (
                    <AddActivityForm token={token} onActivityAdded={handleActivityAdded} />
                ) : (
                    <p>{tokenError || 'Loading...'}</p>
                )}
            </RulesModal>
          <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Rooms Map"
                className={houseMapClasses.Modal}
            >
                <HouseMap onClose={() => setModalIsOpen(false)} spaceId={spaceId} />
            </Modal>
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
  token: PropTypes.string.isRequired, 
};
RoomsDashboard.defaultProps = {
    token: "", // Default to an empty string
};
export default RoomsDashboard;
