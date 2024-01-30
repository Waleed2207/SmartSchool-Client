import axios from 'axios';
import { SERVER_URL } from "../consts";

const controlPump = async (state, duration) => {
    try {
        const response = await axios.post(`${SERVER_URL}/pump`, { state, duration });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export default {
    controlPump,
};
