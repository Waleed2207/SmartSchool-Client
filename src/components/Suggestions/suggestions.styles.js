import styled, { keyframes } from "styled-components";
import { TABLET_WIDTH } from "../../consts";
import Modal from "react-modal";

export const TableContainer = styled.div`
  overflow-x: auto;
  display: flex;
  width: 80%;
  margin: auto;
  justify-content: center;
  padding-top: 1rem;
  flex-direction: column;
`;

export const RuleCell = styled.td`
  white-space: normal;
  word-break: break-word;
  max-width: 400px;
`;

export const TableStyled = styled.table`
  width: 100%;
  margin: auto;
  table-layout: auto;
  @media (max-width: ${TABLET_WIDTH}px) {
    width: 100%;
  }
`;

export const ThStyled = styled.th`
  padding: 0.5rem 1.5rem;
  text-align: left;
`;

export const TdStyled = styled.td`
  padding: 0.5rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #ccc;
  color: gray;
`;

export const DeviceCellContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const TitleStyled = styled.h2`
  font-size: 1.5rem;
  padding-top: 2rem;
  text-align: center;
`;

export const NewTag = styled.div`
  background-color: #ac98ff;
  width: 4rem;
  height: 1.9rem;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  right: 50px;
`;

export const NewTagText = styled.span`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  position: absolute;
  left: 0.7rem;
  top: 0.2rem;
`;

export const ButtonStyled = styled.button`
  background-color: #f6f7ff;
  color: #3B5998;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d8deea;
  min-width: 65px;
  min-height: 30px;
  padding: 0 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  margin-right: 4px;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;

  &:hover {
    background-color: #d8deea;
    border-color: black;
    color: white;
  }

  @media (max-width: ${TABLET_WIDTH}px) {
    font-size: 12px;
    min-width: 30px;
    min-height: 25px;
    padding: 0 0.5rem;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const ModalStyled = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  width: auto; // Allows the modal to size based on its content
  max-width: 600px; // Limits the maximum width to ensure it fits on screen
  overflow: hidden; // Prevents content from spilling out of the modal

  @media (max-width: ${TABLET_WIDTH}px) {
    width: 90%; // Modal takes more screen space on smaller screens
    overflow-y: auto; // Allows scrolling for longer content on small screens
  }
`;

const ChooseRoomModalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const ChooseRoomModalStyled = styled(ModalStyled)`
  animation: ${ChooseRoomModalFadeIn} 0.3s ease-in-out forwards;
`;

const RuleModalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const RuleModalStyled = styled(ModalStyled)`
  animation: ${RuleModalFadeIn} 0.3s ease-in-out forwards;
`;

