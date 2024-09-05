import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) {
            // Handle token expiration
            useAuthStore.getState().logout();
            // Redirect to login page or show a notification
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;