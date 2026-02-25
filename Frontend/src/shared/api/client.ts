import axios from 'axios';
import { API_BASE_URL } from './endpoints';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

export default apiClient;