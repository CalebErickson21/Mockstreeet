// Import dependencies
const client = require('./db.js');
const express = require('express');
const session = require('express-session');
const cors = require('cors'); // Cross-origin resource sharing
//const bcrypt = require('bcrypt'); // Password hashing
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
        //const passwordMatch = await bcrypt.compare(password, user.password);
        const passwordMatch = password === 'test';

        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Incorrect password'});
        }

        req.session.user = { id: user.id, username: user.username, email: user.email };
        console.log("Login successful");
        res.json({success: true, user: req.session.user});
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


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});