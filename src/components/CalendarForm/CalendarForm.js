// // V1.

// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import dayjs from "dayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";
// import axios from "axios";
// import { SERVER_URL } from "../../consts";
// import classes from "./CalendarForm.module.scss";
// import { toast } from "react-toastify";

// const CalendarForm = ({ token, onEventAdded, spaceId, rooms }) => {
//   const [newEventName, setNewEventName] = useState("");
//   const [newEventDescription, setNewEventDescription] = useState("");
//   const [newEventTime, setNewEventTime] = useState(dayjs());
//   const [newEventType, setNewEventType] = useState("");
//   const [roomName, setRoomName] = useState("");
//   const [devices, setDevices] = useState([]);
//   const [selectedDevices, setSelectedDevices] = useState({});
//   const [repeat, setRepeat] = useState("none");
//   const [repeatCount, setRepeatCount] = useState(0);
//   const [raspberryPiIP, setRaspberryPiIP] = useState("");
//   const [state, setState] = useState("on");

//   const fetchRaspberryPiIP = async (spaceId) => {
//     try {
//       const response = await axios.get(`${SERVER_URL}/api-space/spaces/${spaceId}`);
//       if (response.data && response.data.data && response.data.data.rasp_ip) {
//         const rasp_ip = response.data.data.rasp_ip;
//         setRaspberryPiIP(rasp_ip);
//         return rasp_ip;
//       } else {
//         setRaspberryPiIP("");
//         return null;
//       }
//     } catch (error) {
//       setRaspberryPiIP("");
//       return null;
//     }
//   };

//   useEffect(() => {
//     if (spaceId) {
//       fetchRaspberryPiIP(spaceId);
//     }
//   }, [spaceId]);

//   useEffect(() => {
//     const fetchDevices = async () => {
//       if (roomName) {
//         try {
//           const response = await fetch(`${SERVER_URL}/api-device/device/space/${spaceId}/${encodeURIComponent(roomName)}`);
//           if (response.ok) {
//             const data = await response.json();
//             setDevices(data);
//           } else {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//         } catch (error) {
//           toast.error(`Failed to fetch devices. ${error.message}`);
//         }
//       }
//     };

//     fetchDevices();
//   }, [roomName, spaceId]);

//   const handleDeviceSelectionChange = (device) => {
//     setSelectedDevices(prevState => {
//       if (prevState[device]) {
//         const newState = { ...prevState };
//         delete newState[device];
//         return newState;
//       } else {
//         return { ...prevState, [device]: 'on' };
//       }
//     });
//   };

//   const handleRoomChange = (event) => {
//     const selectedRoomName = event.target.value;
//     setRoomName(selectedRoomName);
//   };

//   const handleNewEventSubmit = async (event) => {
//     event.preventDefault();
//     event.stopPropagation();

//     const newEvent = {
//       title: newEventName,
//       description: newEventDescription,
//       time: newEventTime.toISOString(),
//       eventType: newEventType,
//       space_id: spaceId,
//       roomName: roomName,
//       roomDevices: Object.keys(selectedDevices).filter(deviceId => selectedDevices[deviceId]),
//       repeat: repeat,
//       repeatCount: repeatCount,
//       raspberryPiIP: raspberryPiIP,
//       state: state
//     };

//     try {
//       await axios.post(`${SERVER_URL}/api-calendar/add-events`, newEvent, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.info("Calendar Event Added successfully!");
//       onEventAdded();
//       setNewEventName("");
//       setNewEventDescription("");
//       setNewEventTime(dayjs());
//       setNewEventType("");
//       setRoomName("");
//       setSelectedDevices({});
//       setRepeat("none");
//       setRepeatCount(0);
//       setState("on");
//     } catch (error) {
//       toast.error("Failed to add event.");
//     }
//   };

