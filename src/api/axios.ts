import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export default axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-type': 'application/json',
    },

});

export const axiosWithCredentials = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-type': 'application/json',
    },
    withCredentials: true,
})