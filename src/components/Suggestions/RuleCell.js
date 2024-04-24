import { Button, Tooltip } from "@mui/material";
import React, { useRef, useState, forwardRef } from "react";
import styled from "styled-components";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

// Styled components remain the same
const RuleCellStyled = styled.div`
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-direction: row;
  display: inline-flex;
  cursor: pointer;
`;

const TextStyled = styled.div`
  max-width: 320px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;

const TooltipContent = styled.div`
  font-size: 10px;
  background-color: white;
`;

const RuleTooltip = ({ text }) => {
  return <TooltipContent>{text}</TooltipContent>;
};

export const RuleCell = forwardRef(({ children, onClick }, ref) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const divRef = useRef(null);

  const handleCopy = () => {
    console.log({children});
    const divText = divRef.current.innerText;
    navigator.clipboard.writeText(divText);
    setIsTooltipOpen(true);
    setTimeout(() => setIsTooltipOpen(false), 1000);
  };

  return (
    <RuleCellStyled onClick={() => onClick(children)} sx={{
      backgroundColor: '#333',
      color: '#fff',
      fontSize: '14px',
      padding: '8px',
    }}>
      <Tooltip title={children}>
        <TextStyled ref={divRef}>{children}</TextStyled>
      </Tooltip>
      <Tooltip title="Copied rule!" open={isTooltipOpen}>
        <div>
          <FontAwesomeIcon
            style={{ cursor: "pointer" }}
            icon={faCopy}
            onClick={handleCopy}
          />
        </div>
      </Tooltip>
    </RuleCellStyled>
  );
});