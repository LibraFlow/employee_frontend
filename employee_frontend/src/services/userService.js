import axios from 'axios';

const API_URL = 'http://localhost:3000/userservice/api/v1/users';

const userService = {
    getCurrentUser: async () => {
        try {
            const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return null;
        }
    },
    updateUser: async (id, userDto) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, userDto, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
        } catch (error) {
            throw error;
        }
    },
    exportUserData: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}/data-portability`, { withCredentials: true, responseType: 'blob' });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default userService; 