import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';
import styled from "styled-components";
import { SERVER_URL } from "../../consts";

const SelectorContainer = styled.div`
    margin: auto;
    margin-bottom: 10px;
    align-items: center;
    width: 100%; // Ensure full width
`;

const Label = styled.label`
    margin-bottom: 5px;
    display: block; // Ensure the label is above the select box
`;

const NewDeviceModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const NameInput = styled.input`
  width: 80%;
  height: 30px;
  text-align: center;
  border-radius: 30px;
  border: solid 1px #ccc;
  padding: 5px;
`;

const ModalButtonsContainer = styled.div`
  margin-top: 60px;
  display: flex;
  gap: 10px;
`;

const ButtonStyledNew = styled.div`
  background-color: #f6f7ff;
  color: #3B5998;
  align-items: center;
  justify-content: center;
  border: 1px solid #d8deea;
  min-width: 65px;
  min-height: 30px;
  padding: 0 0.7rem;
  border-radius: 4px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #d8deea;
    border-color: black;
  }
`;

const NameSection = ({ label, value, onChange }) => (
  <>
    {label}: <NameInput value={value} onChange={(e) => onChange(e.target.value)} />
  </>
);

export const NewSpaceModal = ({ setIsModalOpen, refreshSpaces, spaceName }) => {
  const typeOptions = [
    { value: 'SmartHome', label: 'SmartHome' },
    { value: 'SmartSchool', label: 'SmartSchool' },
    { value: 'All', label: 'All' }
  ];
  const iconOptions = [
    { value: 'school', label: 'school' },
    { value: 'home', label: 'home' },
    { value: 'other', label: 'other' }
  ];
  const [type, setType] = useState(typeOptions.find(option => option.value === spaceName));
  const [icon, setIcon] = useState(() => {
    switch (spaceName) {
      case 'SmartSchool':
        return iconOptions.find(icon => icon.value === 'school');
      case 'SmartHome':
        return iconOptions.find(icon => icon.value === 'home');
      default:
        return null;
    }
  });
  const [name, setName] = useState("");
  const [raspIp, setRaspIp] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  console.log("space"+type);
  useEffect(() => {
    const fetchData = async () => {
      const resource_id = 'b7cf8f14-64a2-4b33-8d4b-edb286fdbd37';
      const limit = 1500;
      const url = `https://data.gov.il//api/action/datastore_search?resource_id=${resource_id}&limit=${limit}`;
      console.log("Fetching data from:", url);
      try {
        const response = await axios.get(url);
        console.log("API response:", response);
        const options = response.data.result.records.map(city => ({
          label: city['שם_ישוב_לועזי'].trim(),
          value: city['שם_ישוב_לועזי'].trim()
        }));
        setCities(options);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response) {
          console.log("Error response data:", error.response.data);
        }
      }
    }      

    fetchData();
  }, []);

  const handleAdd = async () => {
    const spaceDetails = {
      type: type ? type.value : '',
      space_name: name,
      icon: icon ? icon.value : '',
      rasp_ip: raspIp,
      city: selectedCity ? selectedCity.value : ''
    };

    try {
      const response = await axios.post(`${SERVER_URL}/api-space/spaces`, { spaceDetails });
      console.log('Space added:', response.data);
      setIsModalOpen(false);
      refreshSpaces();
    } catch (error) {
      console.error('Error adding space:', error.response ? error.response.data : error);
    }
  };

  return (
    <NewDeviceModalContainer>
      <NameSection label="Name Space" value={name} onChange={setName} />
      <SelectorContainer>
        <Label>Type:</Label>
        <Select
          value={type}
          onChange={setType}
          options={typeOptions}
          placeholder="Select Type"
          isClearable
          isSearchable
        />
      </SelectorContainer>
      <SelectorContainer>
        <Label>Icon:</Label>
        <Select
          value={icon}
          onChange={setIcon}
          options={iconOptions}
          placeholder="Select Icon"
          isClearable
          isSearchable
        />
      </SelectorContainer>
      <SelectorContainer>
        <Label>City:</Label>
        <Select
          value={selectedCity}
          onChange={option => setSelectedCity(option)}
          options={cities}
          placeholder="Select City"
          isClearable
          isSearchable
        />
      </SelectorContainer>
      <NameSection label="Raspberry Pi IP" value={raspIp} onChange={setRaspIp} />
      <ModalButtonsContainer>
        <ButtonStyledNew onClick={handleAdd}>Add</ButtonStyledNew>
        <ButtonStyledNew onClick={() => setIsModalOpen(false)}>Close</ButtonStyledNew>
      </ModalButtonsContainer>
    </NewDeviceModalContainer>
  );
};

export default NewSpaceModal;
