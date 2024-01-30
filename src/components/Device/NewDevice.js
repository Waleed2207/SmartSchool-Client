import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import styled from 'styled-components'


const NewDeviceCard = styled.div`
  width: 18rem;
  min-width: 18rem;
  height: 8rem;
  border: 1px solid;
  padding: 1rem;
  border-radius: 10px;
  border-color: #e4e6eb;
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;

`;

export const NewDevice = ({setIsModalOpen}) => {
  return (
    <NewDeviceCard onClick={() => setIsModalOpen(true)}>
        <FontAwesomeIcon icon={faPlus} color='grey' size='3x'/>
    </NewDeviceCard>
  )
}
