// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import EventsTable from "../../components/EventTable/EventTable";
// import classes from "./CalendarDashboard.module.scss";
// import { SERVER_URL } from "../../consts";
// import { useSpace } from "../../contexts/SpaceContext";
// import dayjs from "dayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import TextField from "@mui/material/TextField";
// import { toast } from "react-toastify";
// import RulesModal from "../../components/RulesModal/RulesModal";

// const localizer = momentLocalizer(moment);

// const CalendarDashboard = ({ token }) => {
//   const [events, setEvents] = useState([]);
//   const [openAddEventModal, setOpenAddEventModal] = useState(false);
//   const [search, setSearch] = useState("");
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const { spaceId } = useSpace();

//   const [newEventName, setNewEventName] = useState("");
//   const [newEventDescription, setNewEventDescription] = useState("");
//   const [newEventStartTime, setNewEventStartTime] = useState(dayjs());
//   const [newEventEndTime, setNewEventEndTime] = useState(dayjs());
//   const [newEventType, setNewEventType] = useState("");

//   const fetchEvents = async () => {
//     try {
//       const url = `${SERVER_URL}/api-calendar/get-all-events/${spaceId}`;
//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.info("Events fetched successfully!");
//       setEvents(response.data);
//     } catch (error) {
//       console.error("Failed to fetch events:", error);
//       toast.error("Failed to fetch events.");
//     }
//   };

//   useEffect(() => {
//     if (spaceId) {
//       fetchEvents();
//     }
//   }, [spaceId]);

//   const onSearchInputChange = (event) => {
//     const value = event.target.value;
//     setSearch(value);
//     if (value) {
//       const filtered = events.filter((event) =>
//         event.title && event.title.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredEvents(filtered);
//     } else {
//       setFilteredEvents([]);
//     }
//   };

//   const handleNewEventSubmit = async (event) => {
//     event.preventDefault();
//     event.stopPropagation();

//     const newEvent = {
//       title: newEventName,
//       description: newEventDescription,
//       start: newEventStartTime.toISOString(),
//       end: newEventEndTime.toISOString(),
//       eventType: newEventType,
//       space_id: spaceId // Include the spaceId in the new event data
//     };

//     try {
//       await axios.post(`${SERVER_URL}/api-calendar/add-events`, newEvent, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.info("Calendar Event Added successfully!");
//       fetchEvents(); // Refresh the events list
//       setNewEventName("");
//       setNewEventDescription("");
//       setNewEventStartTime(dayjs());
//       setNewEventEndTime(dayjs());
//       setNewEventType("");
//       setOpenAddEventModal(false); // Close the modal after adding the event
//     } catch (error) {
//       console.error("Error adding new event:", error.response ? error.response.data : error);
//     }
//   };

//   const handleOpenAddEventModal = () => {
//     setOpenAddEventModal(true);
//   };

//   const handleCloseAddEventModal = () => {
//     setOpenAddEventModal(false);
//   };

//   return (
//     <div className={classes.CalendarDashboard}>
//       <div className={classes.SearchContainer}>
//         <input
//           type="text"
//           value={search}
//           onChange={onSearchInputChange}
//           placeholder="Search for an event..."
//           className={classes.SearchInput}
//         />
//         <button onClick={handleOpenAddEventModal} className={classes.addButton}>Add Event</button>
//       </div>
//       {filteredEvents.length > 0 && (
//         <div className={classes.FilteredEvents}>
//           {filteredEvents.map((event) => (
//             <div
//               key={event._id}
//               className={classes.FilteredEvent}
//               onClick={() => setSelectedEvent(event._id)}
//             >
//               {event.title}
//             </div>
//           ))}
//         </div>
//       )}
      
//       <RulesModal show={openAddEventModal} onCloseModal={handleCloseAddEventModal} title="Add Calendar Event">
//         <form onSubmit={handleNewEventSubmit} className={classes.NewEventForm}>
//           <TextField
//             label="Event Name"
//             value={newEventName}
//             onChange={(e) => setNewEventName(e.target.value)}
//             required
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Event Description"
//             value={newEventDescription}
//             onChange={(e) => setNewEventDescription(e.target.value)}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             value={newEventType}
//             onChange={(e) => setNewEventType(e.target.value)}
//             required
//             select
//             fullWidth
//             margin="normal"
//             SelectProps={{ native: true }}
//             className={classes.EventTypeField}
//           >
//             <option value="">Select Event Type</option>
//             <option value="holiday">Holiday</option>
//             <option value="weekend">Weekend</option>
//             <option value="lecture">Lecture</option>
//           </TextField>
//           <div className={classes.DatePostion}>
//             <div className={classes.DateTimeContainer}>
//                 <div className={classes.DateTimeLabel}>Start Time</div>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DateTimePicker
//                     value={newEventStartTime}
//                     onChange={(newValue) => setNewEventStartTime(newValue)}
//                     slots={{ textField: TextField }}
//                 />
//                 </LocalizationProvider>
//             </div>
//             <div className={classes.DateTimeContainer}>
//                 <div className={classes.DateTimeLabel}>End Time</div>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DateTimePicker
//                     value={newEventEndTime}
//                     onChange={(newValue) => setNewEventEndTime(newValue)}
//                     slots={{ textField: TextField }}
//                 />
//                 </LocalizationProvider>
//             </div>
//           </div>
//           <div className={classes.DatePostion}>
//              <button type="submit" className={classes.addEventButton}>Add Event</button>
//           </div>
//         </form>
//       </RulesModal>

