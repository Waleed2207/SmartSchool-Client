import React, { useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { SERVER_URL } from "../../consts";
import classes from "./AddActivityForm.module.scss";

const AddActivityForm = ({ roomId, token, onActivityAdded }) => {
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityStartTime, setNewActivityStartTime] = useState(dayjs());
  const [newActivityEndTime, setNewActivityEndTime] = useState(dayjs());
  const predefinedActivities = ["Studying", "Sleeping", "Watching TV", "Eating", "Cooking", "Playing", "Outside"];

  const handleNewActivitySubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newActivity = {
      name: newActivityName,
      startTime: newActivityStartTime.toISOString(),
      endTime: newActivityEndTime.toISOString(),
      room: roomId
    };

    try {
      await axios.post(`${SERVER_URL}/api-activities/add-activity`, newActivity, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onActivityAdded();
      setNewActivityName("");
      setNewActivityStartTime(dayjs());
      setNewActivityEndTime(dayjs());
    } catch (error) {
      console.error("Error adding new activity:", error.response ? error.response.data : error);
    }
  };

  return (
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
            renderInput={(params) => <TextField {...params} onClick={(e) => e.stopPropagation()} fullWidth />}
          />
        </LocalizationProvider>
      </div>
      <div className={classes.ClockContainer} onClick={(e) => e.stopPropagation()}>
        <div className={classes.ClockLabel}>End Time</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={newActivityEndTime}
            onChange={(newValue) => setNewActivityEndTime(newValue)}
            renderInput={(params) => <TextField {...params} onClick={(e) => e.stopPropagation()} fullWidth />}
          />
        </LocalizationProvider>
      </div>
      <button type="submit" className={classes.addActivityButton} onClick={(e) => e.stopPropagation()}>Add Activity</button>
    </form>
  );
};

AddActivityForm.propTypes = {
  roomId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  onActivityAdded: PropTypes.func.isRequired,
};

export default AddActivityForm;
