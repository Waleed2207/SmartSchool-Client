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
import RulesModal from "../../components/RulesModal/RulesModal";
import {jwtDecode} from 'jwt-decode'; // Correct import
import PropTypes from "prop-types";

const NavLinkStyled = styled(NavLink)`
  color: green;
  text-decoration: none;  // Removes underline from all links
  display: flex;          // Use flexbox for layout
  align-items: center;    // Aligns items vertically in the center
  justify-content: flex-start; // Aligns items to the start (left)
  padding: 30px;          // Adds padding around the link
  margin-left: 13%;       // Use percentage for responsive alignment
  font-weight: bold;
  font-size: 0.9rem;      // Consider using 'em' for better accessibility
  // Responsive adjustments
  @media (max-width: 768px) {
    padding: 10px;        // Reduce padding on smaller screens
    margin-left: 2%;      // Reduce margin on smaller screens
    font-size: 0.8rem;    // Slightly smaller text on small devices
  }
`;

Modal.setAppElement('#root'); // This line is important for accessibility purposes

const RoomsPage = ({ token }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { spaceId } = useParams(); // Get spaceId from URL
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

    const openRoomsDashboard = () => {
        navigate(`/spaces/${spaceId}/rooms-dashboard`); // Navigate with spaceId
    };

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

    // const openHouseMap = () => {
    //     setModalIsOpen(true);
    // };

    return (
        <>
            <NavLinkStyled to={`/spaces`} className={classes.BackLink}>
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>Back to Spaces</span>
            </NavLinkStyled>
            <div className={classes.RoomsPage}>
                <h1 className={classes.RoomsPageHeader}>Welcome to the Rooms Dashboard</h1>
                <button className={classes.RoomsPageButton} onClick={openRoomsDashboard}>Rooms Dashboard</button>
                {/* <button className={classes.RoomsPageButton} onClick={openHouseMap}>Home Map</button> */}
                <button className={classes.RoomsPageButton} onClick={handleOpenAddActivityModal}>Activity</button>
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
                    contentLabel="Home Map"
                    className={houseMapClasses.Modal}
                >
                    <HouseMap onClose={() => setModalIsOpen(false)} spaceId={spaceId} />
                </Modal>
            </div>
        </>
    );
};

RoomsPage.propTypes = {
    token: PropTypes.string.isRequired, // Ensure token is passed as a prop
};

RoomsPage.defaultProps = {
    token: "", // Default to an empty string
};

export default RoomsPage;
