import React, { forwardRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ButtonStyled } from "./suggestions.styles";

export const RuleModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  //   margin-top: 40px;
  padding: 3rem;
`;

export const ModalButtonsContainer = styled.div`
  margin-top: 60px;
  display: flex;
  gap: 10px;
`;

export const ButtonStyledNewBackup = styled.div`
  background-color: #f6f7ff;
  display: flex;
  color: "#3B5998";
  font-size: 14px;
  align-items: center;
  text-align: center;
  justify-content: center;
  border: 1px solid #d8deea !important;
  min-width: 65px;
  min-height: 30px;
  padding: 0 0.7rem;
  border-radius: 4px;
  transition: 0.3s;
  :hover {
    cursor: pointer;
    background-color: #d8deea;
    border-color: black;
    opacity: 1;
  }
  color: #3b5998;
`;

export const ButtonStyledNew = styled.div`
  background-color: #f6f7ff;
  display: flex;
  color: ${(props) => (props.disabled ? "#808080" : "#3B5998")};
  font-size: 14px;
  align-items: center;
  text-align: center;
  justify-content: center;
  border: 1px solid #d8deea !important;
  min-width: 65px;
  min-height: 30px;
  padding: 0 0.7rem;
  border-radius: 4px;
  transition: 0.3s;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  
  &:hover {
    background-color: ${(props) => (props.disabled ? "#f6f7ff" : "#d8deea")};
    border-color: ${(props) => (props.disabled ? "#d8deea" : "black")};
  }
  
  color: #3b5998;
`;

export const RuleModal = ({ selectedRule, setIsModalOpen }) => {
  const handleCopy = () => {
    const ruleText = selectedRule;
    navigator.clipboard.writeText(ruleText);
    setIsModalOpen(false);
  };

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 150);
  }, []);

  return (
    <>
      {showContent && (
        <RuleModalContainer>
          {selectedRule}
          <ModalButtonsContainer>
            <ButtonStyledNew onClick={handleCopy}>Copy</ButtonStyledNew>
            <ButtonStyledNew onClick={() => setIsModalOpen(false)}>
              Close
            </ButtonStyledNew>
          </ModalButtonsContainer>
        </RuleModalContainer>
      )}
    </>
  );
};
