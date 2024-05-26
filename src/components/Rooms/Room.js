
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Room.module.scss";
import { SERVER_URL } from "../../consts";
import {jwtDecode} from 'jwt-decode';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';

function Room(props) {
  const [currentActivity, setCurrentActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityStartTime, setNewActivityStartTime] = useState(dayjs());
  const [newActivityEndTime, setNewActivityEndTime] = useState(dayjs());

  const predefinedActivities = ["Studying", "Sleeping", "Watching TV", "Eating", "Cooking", "Playing", "Outside"];

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

  const handleNewActivitySubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log('Room ID:', props.id); // Log the room ID

    const newActivity = {
      name: newActivityName,
      startTime: newActivityStartTime.toISOString(), // Convert to ISO string
      endTime: newActivityEndTime.toISOString(), // Convert to ISO string
      room: props.id // Use the original custom ID format
    };

    console.log('New Activity Payload:', newActivity); // Log the payload

    try {
      const response = await axios.post(`${SERVER_URL}/api-activities/add-activity`, newActivity, {
        headers: { Authorization: `Bearer ${props.token}` }
      });
      console.log('Add activity response:', response.data); // Log the response
      const activitiesResponse = await axios.get(`${SERVER_URL}/api-activities/activities/${props.id}`, {
        headers: { Authorization: `Bearer ${props.token}` }
      });
      setActivities(activitiesResponse.data);
      setNewActivityName("");
      setNewActivityStartTime(dayjs());
      setNewActivityEndTime(dayjs());
    } catch (error) {
      console.error("Error adding new activity:", error.response ? error.response.data : error);
    }
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
        <form onSubmit={handleNewActivitySubmit} className={classes.NewActivityForm}>
          <select
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            required
            onClick={(e) => e.stopPropagation()}
            className={classes.ActivityDropdown}
          >
            <option value="" disabled>Select an activity</option>
            {predefinedActivities.map(activity => (
              <option key={activity} value={activity}>{activity}</option>
            ))}
          </select>
          <div className={classes.ClockContainer} onClick={(e) => e.stopPropagation()}>
            <div className={classes.ClockLabel}>Start Time</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={newActivityStartTime}
                onChange={(newValue) => setNewActivityStartTime(newValue)}
                slots={{ textField: (params) => <TextField {...params} onClick={(e) => e.stopPropagation()} /> }}
              />
            </LocalizationProvider>
          </div>
          <div className={classes.ClockContainer} onClick={(e) => e.stopPropagation()}>
            <div className={classes.ClockLabel}>End Time</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={newActivityEndTime}
                onChange={(newValue) => setNewActivityEndTime(newValue)}
                slots={{ textField: (params) => <TextField {...params} onClick={(e) => e.stopPropagation()} /> }}
              />
            </LocalizationProvider>
          </div>
          <button type="submit" onClick={(e) => e.stopPropagation()}>Add Activity</button>
        </form>
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
