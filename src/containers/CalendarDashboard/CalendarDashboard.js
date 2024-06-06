import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventsTable from "../../components/EventTable/EventTable";
import classes from "./CalendarDashboard.module.scss";
import { SERVER_URL } from "../../consts";
import { useSpace } from "../../contexts/SpaceContext";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import RulesModal from "../../components/RulesModal/RulesModal";

const localizer = momentLocalizer(moment);

const CalendarDashboard = ({ token }) => {
  const [events, setEvents] = useState([]);
  const [openAddEventModal, setOpenAddEventModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { spaceId } = useSpace();

  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState(dayjs());
  const [newEventEndTime, setNewEventEndTime] = useState(dayjs());
  const [newEventType, setNewEventType] = useState("");

  const fetchEvents = async () => {
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

  useEffect(() => {
    if (spaceId) {
      fetchEvents();
    }
  }, [spaceId]);

  const onSearchInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (value) {
      const filtered = events.filter((event) =>
        event.title && event.title.toLowerCase().includes(value.toLowerCase())
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
      start: newEventStartTime.toISOString(),
      end: newEventEndTime.toISOString(),
      eventType: newEventType,
      space_id: spaceId // Include the spaceId in the new event data
    };

    try {
      await axios.post(`${SERVER_URL}/api-calendar/add-events`, newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.info("Calendar Event Added successfully!");
      fetchEvents(); // Refresh the events list
      setNewEventName("");
      setNewEventDescription("");
      setNewEventStartTime(dayjs());
      setNewEventEndTime(dayjs());
      setNewEventType("");
      setOpenAddEventModal(false); // Close the modal after adding the event
    } catch (error) {
      console.error("Error adding new event:", error.response ? error.response.data : error);
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
      </div>
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
      </RulesModal>

      <Calendar
        localizer={localizer}
        events={events.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => setSelectedEvent(event._id)}
      />

      <EventsTable
        events={filteredEvents.length > 0 ? filteredEvents : events}
        onEventClick={(id) => setSelectedEvent(id)}
        selectedEvent={selectedEvent}
        token={token}
        spaceId={spaceId}
        fetchEvents={fetchEvents} // Pass the fetchEvents function to refresh the events list
      />
    </div>
  );
};

CalendarDashboard.propTypes = {
  token: PropTypes.string.isRequired,
};

export default CalendarDashboard;
