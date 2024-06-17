import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { SERVER_URL } from "../../consts";
import classes from "./CalendarForm.module.scss";
import { toast } from "react-toastify";

const CalendarForm = ({ token, onEventAdded, spaceId, rooms }) => {
  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventTime, setNewEventTime] = useState(dayjs());
  const [newEventType, setNewEventType] = useState("");
  const [roomName, setRoomName] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState({});
  const [repeat, setRepeat] = useState("none");
  const [repeatCount, setRepeatCount] = useState(0);

  useEffect(() => {
    const fetchDevices = async () => {
      if (roomName) {
        try {
          const response = await fetch(`${SERVER_URL}/api-device/device/space/${spaceId}/${encodeURIComponent(roomName)}`);
          if (response.ok) {
            const data = await response.json();
            console.log("Fetched devices:", data); // Debug log
            setDevices(data);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.error('Failed to fetch devices:', error);
          toast.error(`Failed to fetch devices. ${error.message}`);
        }
      }
    };

    fetchDevices();
  }, [roomName, spaceId]);

  const handleDeviceSelectionChange = (device) => {
    setSelectedDevices(prevState => {
      if (prevState[device]) {
        const newState = { ...prevState };
        delete newState[device];
        return newState;
      } else {
        return { ...prevState, [device]: 'on' };
      }
    });
  };

  const handleRoomChange = (event) => {
    const selectedRoomName = event.target.value;
    setRoomName(selectedRoomName);
    console.log(`Selected room name: ${selectedRoomName}`);
  };

  const handleNewEventSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newEvent = {
      title: newEventName,
      description: newEventDescription,
      time: newEventTime.toISOString(),
      eventType: newEventType,
      space_id: spaceId,
      roomName: roomName,
      roomDevices: Object.keys(selectedDevices).filter(deviceId => selectedDevices[deviceId]),
      repeat: repeat, // Ensure repeat is included
      repeatCount: repeatCount // Add repeatCount
    };

    try {
      await axios.post(`${SERVER_URL}/api-calendar/add-events`, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.info("Calendar Event Added successfully!");
      onEventAdded();
      setNewEventName("");
      setNewEventDescription("");
      setNewEventTime(dayjs());
      setNewEventType("");
      setRoomName("");
      setSelectedDevices({});
      setRepeat("none");
      setRepeatCount(0);
    } catch (error) {
      console.error("Error adding new event:", error.response ? error.response.data : error);
      toast.error("Failed to add event.");
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
        select
        label="Room Name"
        value={roomName}
        onChange={handleRoomChange}
        required
        fullWidth
        margin="normal"
      >
        <MenuItem value="">
          <em>Select Room</em>
        </MenuItem>
        {rooms.map((room) => (
          <MenuItem key={room._id} value={room.name}>
            {room.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Event Type"
        value={newEventType}
        onChange={(e) => setNewEventType(e.target.value)}
        required
        fullWidth
        margin="normal"
        className={classes.EventTypeField}
      >
        <MenuItem value="">
          <em>Select Event Type</em>
        </MenuItem>
        <MenuItem value="holiday">Holiday</MenuItem>
        <MenuItem value="weekend">Weekend</MenuItem>
        <MenuItem value="lecture">Lecture</MenuItem>
      </TextField>
      <TextField
        select
        label="Repeat"
        value={repeat}
        onChange={(e) => setRepeat(e.target.value)}
        required
        fullWidth
        margin="normal"
        className={classes.RepeatField}
      >
        <MenuItem value="none">
          <em>None</em>
        </MenuItem>
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </TextField>
      <TextField
        label="Repeat Count"
        type="number"
        value={repeatCount}
        onChange={(e) => setRepeatCount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <h3 className={classes.sectionTitle}>Devices</h3>
      <div className={classes.deviceRow}>
        {devices.map((device, index) => (
          <div key={index} className={classes.deviceCheckbox}>
            <label htmlFor={`device_${device}`} className={classes.deviceLabel}>
              <input
                type="checkbox"
                id={`device_${device}`}
                name={`device_${device}`}
                value={device}
                onChange={() => handleDeviceSelectionChange(device)}
              />
              {device}
            </label>
          </div>
        ))}
      </div>
      <div className={classes.DateTimeContainer}>
        <div className={classes.DateTimeLabel}>Time</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={newEventTime}
            onChange={(newValue) => setNewEventTime(newValue)}
            slotProps={{ textField: { fullWidth: true } }} // Updated this line
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
  spaceId: PropTypes.string.isRequired,
  rooms: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default CalendarForm;
