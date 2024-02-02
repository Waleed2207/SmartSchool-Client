import React, { useState, useEffect } from "react";
import {
  AcControlsSection,
  TemperatureButton,
  TemperatureContainer,
  TemperatureValue,
} from "./controls.style";

export const Temperature = ({ temperature, onChangeValue, acState }) => {
  const [value, setValue] = useState(temperature);

  useEffect(() => {
    setValue(temperature);
  }, [temperature]);

  const onIncrease = () => {
    setValue((prevValue) => {
      const newValue = prevValue + 1;
      onChangeValue(newValue);
      return newValue;
    });
  };

  const onDecrease = () => {
    setValue((prevValue) => {
      const newValue = prevValue - 1;
      onChangeValue(newValue);
      return newValue;
    });
  };

  return (
    <AcControlsSection>
      <TemperatureContainer>
        <TemperatureButton onClick={onDecrease}>-</TemperatureButton>
        <TemperatureValue>
          <p>°{value}</p>
        </TemperatureValue>
        <TemperatureButton onClick={onIncrease}>+</TemperatureButton>
      </TemperatureContainer>
    </AcControlsSection>
  );
};
