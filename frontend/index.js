const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/health', async (req, res) => {
    try {
        await axios.get(`${BACKEND_URL}/health`, { timeout: 2000 });
        res.json({ status: 'online' });
    } catch (error) {
        res.json({ status: 'offline' });
    }
});

app.post('/admission', async (req, res) => {
    try {
        const { name, grade } = req.body;
        console.log(`Forwarding admission request for ${name} to backend...`);

        const response = await axios.post(`${BACKEND_URL}/admission`, { name, grade });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error forwarding request to backend:', error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data : { message: 'Internal Server Error' };
        res.status(status).json(message);
    }
});

app.listen(PORT, () => {
    console.log(`Frontend server running at http://localhost:${PORT}`);
});
