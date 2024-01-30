import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Button from "./../../../UI/Button/Button";

import classes from "./TemperatureControl.module.scss";

const TemperatureControl = (props) => {
  const {
    controlId,
    name,
    unit,
    value,
    min,
    max,
    onUpdateValue
  } = props;

  const onIncreaseTemperatureHandler = () => {
    if (max === value) return null;
    onUpdateValue(controlId, value + 1);
  };

  const onDecreaseTemperatureHandler = () => {
    if (min === value) return null;
    onUpdateValue(controlId, value - 1);
  };

  if (!value || !unit) return null;

  return (
    <div className={classes.TemperatureControl}>
      <div className={classes.MinusBtn}>
        <Button
          onClick={onDecreaseTemperatureHandler}
          data-test="decrease-temperature-btn"
        >
          <FontAwesomeIcon icon={faMinus} />
        </Button>
      </div>
      <div className={classes.Temperature} data-test="temperature">
        <div>
          {value} °{unit.toUpperCase()}
        </div>
      </div>
      <div className={classes.PlusBtn}>
        <Button
          onClick={onIncreaseTemperatureHandler}
          data-test="increase-temperature-btn"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
    </div>
  );
};

TemperatureControl.propTypes = {
  controlId: PropTypes.string,
  name: PropTypes.string,
  unit: PropTypes.string,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  onUpdateValue: PropTypes.func,
};

export default TemperatureControl;
