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
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 1.5rem;
`;

export const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ActionTdStyled = styled.td`
  width: 130px;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 1.5rem;
`;

export const RuleCell = styled.td`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 1.5rem;
`;

export const TrStyled = styled.tr`
  border-bottom: 1px solid #ccc;
  height: 30px;
  ${({ isSelected, isSearched, classes }) => {
    return isSelected ? css`
      background-color: ${classes.selected};
      color: lightgrey;
    ` : isSearched ? css`
      background-color: ${classes.searched};
    ` : '';
  }}
  color: ${({ isStrict }) => (isStrict ? "red" : "inherit")};

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
