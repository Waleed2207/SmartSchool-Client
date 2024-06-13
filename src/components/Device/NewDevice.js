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
  
  @media (max-width: 768px) { /* Tablet view */
  width: 18rem;
  min-width: 18rem
  min-height: 6rem;
  height: 6rem;
}

  @media (max-width: 480px) { /* Mobile view */
  width: 16rem;
  min-width: 16rem;
    min-height: 6rem;
    height: 6rem;

  }

`;

export const NewDevice = ({setIsModalOpen}) => {
  return (
    <NewDeviceCard onClick={() => setIsModalOpen(true)}>
        <FontAwesomeIcon icon={faPlus} color='grey' size='3x'/>
    </NewDeviceCard>
  )
}