//   return (
//     <form onSubmit={handleNewEventSubmit} className={classes.NewEventForm}>
//       <TextField
//         label="Event Name"
//         value={newEventName}
//         onChange={(e) => setNewEventName(e.target.value)}
//         required
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Event Description"
//         value={newEventDescription}
//         onChange={(e) => setNewEventDescription(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         select
//         label="Room Name"
//         value={roomName}
//         onChange={handleRoomChange}
//         required
//         fullWidth
//         margin="normal"
//       >
//         <MenuItem value="">
//           <em>Select Room</em>
//         </MenuItem>
//         {rooms.map((room) => (
//           <MenuItem key={room._id} value={room.name}>
//             {room.name}
//           </MenuItem>
//         ))}
//       </TextField>
//       <div className={classes.row}>
//         <TextField
//           select
//           label="Event Type"
//           value={newEventType}
//           onChange={(e) => setNewEventType(e.target.value)}
//           required
//           className={classes.column}
//           margin="normal"
//         >
//           <MenuItem value="">
//             <em>Select Event Type</em>
//           </MenuItem>
//           <MenuItem value="holiday">Holiday</MenuItem>
//           <MenuItem value="weekend">Weekend</MenuItem>
//           <MenuItem value="lecture">Lecture</MenuItem>
//           <MenuItem value="party">Party</MenuItem>
//         </TextField>
//         <TextField
//           select
//           label="Repeat"
//           value={repeat}
//           onChange={(e) => setRepeat(e.target.value)}
//           required
//           className={classes.column}
//           margin="normal"
//         >
//           <MenuItem value="none">
//             <em>None</em>
//           </MenuItem>
//           <MenuItem value="daily">Daily</MenuItem>
//           <MenuItem value="weekly">Weekly</MenuItem>
//           <MenuItem value="monthly">Monthly</MenuItem>
//         </TextField>
//       </div>
//       <div className={classes.row}>
//         <TextField
//           label="Repeat Count"
//           type="number"
//           value={repeatCount}
//           onChange={(e) => setRepeatCount(e.target.value)}
//           className={classes.column}
//           margin="normal"
//         />
//         <TextField
//           select
//           label="State"
//           value={state}
//           onChange={(e) => setState(e.target.value)}
//           required
//           className={classes.column}
//           margin="normal"
//         >
//           <MenuItem value="on">on</MenuItem>
//           <MenuItem value="off">off</MenuItem>
//         </TextField>
//       </div>
//       <h3 className={classes.sectionTitle}>Devices</h3>
//       <div className={classes.deviceRow}>
//         {devices.map((device, index) => (
//           <div key={index} className={classes.deviceCheckbox}>
//             <label htmlFor={`device_${device}`} className={classes.deviceLabel}>
//               <input
//                 type="checkbox"
//                 id={`device_${device}`}
//                 name={`device_${device}`}
//                 value={device}
//                 onChange={() => handleDeviceSelectionChange(device)}
//               />
//               {device}
//             </label>
//           </div>
//         ))}
//       </div>
//       <div className={classes.DateTimeContainer}>
//         <div className={classes.DateTimeLabel}>Time</div>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DateTimePicker
//             value={newEventTime}
//             onChange={(newValue) => setNewEventTime(newValue)}
//             slotProps={{ textField: { fullWidth: true } }}
//           />
//         </LocalizationProvider>
//       </div>
//       <button type="submit" className={classes.addEventButton}>Add Event</button>
//     </form>
//   );
// };

// CalendarForm.propTypes = {
//   token: PropTypes.string.isRequired,
//   onEventAdded: PropTypes.func.isRequired,
//   spaceId: PropTypes.string.isRequired,
//   rooms: PropTypes.arrayOf(PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//   })).isRequired,
// };

// export default CalendarForm;

