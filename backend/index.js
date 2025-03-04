// Import dependencies
import db from './db.js'; // Connect to database
import express from 'express'; // Routes and middleware
import session from 'express-session'; // User sessions
import cors from 'cors'; // Cross-origin resource sharing
import yahooFinance from 'yahoo-finance2'; // Yahoo finance stock fetching
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

/** Title Case Helper
 * 
 * @param {*} str 
 * @returns Title case version of string
 */
const toTitleCase = (str) => {
    return str.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Logger helper function
 * 
 * @param {*} level 
 * @param {*} module 
 * @param {*} message 
 * @param {*} data 
 */
const log = (level, module, message, data = null) => {
    const timeStamp = new Date().toISOString();
    console[level](`[${level.toUpperCase()}] [${timeStamp}] [${module}] - [${message}]`, data || '');
}

/** User Authorization Helper
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Error if user not logged in
 */
const checkAuthHelper = ( req, res, next ) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, user: null, message: 'User not authenticated' });
    }

    next();
}

/** Check User Authorization Route that can be directly called by frontend
 */
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        log('info', 'check-auth', 'User is authenticated', { user: req.session.user.user_id });
        return res.status(200).json({ success: true, user: req.session.user.username, message: 'User is authenticated' });
    } else {
        log('info', 'check-auth', 'User not authenticated');
        return res.status(200).json({ success: false, user: null, message: 'User is not authenticated' }); // Still successful because users can be on homepage and not be authenticated
    }
});

/** Login route
 * If user found in database, login
 * If user not found in database, return error
 */
app.post('/login', async (req, res) => {
    const { userNameOrEmail, password } = req.body; // Extracts username/email and password from request

    try {
        // Query database for user
        const result = await db.query('SELECT * FROM users WHERE username = $1 OR email = $1;', [userNameOrEmail]);
        
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
        req.session.user = { user_id: user.user_id, username: user.username, email: user.email }; // Store user data for session
        log('info', 'login', 'User logged in', req.session.user.user_id); // Log information
        return res.status(200).json({success: true, user: req.session.user.username}); // Return successful login to frontend (200 is success)
    }
    catch (err) {
        log('error', 'login', 'Error when loggin in'); // Log error
        return res.status(500).json({success: false, message: 'Internal server error'}); // Return 500 (internal server error)
    }

});

/** Logout route
 * Logout user
 */
app.get('/logout', (req, res) => {
    req.session.destroy(() => { // Log user out
        log('info', 'logout', 'User logged out'); // Log information
        return res.status(200).json({ success: true, message: 'User logged out' }); // Return logout success to frontend (200 is success)
    });
});

/** Registration route
 * Register user, then redirect to login page
 */
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, passwordConfirmation } = req.body; // Extract user details from request

    // Ensure all fields are provided
    if (!firstName || !lastName || !email || !username || !password || !passwordConfirmation) {
        return res.status(400).json({ success: false, message: 'All fields are required' }); // User error (400)
    }

    try {
        // Check length of fields
        if (firstName.length > 25 || lastName.length > 25 || username.length > 25 || password.length > 25) {
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
        const existsResult = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2;', [username, email]);
        if (existsResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' }); // User error (400)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const registerQuery = 'INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
        const registerResult = await db.query(registerQuery, [firstName, lastName, email, username, hashedPassword]);
        const userId = registerResult.rows[0].user_id;

        // Create default portfolio for user
        const portfolioQuery = 'INSERT INTO portfolios (user_id, portfolio_name) VALUES ($1, $2);';
        await db.query(portfolioQuery, [ userId , 'All' ]);

        // Successful registration
        log('info', 'register', 'User registered successfully', {firstName, lastName}); // Log successful registration
        const dataRes = {username: username, email: email}; // Do not return all data in databse - some is sensitive
        return res.status(201).json({ success: true, user: dataRes, message: 'Registered successfully' }); // Successful register (201 = created)
    }
    catch (err) {
        log('error', 'register', 'Internal server error'); // Log error
        return res.status(500).json({ success: false, message: 'Internal server error' }); // 500 status code to frontend (internal server error)
    }
});

/** Portfolio/names route
 * Get a list of all of a user's portfolios
 */
