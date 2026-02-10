# GateWire JavaScript SDK

The official universal JavaScript library for [GateWire](https://gatewire.raystate.com).

Works in **Node.js** (Backend) and modern **Frontend Frameworks** (via Proxy).

Features
-   🌍 Universal: Works in Browser (via CDN) and Node.js (Backend).

-   ⚡ Zero Dependencies: Extremely lightweight (< 2KB).

-   🔒 Secure: Uses native fetch API and TLS 1.3.

## Installation

### Option 1: Browser (CDN)
The fastest way to get started. Just add this script tag to your HTML <body>.

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/gatewire-js@main/gatewire.js"></script>
```

### Option 2: Direct Download

1.  Download gatewire.js.

2.  Place it in your project folder.

3.  Include it: <script src="js/gatewire.js"></script>.

### Option 3: Node.js (Backend)
Download the file and require it directly.

```javascript
const GateWire = require('./gatewire.js');
```

## Quick Start

### 1. Browser Usage (HTML)
***⚠️ SECURITY WARNING: Using your API Key in frontend HTML code exposes it to the public. Only use this method for internal tools, prototypes, or intranets where you trust the users. For public websites, use the Node.js method below.***

```html
<!DOCTYPE html>
<html>
<body>
    <button onclick="sendSMS()">Send Test SMS</button>

    <script src="https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/gatewire-js@main/gatewire.js"></script>

    <script>
        // Initialize
        const gw = new GateWire('sk_live_YOUR_API_KEY');

        async function sendSMS() {
            try {
                const response = await gw.dispatch({
                    phone: '+213555123456',
                    message: 'Hello from GateWire JS!',
                    priority: true // Optional: Use high-speed route
                });
                
                alert('SMS Sent! Ref ID: ' + response.reference_id);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    </script>
</body>
</html>
```

### 2. Node.js Usage (Backend)
This is the secure way to use GateWire. Your API key remains hidden on the server.

```javascript
const GateWire = require('./gatewire.js');

// Initialize with Environment Variable
const gw = new GateWire(process.env.GATEWIRE_API_KEY);

// Send SMS
gw.dispatch({
    phone: '+213555123456',
    template: 'login_otp', // Use a template key defined in your dashboard
    priority: true
}).then(response => {
    console.log('Queued:', response.reference_id);
}).catch(err => {
    console.error('Failed:', err.message);
});
```

---

## API Reference

`new GateWire(apiKey, [baseUrl])`  
Initializes the client.

*   `apiKey`: Your secret key starting with sk_live_.

*   `baseUrl`: (Optional) Defaults to https://gatewire.raystate.com/api/v1.

`gw.dispatch(options)`
Sends an SMS message. Returns a Promise.

*   `options` (Object):

*   `phone` (String): Recipient number (e.g., `+213...`).

*   `message` (String): The text body (optional if using template).

*   `template` (String): The Template Key (optional).

*   `priority` (Boolean): Set `true` to skip the queue (costs more).

`gw.getBalance()`
Returns your current wallet balance and currency.

## Security Best Practices
1.  **Never commit your API Key** to GitHub. Use `.env` files.

2.  If using the **Browser/CDN** method on a public site, anyone can "View Source" and steal your key to send spam.

    *   Solution: Build a tiny backend proxy (PHP/Node/Python) that holds the key, and have your frontend call that proxy instead.

## License
The GateWire JS package is open-sourced software licensed under the MIT license.