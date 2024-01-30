import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classes from "./ModeControl.module.scss";

const ModeControl = ({ controlId, name, value, onUpdateValue, options }) => {
  const onChangeModeHandler = (event) => {
    const updatedValue = event.target.value;
    if (updatedValue !== value) {
      onUpdateValue(controlId, updatedValue);
    }
  };

  if (!options) return null;

  const optionsList = Object.entries(options).map(([openKey, option]) => {
    const isChecked = value === openKey;
    const radioId = `${controlId}-${openKey}`;

    return (
      <div className={classes.ModeControl} key={openKey}>
        <input
          type="radio"
          id={radioId}
          value={openKey}
          className={classes.Radio}
          checked={isChecked}
          onChange={onChangeModeHandler}
        />
        <label htmlFor={radioId} className={classes.Label}>
          {option.icon ? (
            <FontAwesomeIcon
              icon={{ prefix: "fa", iconName: option.icon }}
              className={classes.Icon}
            />
          ) : (
            <span className={classes.OptionText}>{option.name}</span>
          )}
        </label>
      </div>
    );
  });

  return <div className={classes.ModeControlContainer}>{optionsList}</div>;
};

ModeControl.propTypes = {
  controlId: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onUpdateValue: PropTypes.func,
  options: PropTypes.object,
};

export default ModeControl;
