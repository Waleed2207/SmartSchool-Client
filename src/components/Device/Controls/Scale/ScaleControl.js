import React from "react";
import PropTypes from "prop-types";

import classes from "./ScaleControl.module.scss";

const ScaleControl = (props) => {
  const { controlId, name, type, value, min, max, step, onUpdateValue } = props;

  const onChangeScaleHandler = (event) => {
    const updatedValue = event.target.value;
    if (updatedValue !== value) {
      onUpdateValue(controlId, parseInt(updatedValue));
    }
  };

  return (
    <div className={classes.RangeContainer}>
      <div className={classes.CurrentValue} data-test="current-value">
        {value}
      </div>
      <input
        className={classes.Range}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChangeScaleHandler}
      />
    </div>
  );
};

ScaleControl.propTypes = {
  controlId: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onUpdateValue: PropTypes.func,
};

export default ScaleControl;
