const initialState = {
    space_id: null,  // Initialize space_id as null or appropriate default
    // Other user-related state can also go here
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SPACE_ID:
        return {
          ...state,
          space_id: action.payload  // Set space_id from action payload
        };
      // Handle other user-related actions
      default:
        return state;
    }
  };
  
  export default userReducer;
  