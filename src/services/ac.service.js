import axios from 'axios';
import { SERVER_URL } from '../consts';



export const toggleAcState = async (props) => {
  console.log('----------toggleAcState----------')
  const {state, temperature} = props;
  try {
    console.log({state, temperature});
    const response = await axios.post(`${SERVER_URL}/sensibo`, { state, temperature });
    return response.data;
  } catch (error) {
    console.error('Error toggling AC state:', error);
  }
};
