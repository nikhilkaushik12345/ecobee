// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

const clientId = 'bmX64qqTAuyTRc8Z8E3jflcCii1mIrka';
const redirectUri = 'https://ecobee.onrender.com/';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to exchange auth code for token
app.post('/get-token', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided.' });
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('client_id', clientId);
  params.append('redirect_uri', redirectUri);

  try {
    const response = await fetch('https://api.ecobee.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch token', details: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

