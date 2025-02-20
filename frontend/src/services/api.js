// services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = {
    checkURL: async(url) => {
        try {
            const response = await fetch(`${API_URL}/api/check-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Failed to check URL`);
        }
    }
};

export default api;