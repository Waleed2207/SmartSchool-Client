// Action Types
import * as actionTypes from "./user.types";


// Action Creators
export const userLogin = (user) => {
  return {
    type: actionTypes.USER_LOGIN,
    payload: user,
  };
};

export const userLogout = () => {
  return {
    type: actionTypes.USER_LOGOUT,
  };
};

// Action creator for setting the user
export const setUser = (user) => ({
  type: actionTypes.SET_USER,
  payload: user,
});
