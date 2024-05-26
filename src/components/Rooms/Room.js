import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Room.module.scss";
import { SERVER_URL } from "../../consts";
import {jwtDecode} from 'jwt-decode';
import AddActivityForm from "../../components/AddActivityForm/AddActivityForm";
import RulesModal from "../../components/RulesModal/RulesModal";
import dayjs from 'dayjs';

function Room(props) {
  const [currentActivity, setCurrentActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [openAddActivityModal, setOpenAddActivityModal] = useState(false);

  const checkToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      return decodedToken;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  const fetchCurrentActivity = async () => {
    try {
      console.log("Token:", props.token);
      const decoded = checkToken(props.token);
      if (!decoded) throw new Error('Invalid token');

      const response = await axios.get(`${SERVER_URL}/api-activities/current-activity/${props.id}`, {
        headers: { Authorization: `Bearer ${props.token}` }
      });
      console.log("Current activity response:", response);

      if (response.data && response.data.name) {
        setCurrentActivity(response.data.name);
      } else {
        console.warn("No current activity data received");
        setCurrentActivity("No current activity");
      }
    } catch (error) {
      console.error("Error fetching current activity:", error.response ? error.response.data : error.message);
      setCurrentActivity("Error fetching current activity");
    }
  };

  useEffect(() => {
    fetchCurrentActivity();
    const interval = setInterval(() => {
      fetchCurrentActivity();
    }, 3600000);

    return () => clearInterval(interval);
  }, [props.token]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log("Token:", props.token);
        const decoded = checkToken(props.token);
        if (!decoded) throw new Error('Invalid token');

        const response = await axios.get(`${SERVER_URL}/api-activities/activities/${props.id}`, {
          headers: { Authorization: `Bearer ${props.token}` }
        });
        console.log("Activities response:", response);
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [props.token]);

  const handleActivityAdded = async () => {
    const response = await axios.get(`${SERVER_URL}/api-activities/activities/${props.id}`, {
      headers: { Authorization: `Bearer ${props.token}` }
    });
    setActivities(response.data);
  };

  const handleOpenAddActivityModal = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to parent elements
    setOpenAddActivityModal(true);
  };

  const handleCloseAddActivityModal = () => {
    setOpenAddActivityModal(false);
  };

  return (
    <div className={classes.Room}>
      <div>
        <div className={classes.Title}>{props.name}</div>
        <div>
          {props.devicesCount} {props.devicesCount === 1 ? "Device" : "Devices"}
        </div>
        <div className={classes.ActivityContainer}>
          <span className={classes.ActivityLabel}>Room Current Activity:</span>
          <span className={classes.CurrentActivity}>{currentActivity}</span> {/* Display current activity */}
        </div>
        <button onClick={handleOpenAddActivityModal} className={classes.AddActivityButton}>Add Activity</button>
        <RulesModal show={openAddActivityModal} onCloseModal={handleCloseAddActivityModal} title="Add Activity">
          <AddActivityForm roomId={props.id} token={props.token} onActivityAdded={handleActivityAdded} />
        </RulesModal>
      </div>
      {props.icon ? (
        <FontAwesomeIcon icon={props.icon} className={classes.Icon} />
      ) : null}
    </div>
  );
}

Room.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  icon: PropTypes.object,
  devicesCount: PropTypes.number,
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default Room;
