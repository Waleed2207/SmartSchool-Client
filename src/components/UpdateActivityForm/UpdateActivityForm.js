import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SERVER_URL } from "../../consts";
import classes from "./UpdateActivityForm.module.scss";

const UpdateActivityForm = ({ token, activityId, onActivityUpdated }) => {
  const [ActivityName, setActivityName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const predefinedActivities = ["Studying", "Sleeping", "Watching TV", "Eating", "Cooking", "Playing", "Outside"];

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api-activities/activity/${activityId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivityName(response.data.name);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching activity:", error.response ? error.response.data : error);
        setError("Failed to fetch activity");
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [activityId, token]);

  const handleUpdateActivity = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const updatedActivity = {
      activityId,
      name: ActivityName
    };

    try {
      await axios.post(`${SERVER_URL}/api-activities/update-activity`, updatedActivity, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onActivityUpdated();
    } catch (error) {
      console.error("Error updating activity:", error.response ? error.response.data : error);
      setError("Failed to update activity");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleUpdateActivity} className={classes.UpdateActivityForm}>
      {error && <p className={classes.Error}>{error}</p>}

      <select
        value={ActivityName}
        onChange={(e) => setActivityName(e.target.value)}
        required
        onClick={(e) => e.stopPropagation()}
        className={classes.ActivityDropdown}
      >
        <option value="" disabled>Select an activity</option>
        {predefinedActivities.map(activity => (
          <option key={activity} value={activity}>{activity}</option>
        ))}
      </select>
      <Button type="submit" variant="contained" color="primary">
        Update Activity
      </Button>
    </form>
  );
};

UpdateActivityForm.propTypes = {
  token: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
  onActivityUpdated: PropTypes.func.isRequired,
};

export default UpdateActivityForm;
