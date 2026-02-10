class GateWire {
    constructor(apiKey, baseUrl = 'https://gatewire.raystate.com/api/v1') {
        if (!apiKey) throw new Error('GateWire: API Key is required.');
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    }

    async _request(endpoint, body) {
        const url = `${this.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: body ? 'POST' : 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || `HTTP Error ${response.status}`);
            }

            return data;
        } catch (error) {
            throw new Error(`GateWire Error: ${error.message}`);
        }
    }

    /**
     * Send an SMS
     * @param {string} phone - e.g. "+213555000000"
     * @param {string} [message] - Message body
     * @param {string} [template] - Template Key
     * @param {boolean} [priority] - Force high priority
     */
    async dispatch({ phone, message, template, priority = false }) {
        const payload = {
            phone,
            message,
            template_key: template,
            priority: priority ? 'high' : undefined
        };

        // Clean undefined values
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        return this._request('/dispatch', payload);
    }

    async getBalance() {
        return this._request('/balance');
    }
}

// Export for Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GateWire;
}
// Export for Browser (Window)
else if (typeof window !== 'undefined') {
    window.GateWire = GateWire;
}