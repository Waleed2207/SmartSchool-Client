import React, { createContext, useContext, useState, useEffect } from 'react';

const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
  const [spaceId, setSpaceIdInternal] = useState(null);

  // Load spaceId from Local Storage when the component mounts
  useEffect(() => {
    const savedSpaceId = localStorage.getItem('spaceId');
    if (savedSpaceId) {
      setSpaceIdInternal(savedSpaceId);
    }
  }, []);

  // Update Local Storage whenever spaceId changes
  const setSpaceId = (id) => {
    localStorage.setItem('spaceId', id);
    setSpaceIdInternal(id);
  };

  return (
    <SpaceContext.Provider value={{ spaceId, setSpaceId }}>
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = () => useContext(SpaceContext);
