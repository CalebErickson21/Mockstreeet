// Import dependencies
const client = require('./db.js');
const express = require('express');
const session = require('express-session');
const cors = require('cors'); // Cross-origin resource sharing
//const fetch = require('node-fetch'); // Fetch API
const bcrypt = require('bcrypt'); // Password hashing
require('dotenv').config();

// Import express app and middleware
const app = express();
app.use(express.json());

// Define port
const PORT = 5000;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Adjust for production
    credentials: true
}))

// Configure sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }  // 1-hour session
}));

// Login route
app.post('/login', async (req, res) => {
    const { userNameOrEmail, password } = req.body;

    try {
        // Query database for user
        const result = await client.query('SELECT * FROM users WHERE username = $1 OR email = $1', [userNameOrEmail]);
        // User not found
        if (result.rows.length === 0) {
            return res.status(401).json({success: false, message: 'Invalid username or email'})
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Incorrect password'});
        }

        req.session.user = { id: user.id, username: user.username, email: user.email };
        console.log("Login successful");
        res.status(200).json({success: true, user: req.session.user});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: 'Internal server error'});
    }

});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// Check authentication route
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false });
    }
})

// Register route
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, passwordConfirmation } = req.body;

    // Ensure all fields are provided
    if (!firstName || !lastName || !email || !username || !password || !passwordConfirmation) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check length of fields
        if (firstName.length > 25 || lastName.length > 25 || username.length > 25 || password > 25) {
            return res.status(400).json({ success: false, message: 'First name, last name, username, and password must be less than 25 characters' });
        }
        if (email.length > 50) {
            return res.status(400).json({ success: false, message: 'Email must be less than 50 characters' });
        }

        // Check if password matches confirmation
        if (password !== passwordConfirmation) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        // Check if username or email already exists
        const existsResult = await client.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existsResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const insertQuery = 'INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const insertResult = await client.query(insertQuery, [firstName, lastName, email, username, hashedPassword]);

        res.status(201).json({ success: true, user: insertResult.rows[0], message: 'Registered successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Portfolio route
app.get('/portfolio', async (req, res) => {
    const { portfolio_id } = req.query;

    if (req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

});

// Transactions Route


// Market Route

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});