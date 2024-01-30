export const ADD_RULE = 'ADD_RULE';

export const addRule = (rule) => {
  return {
    type: ADD_RULE,
    payload: rule
  };
};
