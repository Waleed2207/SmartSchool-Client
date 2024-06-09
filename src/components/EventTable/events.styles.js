import styled from "styled-components";

export const TableStyled = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const ThStyled = styled.th`
  background-color: #f8f8f8;
  color: #333;
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

export const TdStyled = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

export const TitleStyled = styled.h2`
  margin: 0;
  padding: 16px;
  text-align: left;
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const TrStyled = styled.tr`
  background-color: ${({ isSelected }) => (isSelected ? "#f1f1f1" : "transparent")};
  &:hover {
    background-color: #f9f9f9;
  }
`;

export const SearchEventInput = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;