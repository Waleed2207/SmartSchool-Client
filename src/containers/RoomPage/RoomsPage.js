import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import classes from "./RoomsPage.module.scss";
import HouseMap from '../../components/HouseMap/HouseMap';
import houseMapClasses from '../../components/HouseMap/HouseMap.module.scss';
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const NavLinkStyled = styled(NavLink)`
  color: green;
  text-decoration: none;  // Removes underline from all links
  display: flex;          // Use flexbox for layout
  align-items: center;    // Aligns items vertically in the center
  justify-content: flex-start; // Aligns items to the start (left)
  padding: 30px;          // Adds padding around the link
  margin-left: 13%;        // Use percentage for responsive alignment
  font-weight: bold;
  font-size: 0.9rem;      // Consider using 'em' for better accessibility
  // Responsive adjustments
  @media (max-width: 768px) {
    padding: 10px;        // Reduce padding on smaller screens
    margin-left: 2%;      // Reduce margin on smaller screens
    font-size: 0.8rem;    // Slightly smaller text on small devices
  }
`;

Modal.setAppElement('#root') // This line is important for accessibility purposes
const RoomsPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { spaceId } = useParams(); // Get spaceId from URL
    const navigate = useNavigate();
    
    const openRoomsDashboard = () => {
        navigate(`/spaces/${spaceId}/rooms-dashboard`); // Navigate with spaceId
    };
    
    const openHouseMap = () => {
        setModalIsOpen(true);
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

export default RoomsPage;
