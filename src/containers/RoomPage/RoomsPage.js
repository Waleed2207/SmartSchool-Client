// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, NavLink } from 'react-router-dom';
// import Modal from 'react-modal';
// import classes from "./RoomsPage.module.scss";
// import HouseMap from '../../components/HouseMap/HouseMap';
// import houseMapClasses from '../../components/HouseMap/HouseMap.module.scss';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import styled from "styled-components";
// import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
// import AddActivityForm from '../../components/AddActivityForm/AddActivityForm';
// import RulesModal from "../../components/RulesModal/RulesModal";
// import {jwtDecode} from 'jwt-decode';  // Correct import
// import PropTypes from "prop-types";

// const NavLinkStyled = styled(NavLink)`
//   color: green;
//   text-decoration: none;
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
//   padding: 30px;
//   margin-left: 13%;
//   font-weight: bold;
//   font-size: 0.9rem;
//   @media (max-width: 768px) {
//     padding: 10px;
//     margin-left: 2%;
//     font-size: 0.8rem;
//   }
// `;

// Modal.setAppElement('#root');

// const RoomsPage = ({ token }) => {
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const { spaceId } = useParams();
//   const navigate = useNavigate();
//   const [openAddActivityModal, setOpenAddActivityModal] = useState(false);
//   const [tokenError, setTokenError] = useState(null);

//   const checkToken = (token) => {
//     try {
//       const decodedToken = jwtDecode(token);
//       console.log('Decoded Token:', decodedToken);
//       return decodedToken;
//     } catch (error) {
//       console.error('Invalid token:', error);
//       setTokenError('Invalid token');
//       return null;
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       const decoded = checkToken(token);
//       if (!decoded) {
//         setTokenError('Invalid token');
//         console.error('Invalid token');
//         // Uncomment the line below to redirect to login page
//         // navigate('/login');
//       }
//     } else {
//       setTokenError('Token not provided');
//       console.error('Token not provided');
//       // Uncomment the line below to redirect to login page
//       // navigate('/login');
//     }
//   }, [token, navigate]);

//   const openRoomsDashboard = () => {
//     navigate(`/spaces/${spaceId}/rooms-dashboard`);
//   };

//   const openHouseMap = () => {
//     setModalIsOpen(true);
//   };

//   const handleOpenAddActivityModal = (e) => {
//     e.stopPropagation();
//     setOpenAddActivityModal(true);
//   };

//   const handleCloseAddActivityModal = () => {
//     setOpenAddActivityModal(false);
//   };

//   const handleActivityAdded = () => {
//     // Define this function or provide functionality if needed
//     // Example: Refresh the activities list
//   };

//   return (
//     <>
//       <NavLinkStyled to={`/spaces`} className={classes.BackLink}>
//         <FontAwesomeIcon icon={faChevronLeft} />
//         <span>Back to Spaces</span>
//       </NavLinkStyled>
//       <div className={classes.RoomsPage}>
//         <h1 className={classes.RoomsPageHeader}>Welcome to the Rooms Dashboard</h1>
//         <button className={classes.RoomsPageButton} onClick={openRoomsDashboard}>Rooms Dashboard</button>
//         <button className={classes.RoomsPageButton} onClick={openHouseMap}>Home Map</button>
//         <button className={classes.RoomsPageButton} onClick={handleOpenAddActivityModal}>Add Activity</button>

//         <RulesModal show={openAddActivityModal} onCloseModal={handleCloseAddActivityModal} title="Add Activity">
//           {token ? (
//             <AddActivityForm token={token} onActivityAdded={handleActivityAdded} />
//           ) : (
//             <p>{tokenError || 'Loading...'}</p>
//           )}
//         </RulesModal>
//         <Modal
//           isOpen={modalIsOpen}
//           onRequestClose={() => setModalIsOpen(false)}
//           contentLabel="Home Map"
//           className={houseMapClasses.Modal}
//         >
//           <HouseMap onClose={() => setModalIsOpen(false)} spaceId={spaceId} />
//         </Modal>
//       </div>
//     </>
//   );
// };

// RoomsPage.propTypes = {
//   token: PropTypes.string.isRequired,  // Ensure token is passed as a prop
// };

// export default RoomsPage;





import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import Modal from 'react-modal';
import classes from "./RoomsPage.module.scss";
import HouseMap from '../../components/HouseMap/HouseMap';
import houseMapClasses from '../../components/HouseMap/HouseMap.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import AddActivityForm from '../../components/AddActivityForm/AddActivityForm';
import CalendarForm from '../../components/CalendarForm/CalendarForm';
//import CalendarDashboard from '../../containers/CalendarDashboard/CalendarDashboard';
import UpdateActivityForm from '../../components/UpdateActivityForm/UpdateActivityForm';

