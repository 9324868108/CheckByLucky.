import config from '../config.js';

class APIService {
    constructor() {
        this.baseURL = config.API_BASE_URL;
        this.headers = {
            'X-RapidAPI-Key': config.API_KEY,
            'X-RapidAPI-Host': 'indian-railway-irctc.p.rapidapi.com'
        };
    }

    async getTrainStatus(trainNumber) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT);

        try {
            const response = await fetch(`${this.baseURL}/train-status?trainNo=${trainNumber}`, {
                method: 'GET',
                headers: this.headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(this.handleErrorResponse(response.status));
            }

            const data = await response.json();
            
            // Transform the API response to match our expected format
            return {
                status: data.status ? "success" : "error",
                train_name: data.trainName || data.train_name,
                train_number: data.trainNo || data.train_number,
                current_location: data.currentLocation || "Location not available"
            };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            throw error;
        }
    }

    handleErrorResponse(status) {
        const errorMessages = {
            400: 'Invalid train number format',
            401: 'Unauthorized access. Please check API key',
            403: 'Access forbidden',
            404: 'Train not found',
            429: 'Too many requests. Please try again later',
            500: 'Server error. Please try again later',
            503: 'Service temporarily unavailable'
        };

        return errorMessages[status] || 'An unexpected error occurred';
    }
}

export default new APIService();
