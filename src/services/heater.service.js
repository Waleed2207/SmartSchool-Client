import axios from 'axios';
import { SERVER_URL } from '../consts';


export const toggleHeaterState = async (state) => {
  console.log('----------toggleHeaterState----------')
  console.log({state})
  try {
    console.log({ state });
    const response = await axios.post(`${SERVER_URL}/heater`, { value: state });
    return response.data;
  } catch (error) {
    console.error('Error toggling heater state:', error);
  }
};
