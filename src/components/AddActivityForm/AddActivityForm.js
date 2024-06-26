import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { SERVER_URL } from "../../consts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./AddActivityForm.module.scss";

const AddActivityForm = ({ token, onActivityAdded }) => {
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityStartTime, setNewActivityStartTime] = useState(dayjs());
  const [newActivityEndTime, setNewActivityEndTime] = useState(dayjs());
  const predefinedActivities = ["Studying", "Sleeping", "watching_tv", "Eating", "Cooking", "Playing", "Outside"];
  const anchorElRef = useRef(null);

  const handleNewActivitySubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (newActivityEndTime.isBefore(newActivityStartTime)) {
      toast.error("End time must be after start time");
      return;
    }

    const newActivity = {
      name: newActivityName,
      startTime: newActivityStartTime.toISOString(),
      endTime: newActivityEndTime.toISOString(),
    };

    try {
      await axios.post(`${SERVER_URL}/api-activities/add-activity`, newActivity, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onActivityAdded();
      setNewActivityName("");
      setNewActivityStartTime(dayjs());
      setNewActivityEndTime(dayjs());
      toast.success("Activity updated successfully");
    } catch (error) {
      console.error("Error updated new activity:", error.response ? error.response.data : error);
      toast.error("Failed to update activity");
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
      <button type="submit" className={classes.addActivityButton} onClick={(e) => e.stopPropagation()}>Add Activity</button>
    </form>
  );
};

AddActivityForm.propTypes = {
  token: PropTypes.string.isRequired,
  onActivityAdded: PropTypes.func.isRequired,
};

export default AddActivityForm;
