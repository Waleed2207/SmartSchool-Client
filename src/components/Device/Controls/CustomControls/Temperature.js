import React, { useState, useEffect } from "react";
import {
  AcControlsSection,
  TemperatureButton,
  TemperatureContainer,
  TemperatureValue,
} from "./controls.style";

export const Temperature = ({ temperature, onChangeValue, acState }) => {
  const [value, setValue] = useState(temperature);

  const onIncrease = () => {
    setValue(value + 1);
    onChangeValue(value + 1);
  };

  const onDecrease = () => {
    setValue(value - 1);
    onChangeValue(value - 1);
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
