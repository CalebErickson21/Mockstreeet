// Import dependencies
import db from './db.js'; // Connect to database
import express from 'express'; // Routes and middleware
import session from 'express-session'; // User sessions
import cors from 'cors'; // Cross-origin resource sharing
import fetch from 'node-fetch'; // Fetch API used to pull Yahoo finance data
import bcrypt from 'bcrypt'; // Password hashing
import dotenv from 'dotenv'; // Environment variables

const app = express(); // Create express app instance
app.use(express.json()); // express.json enables parsing of json files
dotenv.config(); // Load environment variables

// Define port
const PORT = 5000;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Frontend - Adjust for production
    credentials: true // Ensures cookies are sent
}))

// Configure sessions
app.use(session({
    secret: process.env.SESSION_SECRET, // Sign and encrypt session data
    resave: false, // Prevents unnecessary session saving
    saveUninitialized: false, // Do not save empty sessions (user visits but does not log in)
    cookie: { 
        secure: false, // Cookies sent over HTTPS only - Adjust for production
        httpOnly: true, // Prevents javascript from accessing cookies
        maxAge: 1000 * 60 * 60 // 1 hour session
    }
}));

// Logger function
const log = (level, module, message, data = null) => {
    const timeStamp = new Date().toISOString();
    console[level](`[${level.toUpperCase()}] [${timeStamp}] [${module}] - [${message}]`, data || '');
}

// Login route
app.post('/login', async (req, res) => {
    const { userNameOrEmail, password } = req.body; // Extracts username/email and password from request

    try {
        // Query database for user
        const result = await db.query('SELECT * FROM users WHERE username = $1 OR email = $1', [userNameOrEmail]);
        
        // User not found
        if (result.rows.length === 0) {
            return res.status(401).json({success: false, message: 'Invalid username or email'}); // Return 401 (unauthorized)
        }

        // User found
        const user = result.rows[0];
        
        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Incorrect password'}); // Return 401 (unauthorized)
        }

        // Successful login
        req.session.user = { id: user.id, username: user.username, email: user.email }; // Store user data for session
        log('info', 'login', 'User logged in', req.session.user); // Log information
        res.status(200).json({success: true, user: req.session.user}); // Return successful login to frontend (200 is success)
    }
    catch (err) {
        log('error', 'login', 'Error when loggin in'); // Log error
        res.status(500).json({success: false, message: 'Internal server error'}); // Return 500 (internal server error)
    }

});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => { // Log user out
        log('info', 'logout', 'User logged out'); // Log information
        res.status(200).json({ success: true, message: 'User logged out' }); // Return logout success to frontend (200 is success)
    });
});

// Check authentication route
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        log('info', 'check-auth', 'Currently logged in', req.session.user);
        res.json({ success: true, user: req.session.user });
    } else {
        log('info', 'check-auth', 'Currently logged out');
        res.json({ success: false });
    }
})

// Register route
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, passwordConfirmation } = req.body; // Extract user details from request

    // Ensure all fields are provided
    if (!firstName || !lastName || !email || !username || !password || !passwordConfirmation) {
        return res.status(400).json({ success: false, message: 'All fields are required' }); // User error (400)
    }

    try {
        // Check length of fields
        if (firstName.length > 25 || lastName.length > 25 || username.length > 25 || password > 25) {
            return res.status(400).json({ success: false, message: 'First name, last name, username, and password must be less than 25 characters' }); // User error (400)
        }
        if (email.length > 50) {
            return res.status(400).json({ success: false, message: 'Email must be less than 50 characters' }); // User error (400)
        }

        // Check if password matches confirmation
        if (password !== passwordConfirmation) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' }); // User error (400)
        }

        // Check if username or email already exists
        const existsResult = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existsResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' }); // User error (400)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const insertQuery = 'INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const insertResult = await db.query(insertQuery, [firstName, lastName, email, username, hashedPassword]);

        // Successful registration
        log('info', 'register', 'User registered successfully', {firstName, lastName}); // Log successful registration
        res.status(201).json({ success: true, user: insertResult.rows[0].username, message: 'Registered successfully' }); // Successful register (201 = created)
    }
    catch (err) {
        log('error', 'register', 'Internal server error'); // Log error
        res.status(500).json({ success: false, message: 'Internal server error' }); // 500 status code to frontend (internal server error)
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
app.get('/transactions', async (req, res) => {

})

// Market Route
app.get('/market'), async (req, res) => {

}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});