const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 5002;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Replace 'YOUR_OPENAI_API_KEY' with your OpenAI API key
const OPENAI_API_KEY = 'key';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/completions';

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    try {
        const response = await axios.post(OPENAI_ENDPOINT, {
            prompt: question,
            max_tokens: 50,
            temperature: 0.7,
            stop: '\n',
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        res.json({ answer: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
