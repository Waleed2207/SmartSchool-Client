import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import classes from "./RoomsPage.module.scss";
import HouseMap from '../../components/HouseMap/HouseMap';
import houseMapClasses from '../../components/HouseMap/HouseMap.module.scss';

Modal.setAppElement('#root') // This line is important for accessibility purposes

const RoomsPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const openRoomsDashboard = () => {
        navigate('/rooms-dashboard');
    };

    const openHouseMap = () => {
        setModalIsOpen(true);
    };

    return (
        <div className={classes.RoomsPage}>
            <h1 className={classes.RoomsPageHeader}>Welcome to the Rooms Dashboard</h1>
            <button className={classes.RoomsPageButton} onClick={openRoomsDashboard}>Rooms Dashboard</button>
            <button className={classes.RoomsPageButton} onClick={openHouseMap}>House Map</button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="House Map"
                className={houseMapClasses.Modal}
            >
                <HouseMap onClose={() => setModalIsOpen(false)} />
            </Modal>
        </div>
    );
};

export default RoomsPage;
