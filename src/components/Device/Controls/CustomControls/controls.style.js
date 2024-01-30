import styled from "styled-components";




export const AcControlsSection = styled.div`
display: flex;
flex-direction: column;
`;


export const TemperatureContainer = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 1rem;
`;

export const TemperatureButton = styled.button`
background-color: white;
//   border: none;
padding: 0.5rem 1rem;
font-size: 14px;
cursor: pointer;
border-radius: 4px;
transition: background-color 0.3s ease;
border: 1px solid;
border-color: #f2f2f2;

&:hover {
  background-color: #e6e6e6;
}
`;

export const TemperatureValue = styled.span`
font-size: 18px;
//   font-weight: bold;
`;


export const LaundryControlsContainer = styled.div`
display: flex;
justify-content: space-around;
margin-top: 3rem;
width: 30rem;
`;

export const RinseContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 1rem;
`;

export const LaundryTemperatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1 1rem;
`;

export const LaundrySpinContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start-flex;
    margin-left: 1rem;
`;

export const SelectContainer = styled.div`
    margin-left: 10px;
`;