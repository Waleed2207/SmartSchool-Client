import styled,{css} from "styled-components";

export const Circle = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin: 0 auto;
`;

export const ActiveCellStyled = styled.td`
  width: 3px;
  align-items: center;
  justify-content: center;
  // border-bottom: 1px solid #ccc;
  padding: 1rem ;
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  width: 135px;
  margin-inline: 1rem;
  justify-content: space-between;
`;

export const ActionTdStyled = styled.td`
  width: 400px;
`;
export const RuleCell = styled.td`
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
padding: 15px;
`;


// Assuming TrStyled is the component throwing the error
export const TrStyled = styled.tr`
  ${props => props.isSelected && css`
    background-color: lightblue; // Example of changing background if selected
    // Add any other styles that depend on being selected
  `}
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;


export const RuleInput = styled.input`
  display: ${(props) => (props.editing ? "block" : "none")};
  width: 80%;
  height: 30px;
  border-radius: 30px;
  border-style: solid;
  padding-left: 30px;
`;

export const RuleText = styled.div`
  display: ${(props) => (props.editing ? "none" : "block")};
`;

export const SearchRuleInput = styled.input`
  padding-left: 30px;
`;