app.get('/portfolio/names', checkAuthHelper, async (req, res) => {

    try {
        const { rows: portfolioQuery } = await db.query('SELECT portfolio_name FROM portfolios WHERE user_id = $1;', [ req.session.user.user_id ]);
        
        // User has no default portfolio
        if (portfolioQuery.length === 0) {
            log('error', 'portfolio/names', 'User does not have any portfolios, including default', `user:  ${req.session.user.user_id}`);
            return res.status(404).json({ success: false, portfolioNames: []});
        }
        
        const portfolioNames = portfolioQuery.map(p => p.portfolio_name);
        log('info', 'portfolio/names', 'Porfolio names returned successfully', { user: req.session.user.user_id, portfolios: portfolioNames});
        return res.status(200).json({ success: true, portfolioNames: portfolioNames});
    }
    catch (err) {
        log('error', 'portfolio/names', 'Internal server error', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/** Porfolio/stocks route
 * Get stock data for a certain portfolio
 */
app.get('/portfolio/stocks', checkAuthHelper, async (req, res) => {
    
    const portfolioName = toTitleCase(req.query.portfolio);

    try {
        // Error checking before query database
        if (portfolioName.length > 50 || portfolioName === 'CreateNew') {
            return res.status(400).json({ success: false, message: 'Invalid input'});
        }

        // Get portfolio
        let portfolioQuery, portfolioParams;
        if (portfolioName === 'All') { // Default portfolio is container for all stocks not in portfolio, but want to show all stocks on frontend
            portfolioQuery = 'SELECT portfolio_id FROM portfolios WHERE user_id = $1;';
            portfolioParams = [ req.session.user.user_id ];
        }
        else {
            portfolioQuery = 'SELECT portfolio_id FROM portfolios WHERE user_id = $1 AND portfolio_name = $2;';
            portfolioParams = [ req.session.user.user_id, portfolioName ];
        }

        const { rows: portfolioIds } = await db.query(portfolioQuery, portfolioParams);
        
        // If portfolio not found
        if (portfolioIds.length === 0) {
            return res.status(404).json({ success: false, message: 'Portfolio not found'});
        }

        // Get stock data given portfolio ids list
        const portfolioIdsList = portfolioIds.map(p => p.portfolio_id);
        const { rows: stocks } = await db.query('SELECT symbol, shares FROM portfolio_details WHERE portfolio_id = ANY($1);', [ portfolioIdsList ]);

        // If no stocks in portfolio
        if (stocks.length === 0) {
            log('info', 'portfolio/stocks', 'Empty portfolio', { stocks: [] });
            return res.status(200).json({ success: true, stocks: [], value: 0 });
        }

        // Fetch stock values from yahoo finance API
        let portfolioValue = 0;
        try {
            const stockSymbols = stocks.map(stock => stock.symbol);
            console.log(stockSymbols);

            // API call to yahoo finance
            const stockPrices = await yahooFinance.quote(stockSymbols, {fields: ['shortName', 'regularMarketPrice' ] });

            // Combine data
            const stockData = stocks.map(stock => {
                const stockInfo = stockPrices.find(s => s.symbol === stock.symbol);

                portfolioValue += stockInfo.regularMarketPrice.toFixed(2) * stock.shares;
                
                return {
                    company: stockInfo.shortName,
                    symbol: stock.symbol,
                    shares: stock.shares,
                    share_price: stockInfo?.regularMarketPrice.toFixed(2) || 'Error',
                    total_price: ((stockInfo?.regularMarketPrice || 0) * stock.shares).toFixed(2),
                };
            });

            // Send result
            log('info', 'portfolio/stocks', 'Stocks fetched successfully', stockData);
            return res.status(200).json({ success: true, stocks: stockData, value: portfolioValue.toFixed(2) });
        }
        catch (err) {
            // Error handling
            log('error', 'portfolio/stocks', 'Fetch Stocks failed', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error'});
        }
    }
    catch (err) {
        log('error', 'portfolio/stocks', `Internal server error: ${err.message}`);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/** Porfolio/new route
 * Create new portfolio
 */
app.post('/portfolio/new', checkAuthHelper, async (req, res) => {
    const { portfolio } = req.body;

    // Ensure field is provided
    if (!portfolio) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const portfolioName = toTitleCase(portfolio); // Consistent format

    try {
        // Error check before entering into database
        if (portfolioName === 'All') { // Default portfolio
            return res.status(400).json({ success: false, message: '"All" is an invalid portfolio name' });
        }
        if (portfolioName === 'Createnew' || portfolioName === 'Create New') { // Invalid portfolio name
            return res.status(400).json({ success: false, message: '"Create New" is an invalid portfolio name' });
        }
        if (portfolioName.length > 50) { // Length
            return res.status(400).json({ success: false, message: 'Portfolio name must be less than 50 characters' });
        }

        // Ensure another portfolio with same name doesn't exist
        const { rows: existsResult } = await db.query('SELECT portfolio_name FROM portfolios WHERE portfolio_name = $1 AND user_id = $2;', [ portfolioName, req.session.user.user_id ]);
        if (existsResult.length !== 0) {
            return res.status(400).json({ success: false, message: 'Portfolio name already exists '});
        }

        // Insert portfolio into database
        await db.query('INSERT INTO portfolios (portfolio_name, user_id) VALUES ($1, $2)', [ portfolioName, req.session.user.user_id ]);
        return res.status(200).json({ success: true, message: 'Portfolio created successfully' });
    }
    catch (err) {
        log('error', 'portfolio/new', 'Internal server error', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/** Portfolio/transactions
 * Get all transactions for a certain portfolio
 */
app.get('/portfolio/transactions', checkAuthHelper, async (req, res) => {
    // Get request variables
    const portfolioFilter = toTitleCase(req.query.portfolio);
    const stockFilter = (req.query.stock).toUpperCase().trim();
    const startFilter = new Date(req.query.startDate).toISOString().split('T')[0] + ' 00:00:00';
    const endFilter = new Date(req.query.endDate).toISOString().split('T')[0] + ' 23:59:59';

    if (!portfolioFilter || !startFilter || !endFilter) {
        return res.status(400).json({ success: false, message: 'All input fields required' });
    }

    try {
        // Error check inputs
        // Length of all inputs
        if (portfolioFilter.length >= 50) {
            return res.status(400).json({ success: false, message: 'Portfolio name must be less than 50 characters.' });
        }
        if (stockFilter.length >= 10) {
            return res.status(400).json({ success: false, message: 'Stock length must be less than 10 characers.' });
        }
        // ?? DATE ERROR CHECKING ??

        // Get query and params
        let transactionQuery = 'SELECT symbol, transaction_type, shares, price_per_share, total_price, transaction_date FROM transactions t JOIN portfolios p ON t.portfolio_id = p.portfolio_id WHERE p.user_id = $1'; // AND t.transaction_date BETWEEN $2 AND $3';
        let transactionQueryParams = [ req.session.user.user_id ];
        let paramIdx = 2;

        if (portfolioFilter !== 'All') {
            transactionQuery += ` AND p.portfolio_name = $${paramIdx}`;
            transactionQueryParams.push(portfolioFilter);
            paramIdx++;
        }

        if (stockFilter) {
            transactionQuery += ` AND t.symbol = $${paramIdx}`;
            transactionQueryParams.push(stockFilter);
            paramIdx++;
        }

        console.log(transactionQuery);
        console.log(transactionQueryParams);

        // Query database
        const { rows: queryRes } = await db.query(transactionQuery, transactionQueryParams);

        // Get each stocks name
        const stockSymbols = queryRes.map(row => row.symbol);
        
        const yahooQuery = await yahooFinance.quote(stockSymbols, {fields: ['shortName'] });

        const transactionData = queryRes.map(t => {
            const stockInfo = yahooQuery.find(s => s.symbol === t.symbol);
            
            return {
                company: stockInfo.shortName,
                symbol: t.symbol,
                type: t.transaction_type,
                shares: t.shares,
                share_price: t.price_per_share,
                total_price: t.total_price,
                date: t.transaction_date
            };
        });


        // Return result
        log('info', '/portfolio/transactions', 'Successfully fetched transactions', { user: req.session.user.user_id, transactions: transactionData });
        return res.status(200).json({ success: true, transactions: transactionData });

    }
    catch (err) {
        log('error', '/portfolio/transactions', 'Internal Server Error', err.message);
        return res.status(500).json({ success: false, messgage: 'Internal server error' });
    }

});

app.get('/user/stats', checkAuthHelper, async (req, res) => {

    try {
        // Query for user info
        const { rows: queryRes } = await db.query("SELECT balance FROM users WHERE user_id = $1", [ req.session.user.user_id ]);

        // Handle errors
        if (queryRes.length !== 1) {
            log('error', '/user/stats', 'More than one or no user', { user: req.session.user.user_id });
            return res.status(500).json( { success: false, message: 'Internal server error' });
        }

        // Return result
        const balance = queryRes[0].balance;
        log('info', '/user/stats', 'Successfully fetched user balance', { user: req.session.user.user_id, balance: balance });
        return res.status(200).json( { success: true, balance: balance, message: 'Balance fetched successfully' });
    }
    catch (err) {
        log('error', '/user/stats', `Internal server error: ${err.message}`);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});