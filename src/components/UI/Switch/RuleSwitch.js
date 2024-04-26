import axios from "axios";
import React from "react";
import { SERVER_URL } from "../../../consts";
import classes from "./Switch.module.scss";

export const RuleSwitch = ({ id, isActive: initialIsActive, rule, currentRules, setCurrentRules }) => {
  const [isActive, setIsActive] = React.useState(initialIsActive);
  const [error, setError] = React.useState("");

  const toggleChange = async () => {
    const newIsActive = !isActive; // Determine the new state early to log it
    console.log(`Toggling rule ${id} to ${newIsActive ? 'active' : 'inactive'}.`); // Log the intended new state

    const payload = {
      isActive: newIsActive,
      rule: rule,
    };

    try {
      const response = await axios.post(`${SERVER_URL}/api-rules/rules/${id}`, payload);
      setCurrentRules((prevRules) =>
        prevRules.map((r) => (r.id === id ? { ...r, isActive: newIsActive } : r))
      );
      setIsActive(newIsActive); // Update the local state to the new value
      setError(""); // Clear any previous errors
      console.log(`Rule ${id} successfully toggled to ${newIsActive ? 'active' : 'inactive'}.`); // Log successful state change
    } catch (error) {
      console.error(error.response || error);
      setError("Error toggling rule state. Please try again."); // Update the UI to inform the user
      console.log(`Error toggling rule ${id}.`); // Log the error
    }
  };

  let switchClasses = [classes.Switch];
  if (isActive) {
    switchClasses.push(classes.Checked);
  }

  return (
    <label className={switchClasses.join(" ")} aria-label={`Toggle rule ${rule}`}>
      <input
        type="checkbox"
        onChange={toggleChange}
        checked={isActive}
        role="switch"
        aria-checked={isActive}
      />
      <div />
      {error && <p className={classes.Error}>{error}</p>} {/* Display error message if any */}
    </label>
  );
};

export default RuleSwitch;
