import React from "react";
import styled from "styled-components";
import { ModeControl } from "./ModeControl";
import { Temperature } from "./Temperature";


export const AcControls = ({ temperature, onChangeValue, acState }) => {
  return (
    <>
      <Temperature
        temperature={temperature}
        onChangeValue={onChangeValue}
        acState={acState}
      />
      <ModeControl acState={acState}/>
    </>
  );
};