import RulesModal from "../../components/RulesModal/RulesModal";
import {jwtDecode} from 'jwt-decode';
import PropTypes from "prop-types";

const NavLinkStyled = styled(NavLink)`
  color: green;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 30px;
  margin-left: 13%;
  font-weight: bold;
  font-size: 0.9rem;
  @media (max-width: 768px) {
    padding: 10px;
    margin-left: 2%;
    font-size: 0.8rem;
  }
`;

Modal.setAppElement('#root');

const RoomsPage = ({ token }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { spaceId } = useParams(); // Get spaceId from params
  const navigate = useNavigate();
  const [openAddActivityModal, setOpenAddActivityModal] = useState(false);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [openUpdateActivityModal, setOpenUpdateActivityModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

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

  const openRoomsDashboard = () => {
    navigate(`/spaces/${spaceId}/rooms-dashboard`);
  };

  const openHouseMap = () => {
    setModalIsOpen(true);
  };

  const handleOpenAddActivityModal = (e) => {
    e.stopPropagation();
    setOpenAddActivityModal(true);
  };

  const handleCloseAddActivityModal = () => {
    setOpenAddActivityModal(false);
  };

  const handleOpenCalendarModal = (e) => {
    e.stopPropagation();
    setOpenCalendarModal(true);
  };

  const handleCloseCalendarModal = () => {
    setOpenCalendarModal(false);
  };

  const handleOpenUpdateActivityModal = (activityId) => {
    setSelectedActivityId(activityId);
    setOpenUpdateActivityModal(true);
  };

  const handleCloseUpdateActivityModal = () => {
    setOpenUpdateActivityModal(false);
  };

  const handleActivityAdded = () => {
    // Define this function or provide functionality if needed
    // Example: Refresh the activities list
  };

  const handleEventAdded = () => {
    // Define this function or provide functionality if needed
    // Example: Refresh the events list
  };
  
  
  const handleActivityUpdated = () => {
    // Define this function or provide functionality if needed
    // Example: Refresh the activities list
    setOpenUpdateActivityModal(false);
  };

  return (
    <>
      <NavLinkStyled to={`/spaces`} className={classes.BackLink}>
        <FontAwesomeIcon icon={faChevronLeft} />
        <span>Back to Spaces</span>
      </NavLinkStyled>
      <div className={classes.RoomsPage}>
        <h1 className={classes.RoomsPageHeader}>Welcome to the Rooms Dashboard</h1>
        <button className={classes.RoomsPageButton} onClick={openRoomsDashboard}>Rooms Dashboard</button>
        <button className={classes.RoomsPageButton} onClick={openHouseMap}>Home Map</button>
        <button className={classes.RoomsPageButton} onClick={handleOpenAddActivityModal}>Add Activity</button>
        <button className={classes.RoomsPageButton} onClick={handleOpenCalendarModal}>Add Calendar Event</button>
        <button className={classes.RoomsPageButton} onClick={() => handleOpenUpdateActivityModal('activityId')}>Update Activity</button>

        <RulesModal show={openAddActivityModal} onCloseModal={handleCloseAddActivityModal} title="Add Activity">
          {token ? (
            <AddActivityForm token={token} onActivityAdded={handleActivityAdded} />
          ) : (
            <p>{tokenError || 'Loading...'}</p>
          )}
        </RulesModal>
        
        <RulesModal show={openCalendarModal} onCloseModal={handleCloseCalendarModal} title="Add Calendar Event">
          {token ? (
            <CalendarForm token={token} onEventAdded={handleEventAdded} spaceId={spaceId} />
          ) : (
            <p>{tokenError || 'Loading...'}</p>
          )}
        </RulesModal>

        <RulesModal show={openUpdateActivityModal} onCloseModal={handleCloseUpdateActivityModal} title="Update Activity">
          {token && selectedActivityId ? (
            <UpdateActivityForm token={token} activityId={selectedActivityId} onActivityUpdated={handleActivityUpdated} />
          ) : (
            <p>{tokenError || 'Loading...'}</p>
          )}
        </RulesModal>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Home Map"
          className={houseMapClasses.Modal}
        >
          <HouseMap onClose={() => setModalIsOpen(false)} spaceId={spaceId} />
        </Modal>

        {/* <div className={classes.CalendarDashboardContainer}>
          <CalendarDashboard token={token} spaceId={spaceId} />
        </div> */}
      </div>
    </>
  );
};

RoomsPage.propTypes = {
  token: PropTypes.string.isRequired,
};

export default RoomsPage;




