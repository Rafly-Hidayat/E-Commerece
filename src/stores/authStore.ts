import { create } from 'zustand'
import axios from 'axios'

interface AuthState {
    isAuthenticated: boolean;
    user: { username: string; email: string } | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    initialize: () => void;
}

const API_BASE_URL = 'http://localhost:3000';

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    login: async (username: string, password: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password
            });
            const { token, email } = response.data;
            set({ isAuthenticated: true, user: { username, email }, token });
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ username, email }));
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },
    logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    initialize: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            set({ isAuthenticated: true, token, user: JSON.parse(user) });
        }
    },
}));