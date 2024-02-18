import axios from "axios";
import React from "react";
// Assuming SERVER_URL is correctly defined in your environment variables
import { SERVER_URL } from "../../../consts";
import classes from "./Switch.module.scss";

export const RuleSwitch = ({ id, isActive: initialIsActive, rule, currentRules, setCurrentRules }) => {
  const [isActive, setIsActive] = React.useState(initialIsActive);
  const [error, setError] = React.useState(""); // New state for handling errors

  const toggleChange = async () => {
    const payload = {
      isActive: !isActive,
      rule: rule,
    };

    try {
      const response = await axios.post(`${SERVER_URL}/api-rule/rules/${id}`, payload);
      setCurrentRules((prevRules) =>
        prevRules.map((r) => (r.id === id ? { ...r, isActive: !isActive } : r))
      );
      setIsActive((prevIsActive) => !prevIsActive);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error(error.response || error);
      setError("Error toggling rule state. Please try again."); // Update the UI to inform the user
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
