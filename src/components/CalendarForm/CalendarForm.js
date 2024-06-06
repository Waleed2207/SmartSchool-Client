import React, { useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { SERVER_URL } from "../../consts";
import classes from "./CalendarForm.module.scss";
import { toast } from "react-toastify";

const CalendarForm = ({ token, onEventAdded, spaceId }) => {
  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState(dayjs());
  const [newEventEndTime, setNewEventEndTime] = useState(dayjs());
  const [newEventType, setNewEventType] = useState("");

  const handleNewEventSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newEvent = {
      title: newEventName,
      description: newEventDescription,
      start: newEventStartTime.toISOString(),
      end: newEventEndTime.toISOString(),
      eventType: newEventType,
      space_id: spaceId // Include the spaceId in the new event data
    };

    try {
        await axios.post(`${SERVER_URL}/api-calendar/add-events`, newEvent, {        headers: { Authorization: `Bearer ${token}` }
      });
      toast.info("Calendar Event Added successfully!");
      onEventAdded();
      setNewEventName("");
      setNewEventDescription("");
      setNewEventStartTime(dayjs());
      setNewEventEndTime(dayjs());
      setNewEventType("");
    } catch (error) {
      console.error("Error adding new event:", error.response ? error.response.data : error);
    }
  };

  return (
    <form onSubmit={handleNewEventSubmit} className={classes.NewEventForm}>
      <TextField
        label="Event Name"
        value={newEventName}
        onChange={(e) => setNewEventName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Event Description"
        value={newEventDescription}
        onChange={(e) => setNewEventDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Event Type"
        value={newEventType}
        onChange={(e) => setNewEventType(e.target.value)}
        required
        select
        fullWidth
        margin="normal"
        SelectProps={{ native: true }}
        className={classes.EventTypeField}
      >
        <option value="">Select Event Type</option>
        <option value="holiday">Holiday</option>
        <option value="weekend">Weekend</option>
        <option value="lecture">Lecture</option>
      </TextField>
      <div className={classes.DateTimeContainer}>
        <div className={classes.DateTimeLabel}>Start Time</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={newEventStartTime}
            onChange={(newValue) => setNewEventStartTime(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
      </div>
      <div className={classes.DateTimeContainer}>
        <div className={classes.DateTimeLabel}>End Time</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={newEventEndTime}
            onChange={(newValue) => setNewEventEndTime(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
      </div>
      <button type="submit" className={classes.addEventButton}>Add Event</button>
    </form>
  );
};

CalendarForm.propTypes = {
  token: PropTypes.string.isRequired,
  onEventAdded: PropTypes.func.isRequired,
  spaceId: PropTypes.string.isRequired, // Add spaceId to prop types
};

export default CalendarForm;
