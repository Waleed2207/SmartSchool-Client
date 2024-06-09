// SpacesDashboard.js
import React, { useEffect, useState, useContext } from 'react';
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import _ from "lodash";
import axios from 'axios';
import Space from "../../components/Spaces/Space";
import classes from "./SpacesDashboard.module.scss";
import { SERVER_URL } from "../../consts";
import iconMapping from './../../utils/fontawesome.icons';
import { NewSpace } from '../../components/Spaces/NewSpace';
import { NewSpaceModal } from "../../components/Spaces/NewSpaceModal";
import UserContext from '../../contexts/UserContext';
import Modal from "react-modal";
import { useSpace } from './../../contexts/SpaceContext'; // Path to your SpaceContext file

const fadeIn = keyframes`
  0% {
    opacity: 0;
    width: 0;
    height: 0;
  }
  50% {
    opacity: 1;
    width: 45%;
    height: 40%;
  }
  100% {
    opacity: 1;
    width: 40%; /* Final width value */
    height: 35%; /* Final height value */
  }
`;

const SpacesSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px; // Adjusted padding, uncomment if needed
  width: 80%;
`;
const NewSpaceItem = styled.div`
  display: flex;
  justify-content: center; // Center horizontally inside the item
  // margin-top: 2rem; // Optional: adds some space above the button
  align-items: center;  
  padding : 10px; // Optional: adds some space

`;

export const ModalStyled = styled(Modal)`
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 4px;
  width: 40%;
  height: 35%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin: 1rem;
  padding: 4rem;
  overflow: auto;
  display: flex;
  justify-content: center;
  border: none;
  outline: none;

  //animation
  opacity: 0;
  width: 0;
  height: 0;
  animation: ${fadeIn} 0.3s ease-in-out forwards;
`;

const SpacesDashboard = ({ spaceId }) => {
  const [spaces, setSpaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSpaceId } = useSpace();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const spaceName = user ? user.space_name : 'Default';
  console.log("Space name: " + spaceName);

  useEffect(() => {
    getSpaces(); 
  }, [spaceName]); // Add spaceName as a dependency
  
  const getSpaces = async () => {
    try {
      let url = `${SERVER_URL}/api-space/spaces`;
      if (spaceName && spaceName !== 'All') {
        url = `${SERVER_URL}/api-space/spaces/name/${spaceName}`;
      }
      const response = await axios.get(url);
      console.log("Response status:", response.status); // Log response status
      console.log("Fetched Spaces Data:", response.data);
  
      // Extracting the data array from the response object
      const spacesData = response.data.data || response.data;
      console.log("Spaces Array:", spacesData); // Log the actual spaces array
  
      // Check if spacesData is an array; if not, wrap it in an array
      const data = Array.isArray(spacesData) ? spacesData : [spacesData];
      setSpaces(data);
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
      setSpaces([]); // Setting an empty array in case of error
    }
  };
  
  

  // const { id } = useParams();
  const onClickRoomHandler = (space_id) => {
    setSpaceId(space_id);
    navigate(`/spaces/${space_id}/rooms-dashboard`);
    // navigate(`/spaces/${space_id}/rules`); if you want to navigate to rules
  };
  

  return (
    <div className={classes.Row}>
      <SpacesSection>
          {spaces.map((space,index) => (
            <div
              data-test={`room-card-${space.space_id}`}
              key={space.space_id || index}
              className={classes.Column}
              onClick={() => onClickRoomHandler(space.space_id)}
              >
              <Space
                  id={space.space_id}
                  space_name={space.space_name}
                  type={space.type} // Assuming name is a property of the room object
                  icon={iconMapping[space.icon]} // Assuming icon is a property of the room object
                  city={space.city}
                  rasp_ip={space.rasp_ip}
              />
              </div>
          ))}
          <NewSpaceItem>
              <NewSpace setIsModalOpen={setIsModalOpen} />
          </NewSpaceItem>
          {isModalOpen &&
            <ModalStyled isOpen={isModalOpen}>
              <NewSpaceModal setIsModalOpen={setIsModalOpen}refreshSpaces={getSpaces} spaceName={spaceName}   />
            </ModalStyled>
          }
        </SpacesSection>
        <Outlet/>
    </div>
  );
};
SpacesDashboard.propTypes = {
  fetchSpace: PropTypes.func,
  spaceId: PropTypes.string,
  space: PropTypes.object,
};
export default SpacesDashboard;
