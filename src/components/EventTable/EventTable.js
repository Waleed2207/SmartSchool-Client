import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classes from "./EventsTable.module.scss";
import { TableStyled, ThStyled, TableContainer, TrStyled, TdStyled } from "./events.styles";
import { Edit, Save, Cancel } from "@mui/icons-material"; // Icons for editing
import { toast } from "react-toastify";
import axios from "axios";
import { SERVER_URL } from "../../consts";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const EventsTable = ({ events, onEventClick, selectedEvent, token, spaceId, fetchEvents }) => {
  const [currentEvents, setCurrentEvents] = useState(events);
  const [editEventId, setEditEventId] = useState(null);
  const [editValue, setEditValue] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    setCurrentEvents(events);
  }, [events]);

  const handleEditClick = (event) => {
    setEditEventId(event._id);
    setEditValue({ title: event.title, description: event.description });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditValue((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleSaveEdit = async (eventId) => {
    try {
      const response = await axios.put(`${SERVER_URL}/api-calendar/events/${eventId}`, editValue, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast.success("Event updated successfully!");
        fetchEvents(); // Refresh the events after update
        setEditEventId(null);
      } else {
        toast.error("Failed to update event.");
      }
    } catch (error) {
      toast.error("Failed to update event.");
    }
  };

  const handleCancelEdit = () => {
    setEditEventId(null);
    setEditValue({});
  };

  const promptDeleteEvent = (id) => {
    setIsModalOpen(true);
    setEventToDelete(id);
  };

  const confirmDeleteEvent = async () => {
    if (eventToDelete === null) return;
    try {
      const response = await axios.delete(`${SERVER_URL}/api-calendar/events/${eventToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Check for the correct status code
      if (response.status === 204) {
        toast.success("Event has been deleted."); // Show toast on successful delete
        fetchEvents(); // Refresh the events after deletion
      } else {
        toast.error("Failed to delete event.");
      }
    } catch (err) {
      console.error('Error deleting event:', err); // Log the error for debugging
      toast.error("Failed to delete event.");
    } finally {
      setIsModalOpen(false);
      setEventToDelete(null);
    }
  };

  return (
    <div className={classes.TableContainer}>
      <TableContainer>
        <TableStyled className={classes.EventsTable}>
          <thead>
            <TrStyled>
              <ThStyled>Title</ThStyled>
              <ThStyled>Description</ThStyled>
              <ThStyled>Time</ThStyled>
              <ThStyled>Action</ThStyled>
            </TrStyled>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <TrStyled
                key={event._id}
                onClick={() => onEventClick(event._id)}
                isSelected={event._id === selectedEvent}
              >
                <TdStyled>
                  {editEventId === event._id ? (
                    <input
                      type="text"
                      name="title"
                      value={editValue.title}
                      onChange={handleEditChange}
                    />
                  ) : (
                    <span>{event.title}</span>
                  )}
                </TdStyled>
                <TdStyled>
                  {editEventId === event._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editValue.description}
                      onChange={handleEditChange}
                    />
                  ) : (
                    <span>{event.description}</span>
                  )}
                </TdStyled>
                <TdStyled>
                  {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
                </TdStyled>
                <TdStyled>
                  {editEventId === event._id ? (
                    <>
                      <Save onClick={() => handleSaveEdit(event._id)} style={{ cursor: "pointer"}} />
                      <Cancel onClick={handleCancelEdit} style={{ cursor: "pointer" }} />
                    </>
                  ) : (
                    <div className={classes.Actions}>
                      <Edit onClick={() => handleEditClick(event)} style={{ cursor: "pointer" }} />
                      <i
                        className={`fa fa-trash ${classes.faTrash}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          promptDeleteEvent(event._id);
                        }}
                      />
                    </div>
                  )}
                </TdStyled>
              </TrStyled>
            ))}
          </tbody>
        </TableStyled>
      </TableContainer>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteEvent}
        message="Are you sure you want to delete this event?"
      />
    </div>
  );
};

EventsTable.propTypes = {
  events: PropTypes.array.isRequired,
  onEventClick: PropTypes.func.isRequired,
  selectedEvent: PropTypes.string,
  token: PropTypes.string.isRequired, // Ensure token is passed as a prop
  spaceId: PropTypes.string.isRequired, // Ensure spaceId is passed as a prop
  fetchEvents: PropTypes.func.isRequired, // Add fetchEvents as a required prop
};
EventsTable.defaultProps = {
    spaceId: ""
};

export default EventsTable;