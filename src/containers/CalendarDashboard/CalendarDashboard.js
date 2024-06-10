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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import RulesModal from "../../components/RulesModal/RulesModal";
import { useSpace } from "../../contexts/SpaceContext";
import {jwtDecode} from "jwt-decode";

const localizer = momentLocalizer(moment);

const CalendarDashboard = ({ token }) => {
  const { spaceId } = useSpace();
  const [events, setEvents] = useState([]);
  const [openAddEventModal, setOpenAddEventModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventTime, setNewEventTime] = useState(dayjs());
  const [newEventType, setNewEventType] = useState("");

  const checkToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      return decodedToken;
    } catch (error) {
      console.error('Invalid token:', error);
      setTokenError('Invalid token');
      return null;
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchEvents(spaceId);
    } else {
      console.error("spaceId is null");
    }
  }, [spaceId, token]);

  const fetchEvents = async (spaceId) => {
    try {
      const url = `${SERVER_URL}/api-calendar/get-all-events/${spaceId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.info("Events fetched successfully!");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to fetch events.");
    }
  };

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

  const handleNewEventSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newEvent = {
      title: newEventName,
      description: newEventDescription,
      time: newEventTime.toISOString(), // Ensure this is "time"
      eventType: newEventType,
      space_id: spaceId
    };

    try {
      await axios.post(`${SERVER_URL}/api-calendar/add-events`, newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.info("Calendar Event Added successfully!");
      fetchEvents(spaceId);
      setNewEventName("");
      setNewEventDescription("");
      setNewEventTime(dayjs());
      setNewEventType("");
      setOpenAddEventModal(false);
    } catch (error) {
      console.error("Error adding new event:", error.response ? error.response.data : error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`${SERVER_URL}/api-calendar/delete-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 204) {
        toast.info("Event deleted successfully!");
        setEvents(events.filter(event => event._id !== eventId));
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error.response ? error.response.data : error);
      toast.error("Failed to delete event.");
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
            <div className={classes.DateTimeLabel}>Time</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={newEventTime}
                onChange={(newValue) => setNewEventTime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </div>
          <div className={classes.DatePostion}>
             <button type="submit" className={classes.addEventButton}>Add Event</button>
          </div>
        </form>
      </RulesModal>

      <Calendar
        localizer={localizer}
        events={events.map(event => ({
          ...event,
          start: new Date(event.time), // Ensure to use "time" instead of "start"
          end: new Date(event.time) // Ensure to use "time" instead of "end"
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => setSelectedEvent(event._id)}
      />

    
      {spaceId && (
        <EventsTable
          events={filteredEvents.length > 0 ? filteredEvents : events}
          onEventClick={(id) => setSelectedEvent(id)}
          selectedEvent={selectedEvent}
          token={token}
          spaceId={spaceId}
          fetchEvents={fetchEvents} // Pass the fetchEvents function to refresh the events list
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
