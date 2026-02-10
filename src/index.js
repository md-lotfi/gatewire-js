import axios from 'axios';

class GateWire {
    /**
     * Initialize the GateWire Client
     * @param {string} apiKey - Your API Key (starts with sk_live_)
     * @param {string} [baseUrl] - Optional custom URL for testing
     */
    constructor(apiKey, baseUrl = 'https://gatewire.raystate.com/api/v1') {
        if (!apiKey) throw new Error('GateWire Error: API Key is required.');

        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 10000 // 10 seconds
        });
    }

    /**
     * Send an SMS
     * @param {Object} options
     * @param {string} options.phone - Recipient number (e.g., "+213555000000")
     * @param {string} [options.message] - Text content (optional if using template)
     * @param {string} [options.template] - Template Key (optional)
     * @param {boolean} [options.priority] - Force high priority route
     */
    async dispatch({ phone, message, template, priority = false }) {
        try {
            const payload = {
                phone,
                message,
                template_key: template,
                priority: priority ? 'high' : undefined
            };

            // Remove undefined keys to keep payload clean
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            const response = await this.client.post('/dispatch', payload);
            return response.data;

        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Get Wallet Balance
     * @returns {Promise<{balance: number, currency: string}>}
     */
    async getBalance() {
        try {
            const response = await this.client.get('/balance');
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Internal Error Handler
     * Normalize axios errors into readable messages
     */
    _handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const apiMessage = error.response.data.message || error.response.data.error;
            throw new Error(`GateWire API Error (${error.response.status}): ${apiMessage}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('GateWire Network Error: No response received from server.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`GateWire SDK Error: ${error.message}`);
        }
    }
}

export default GateWire;