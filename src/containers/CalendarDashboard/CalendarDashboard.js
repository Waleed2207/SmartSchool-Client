
// // V1.
// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import EventsTable from "../../components/EventTable/EventTable";
// import classes from "./CalendarDashboard.module.scss";
// import { SERVER_URL } from "../../consts";
// import dayjs from "dayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import TextField from "@mui/material/TextField";
// import { toast } from "react-toastify";
// import RulesModal from "../../components/RulesModal/RulesModal";
// import { useSpace } from "../../contexts/SpaceContext";
// import CalendarForm from "../../components/CalendarForm/CalendarForm";

// const localizer = momentLocalizer(moment);

// const CalendarDashboard = ({ token }) => {
//   const { spaceId } = useSpace();
//   const [events, setEvents] = useState([]);
//   const [openAddEventModal, setOpenAddEventModal] = useState(false);
//   const [search, setSearch] = useState("");
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);


//   const fetchRooms = async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}/api-room/rooms/space/${spaceId}`);
//       if (response.status === 200) {
//         setRooms(response.data);
//       } else {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Failed to fetch rooms:', error);
//       toast.error(`Failed to fetch rooms. ${error.message}`);
//     }
//   };
  
//   const fetchEvents = async () => {
//     try {
//       const url = `${SERVER_URL}/api-calendar/get-all-events/${spaceId}`;
//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.info("Events fetched successfully!");
//       setEvents(response.data);
//       setLoading(false); // Stop loading after fetching events
//     } catch (error) {
//       console.error("Failed to fetch events:", error);
//       toast.error("Failed to fetch events.");
//       setLoading(false); // Stop loading even if there's an error
//     }
//   };

//   useEffect(() => {
//     if (spaceId) {
//       fetchEvents();
//       fetchRooms();
//     }
//   }, [spaceId]);

//   const onSearchInputChange = (event) => {
//     const { value } = event.target;
//     setSearch(value);

//     if (value) {
//       const filtered = events.filter((event) =>
//         event.title?.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredEvents(filtered);
//     } else {
//       setFilteredEvents([]);
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

//         {filteredEvents.length > 0 && (
//           <div className={classes.FilteredEvents}>
//             {filteredEvents.map((event) => (
//               <div
//                 key={event._id}
//                 className={classes.FilteredEvent}
//                 onClick={() => setSelectedEvent(event._id)}
//               >
//                 {event.title}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <RulesModal show={openAddEventModal} onCloseModal={handleCloseAddEventModal} title="Add Calendar Event">
//         {spaceId ? (
//           <CalendarForm
//             token={token}
//             spaceId={spaceId}
//             onEventAdded={() => fetchEvents(spaceId)}
//             rooms={rooms}
//           />
//         ) : (
//           <p>Loading...</p>
//         )}
//       </RulesModal>

//       {loading ? (
//         <p>Loading events...</p>
//       ) : (
//         <Calendar
//           localizer={localizer}
//           events={events.map(event => ({
//             ...event,
//             start: new Date(event.time),
//             end: new Date(event.time)
//           }))}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: 500 }}
//           onSelectEvent={(event) => setSelectedEvent(event._id)}
//         />
//       )}

//       {spaceId && (
//         <EventsTable
//           events={filteredEvents.length > 0 ? filteredEvents : events}
//           onEventClick={(id) => setSelectedEvent(id)}
//           selectedEvent={selectedEvent}
//           token={token}
//           spaceId={spaceId}
//           fetchEvents={fetchEvents}
//         />
//       )}
//     </div>
//   );
// };

// CalendarDashboard.propTypes = {
//   token: PropTypes.string.isRequired,
// };


// CalendarDashboard.defaultProps = {
//   token: "", // Default to an empty string
// };

// export default CalendarDashboard;


import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import classes from "./CalendarDashboard.module.scss";
import { SERVER_URL } from "../../consts";
import { toast } from "react-toastify";
import RulesModal from "../../components/RulesModal/RulesModal";
import { useSpace } from "../../contexts/SpaceContext";
import Spinner from "../../components/Spinner/Spinner";

const EventsTable = lazy(() => import("../../components/EventTable/EventTable"));
const CalendarForm = lazy(() => import("../../components/CalendarForm/CalendarForm"));

const localizer = momentLocalizer(moment);

const CalendarDashboard = ({ token }) => {
  const { spaceId } = useSpace();
  const [events, setEvents] = useState([]);
  const [openAddEventModal, setOpenAddEventModal] = useState(false);
  const [search, setSearch] = useState("");
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
  
      if (response.status === 200) {
        const eventsData = response.data.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
  
        setEvents(eventsData);
        setLoading(false);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to fetch events.");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (spaceId) {
      fetchEvents();
      fetchRooms();
    }
  }, [spaceId]);

  const filteredEvents = useMemo(() => {
    if (search) {
      return events.filter(event =>
        event.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return [];
  }, [search, events]);

  const onSearchInputChange = (event) => {
    setSearch(event.target.value);
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
          <Suspense fallback={<Spinner />}>
            <CalendarForm
              token={token}
              spaceId={spaceId}
              onEventAdded={fetchEvents}
              rooms={rooms}
            />
          </Suspense>
        ) : (
          <Spinner />
        )}
      </RulesModal>

      {loading ? (
        <Spinner />
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => setSelectedEvent(event._id)}
        />
      )}

      {spaceId && (
        <Suspense fallback={<Spinner />}>
          <EventsTable
            events={filteredEvents.length > 0 ? filteredEvents : events}
            onEventClick={(id) => setSelectedEvent(id)}
            selectedEvent={selectedEvent}
            token={token}
            spaceId={spaceId}
            fetchEvents={fetchEvents}
          />
        </Suspense>
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

