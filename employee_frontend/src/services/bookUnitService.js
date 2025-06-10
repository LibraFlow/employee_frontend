import axios from 'axios';

const API_URL = 'http://localhost:3000/bookunitservice/api/v1/bookunits';

const bookUnitService = {
    // Get all book units for a specific book
    getBookUnitsByBookId: async (bookId) => {
        try {
            const response = await axios.get(`${API_URL}/book/${bookId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get a single book unit by ID
    getBookUnit: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create a new book unit
    createBookUnit: async (bookUnit) => {
        try {
            const response = await axios.post(API_URL, bookUnit, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update a book unit
    updateBookUnit: async (id, bookUnit) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, bookUnit, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete a book unit
    deleteBookUnit: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
        } catch (error) {
            throw error;
        }
    },

    // Get unavailable and overdue book units
    getUnavailableOverdueBookUnits: async () => {
        try {
            const response = await axios.get(`${API_URL}/unavailable-overdue`, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default bookUnitService; 