import React, { useState, useEffect, useCallback } from "react";
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
  const [newEventStartTime, setNewEventStartTime] = useState(dayjs());
  const [newEventEndTime, setNewEventEndTime] = useState(dayjs());
  const [newEventType, setNewEventType] = useState("");
  const [roomName, setRoomName] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState({});
  const [repeat, setRepeat] = useState("none");
  const [repeatCount, setRepeatCount] = useState(0);
  const [raspberryPiIP, setRaspberryPiIP] = useState("");
  const [state, setState] = useState("on");

  const fetchRaspberryPiIP = useCallback(async (spaceId) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-space/spaces/${spaceId}`);
      if (response.data && response.data.data && response.data.data.rasp_ip) {
        setRaspberryPiIP(response.data.data.rasp_ip);
      } else {
        setRaspberryPiIP("");
      }
    } catch (error) {
      setRaspberryPiIP("");
    }
  }, []);

  useEffect(() => {
    if (spaceId) {
      fetchRaspberryPiIP(spaceId);
    }
  }, [spaceId, fetchRaspberryPiIP]);

  useEffect(() => {
    const fetchDevices = async () => {
      if (roomName) {
        try {
          const response = await fetch(`${SERVER_URL}/api-device/device/space/${spaceId}/${encodeURIComponent(roomName)}`);
          if (response.ok) {
            const data = await response.json();
            setDevices(data);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          toast.error(`Failed to fetch devices. ${error.message}`);
        }
      }
    };

    fetchDevices();
  }, [roomName, spaceId]);

  const handleDeviceSelectionChange = useCallback((device) => {
    setSelectedDevices((prevState) => {
      if (prevState[device]) {
        const newState = { ...prevState };
        delete newState[device];
        return newState;
      } else {
        return { ...prevState, [device]: 'on' };
      }
    });
  }, []);

  const handleRoomChange = useCallback((event) => {
    setRoomName(event.target.value);
  }, []);

  const handleNewEventSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!newEventName || !roomName || !newEventType) {
      toast.error("Please fill all the required fields.");
      return;
    }

    const newEvent = {
      title: newEventName,
      description: newEventDescription,
      startTime: newEventStartTime.toISOString(),
      endTime: newEventEndTime.toISOString(),
      eventType: newEventType,
      space_id: spaceId,
      roomName: roomName,
      roomDevices: Object.keys(selectedDevices).filter(deviceId => selectedDevices[deviceId]),
      repeat: repeat,
      repeatCount: repeatCount,
      raspberryPiIP: raspberryPiIP,
      state: state
    };

    try {
      await axios.post(`${SERVER_URL}/api-calendar/add-events`, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.info("Calendar Event Added successfully!");
      onEventAdded();
      setNewEventName("");
      setNewEventDescription("");
      setNewEventStartTime(dayjs());
      setNewEventEndTime(dayjs());
      setNewEventType("");
      setRoomName("");
      setSelectedDevices({});
      setRepeat("none");
      setRepeatCount(0);
      setState("on");
    } catch (error) {
      toast.error(`Failed to add event. ${error.message}`);
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
      <div className={classes.row}>
        <TextField
          select
          label="Event Type"
          value={newEventType}
          onChange={(e) => setNewEventType(e.target.value)}
          required
          className={classes.column}
          margin="normal"
        >
          <MenuItem value="">
            <em>Select Event Type</em>
          </MenuItem>
          <MenuItem value="holiday">Holiday</MenuItem>
          <MenuItem value="weekend">Weekend</MenuItem>
          <MenuItem value="lecture">Lecture</MenuItem>
          <MenuItem value="party">Party</MenuItem>
        </TextField>
        <TextField
          select
          label="Repeat"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          required
          className={classes.column}
          margin="normal"
        >
          <MenuItem value="none">
            <em>None</em>
          </MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </TextField>
      </div>
      <div className={classes.row}>
        <TextField
          label="Repeat Count"
          type="number"
          value={repeatCount}
          onChange={(e) => setRepeatCount(e.target.value)}
          className={classes.column}
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
          className={classes.column}
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
      </div>
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
      <div className={classes.DateTimeRow}>
        <div className={classes.DateTimeContainer}>
          <div className={classes.DateTimeLabel}>Start Time</div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={newEventStartTime}
              onChange={(newValue) => setNewEventStartTime(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </div>
        <div className={classes.DateTimeContainer}>
          <div className={classes.DateTimeLabel}>End Time</div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={newEventEndTime}
              onChange={(newValue) => setNewEventEndTime(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </div>
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