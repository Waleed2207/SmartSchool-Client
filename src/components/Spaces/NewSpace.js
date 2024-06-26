import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import styled from 'styled-components'


const NewSpaceCard = styled.div`
  width: 16rem;
  min-width: 16rem;
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

export const NewSpace = ({setIsModalOpen}) => {
  return (
    <NewSpaceCard onClick={() => setIsModalOpen(true)}>
        <FontAwesomeIcon icon={faPlus} color='grey' size='3x'/>
    </NewSpaceCard>
  )
}
