const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// This line serves your website from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// IMPORTANT: Get the API key safely from the environment variables
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY in environment variables");
}

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

// This is your secure API endpoint
app.post('/api/gemini', async (req, res) => {
    const payload = req.body;
    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Forward the full response from Google's API to the front-end
        const data = await apiResponse.json();
        if (!apiResponse.ok) {
             console.error('Google API Error:', data);
             return res.status(apiResponse.status).json(data);
        }
        res.json(data);

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: { message: 'An internal server error occurred.' } });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});