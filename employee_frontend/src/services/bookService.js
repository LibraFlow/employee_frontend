import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/bookservice/api/v1';

export const bookService = {
    getAllBooksByGenre: async (genre) => {
        try {
            console.log('Making API request to:', `${API_BASE_URL}/books?genre=${genre}`);
            const response = await axios.get(`${API_BASE_URL}/books?genre=${genre}`);
            console.log('API response:', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching books by genre:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            throw error;
        }
    },

  getAllBooks: async (genre = '') => {
    const response = await axios.get(`${API_BASE_URL}/books?genre=${genre}`);
    return response.data;
  },

  getBook: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/books/${id}`);
    return response.data;
  },

  createBook: async (book) => {
    const response = await axios.post(`${API_BASE_URL}/books`, book);
    return response.data;
  },

  updateBook: async (id, book) => {
    const response = await axios.put(`${API_BASE_URL}/books/${id}`, book);
    return response.data;
  },

  deleteBook: async (id) => {
    await axios.delete(`${API_BASE_URL}/books/${id}`);
  }
};

export default bookService; 