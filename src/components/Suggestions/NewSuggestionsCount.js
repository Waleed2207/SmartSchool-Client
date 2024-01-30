import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getSuggestions } from "./suggestions.service";

export const NotificationContainer = styled.div`
  background-color: red;
  border-radius: 30px;
  width: 15px;
  height: 15px;
  align-items: center;
  justify-content: center;
  color: white;
  // padding: auto;
  display: flex;
  font-size: 10px;
  position: relative;
  top: -5px;
  // left: 110px;
  right: 5px;
`;

export const NewSuggestionsCount = ({ value }) => {

  return (
    <>{value > 0 && <NotificationContainer>{value}</NotificationContainer>}</>
  );
};
