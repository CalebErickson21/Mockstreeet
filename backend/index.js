// Import dependencies
const client = require('./db');
const express = require('express');
const session = require('express-session');
require('dotenv').config();

// Import express app and middleware
const app = express();
app.use(express.json());

// Define port
const PORT = 5000;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }  // 1-hour session
}));

// Define route
app.get('/', (req, res) => {
    res.send('Hello World from backend Node.js!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});