//       <Calendar
//         localizer={localizer}
//         events={events.map(event => ({
//           ...event,
//           start: new Date(event.start),
//           end: new Date(event.end)
//         }))}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: 500 }}
//         onSelectEvent={(event) => setSelectedEvent(event._id)}
//       />

//       {spaceId && (
//         <EventsTable
//           events={filteredEvents.length > 0 ? filteredEvents : events}
//           onEventClick={(id) => setSelectedEvent(id)}
//           selectedEvent={selectedEvent}
//           token={token}
//           spaceId={spaceId}
//           fetchEvents={fetchEvents} // Pass the fetchEvents function to refresh the events list
//         />
//       )}
//     </div>
//   );
// };

// CalendarDashboard.propTypes = {
//   token: PropTypes.string.isRequired,
// };
// CalendarDashboard.defaultProps = {
//     token: "", // Default to an empty string
// };
// export default CalendarDashboard;

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventsTable from "../../components/EventTable/EventTable";
import classes from "./CalendarDashboard.module.scss";
import { SERVER_URL } from "../../consts";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import RulesModal from "../../components/RulesModal/RulesModal";
import { useSpace } from "../../contexts/SpaceContext";
import CalendarForm from "../../components/CalendarForm/CalendarForm";

const localizer = momentLocalizer(moment);

const CalendarDashboard = ({ token }) => {
  const { spaceId } = useSpace();
  const [events, setEvents] = useState([]);
  const [openAddEventModal, setOpenAddEventModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-room/rooms/space/${spaceId}`);
      if (response.status === 200) {
        setRooms(response.data);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error(`Failed to fetch rooms. ${error.message}`);
    }
  };
  
  const fetchEvents = async () => {
    try {
      const url = `${SERVER_URL}/api-calendar/get-all-events/${spaceId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.info("Events fetched successfully!");
      setEvents(response.data);
      setLoading(false); // Stop loading after fetching events
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to fetch events.");
      setLoading(false); // Stop loading even if there's an error
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchEvents();
      fetchRooms();
    }
  }, [spaceId]);

  const onSearchInputChange = (event) => {
    const { value } = event.target;
    setSearch(value);

    if (value) {
      const filtered = events.filter((event) =>
        event.title?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents([]);
    }
  };

  const handleOpenAddEventModal = () => {
    setOpenAddEventModal(true);
  };

  const handleCloseAddEventModal = () => {
    setOpenAddEventModal(false);
  };

  return (
    <div className={classes.CalendarDashboard}>
      <div className={classes.SearchContainer}>
        <input
          type="text"
          value={search}
          onChange={onSearchInputChange}
          placeholder="Search for an event..."
          className={classes.SearchInput}
        />
        <button onClick={handleOpenAddEventModal} className={classes.addButton}>Add Event</button>

        {filteredEvents.length > 0 && (
          <div className={classes.FilteredEvents}>
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className={classes.FilteredEvent}
                onClick={() => setSelectedEvent(event._id)}
              >
                {event.title}
              </div>
            ))}
          </div>
        )}
      </div>

      <RulesModal show={openAddEventModal} onCloseModal={handleCloseAddEventModal} title="Add Calendar Event">
        {spaceId ? (
          <CalendarForm
            token={token}
            spaceId={spaceId}
            onEventAdded={() => fetchEvents(spaceId)}
            rooms={rooms}
          />
        ) : (
          <p>Loading...</p>
        )}
      </RulesModal>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events.map(event => ({
            ...event,
            start: new Date(event.time),
            end: new Date(event.time)
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => setSelectedEvent(event._id)}
        />
      )}

      {spaceId && (
        <EventsTable
          events={filteredEvents.length > 0 ? filteredEvents : events}
          onEventClick={(id) => setSelectedEvent(id)}
          selectedEvent={selectedEvent}
          token={token}
          spaceId={spaceId}
          fetchEvents={fetchEvents}
        />
      )}
    </div>
  );
};

CalendarDashboard.propTypes = {
  token: PropTypes.string.isRequired,
};


CalendarDashboard.defaultProps = {
  token: "", // Default to an empty string
};

export default CalendarDashboard;
