import axios from "axios";
import React from "react";
import { SERVER_URL } from "../../../consts";
import classes from "./Switch.module.scss";

export const RuleSwitch = ({ id, isActive: initialIsActive, rule, currentRules, setCurrentRules }) => {
  const [isActive, setIsActive] = React.useState(initialIsActive);

  const ontoggleChange = async () => {
    const payload = {
      isActive: !isActive,
      rule: rule
    };
  
    try {
      const response = await axios.post(`${SERVER_URL}/api-rule/rules/${id}`, payload);
      setCurrentRules(prevRules =>
        prevRules.map(r => (r.id === id ? { ...r, isActive: !isActive } : r))
      );
      setIsActive(prevIsActive => !prevIsActive);
    } catch (error) {
      console.error(error.response);
      console.error("Error toggling rule state:" + error);
      // Handle the error...
    }
  };
  

  let switchClasses = [classes.Switch];
  if (isActive) {
    switchClasses.push(classes.Checked);
  }

  return (
    <label className={switchClasses.join(" ")}>
      <input
        type="checkbox"
        onChange={ontoggleChange}
        checked={isActive}
      />
      <div />
    </label>
  );
};

export default RuleSwitch;
