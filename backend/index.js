// Import dependencies
import db from './db.js'; // Connect to database
import express from 'express'; // Routes and middleware
import session from 'express-session'; // User sessions
import cors from 'cors'; // Cross-origin resource sharing
import yahooFinance from 'yahoo-finance2'; // Yahoo finance stock fetching
import bcrypt from 'bcrypt'; // Password hashing
import dotenv from 'dotenv'; // Environment variables
import nodemailer from 'nodemailer'; // Send emails

// Import helper functions
import { log, checkAuthHelper, formatPortfolio, formatStockTransaction, formatSharesBalance, formatDate, fetchYahooBuySell, fetchYahooWatchSearch } from './helpers.js';

// Declare global constants
const MAX_NUM = 999999999999.99;

// Configurations
const app = express(); // Create express app instance
app.use(express.json()); // express.json enables parsing of json files
dotenv.config(); // Load environment variables

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

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


/** Check User Authorization Route that can be directly called by frontend
 */
app.get('/api/check-auth', (req, res) => {
    try { 
        if (req.session.user) {
            log('info', '/check-auth', 'User is authenticated', { user: req.session.user.user_id });
            return res.status(200).json({ success: true, user: req.session.user.username, message: 'User is authenticated' });
        } else {
            log('info', '/check-auth', 'User not authenticated');
            return res.status(200).json({ success: false, user: null, message: 'User is not authenticated' }); // Still successful because users can be on homepage and not be authenticated
        }
    }
    catch (err) {
        log('error', '/check-auth', `Authentication error: ${err.message}`, { user: req.session.user.user_id? req.session.user.user_id : 'No user' });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Login route
 * If user found in database, login
 * If user not found in database, return error
 */
app.post('/api/login', async (req, res) => {
    try {
        // Get request data
        const { userNameOrEmail, password } = req.body;

        // Query database for user
        const queryRes = await db.query(
            'SELECT * FROM users WHERE username = $1 OR email = $1;',
            [userNameOrEmail]
        );
        
        // User not found
        if (queryRes.rows.length === 0) {
            log('info', '/login', 'Invalid username or email');
            return res.status(401).json({success: false, message: 'Invalid login'}); // Return 401 (unauthorized)
        }

        // User found
        const user = queryRes.rows[0];
        
        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Incorrect login'}); // Return 401 (unauthorized)
        }

        // Successful login
        req.session.user = { user_id: user.user_id, username: user.username, email: user.email }; // Store user data for session
        log('info', '/login', 'Login successful', req.session.user.user_id); // Log information
        return res.status(200).json({success: true, user: req.session.user.username}); // Return successful login to frontend (200 is success)
    }
    catch (err) {
        log('error', '/login', `Login error: ${err.message}`); // Log error
        return res.status(500).json({success: false, message: 'Internal server error'}); // Return 500 (internal server error)
    }

});


/** Logout route
 * Logout user
 */
app.get('/api/logout', (req, res) => {
    try {
        // No user logged in 
        if (!req.session.user) {
            log('info', '/logout', 'No user to log out');
            return res.status(200).json({ success: false, message: 'No user to log out' });
        }

        // Log user out
        req.session.destroy(() => { // Log user out
            log('info', '/logout', 'User logged out'); // Log information
            return res.status(200).json({ success: true, message: 'User logged out' }); // Return logout success to frontend (200 is success)
        });
    }
    catch (err) {
        log('error', '/logout', `Logout error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Registration route
 * Register user, then redirect to login page
 */
app.post('/api/register', async (req, res) => {
    try {
        
        const { firstName, lastName, email, username, password, passwordConfirmation } = req.body; // Extract user details from request

        // Ensure all fields are provided
        if (!firstName || !lastName || !email || !username || !password || !passwordConfirmation) {
            return res.status(400).json({ success: false, message: 'All fields are required' }); // User error (400)
        }

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
        const existsResult = await db.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2;',
            [username, email]
        );
        if (existsResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' }); // User error (400)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // Begin transaction
            await db.query('BEGIN;');
            
            // Create user
            const registerRes = await db.query(
                'INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *;', 
                [firstName, lastName, email, username, hashedPassword]
            );
            
            // Create default portfolio for user
            await db.query(
                'INSERT INTO portfolios (user_id, portfolio_name) VALUES ($1, $2);',
                [registerRes.rows[0].user_id , 'All']
            );
            
            // Commit transaction
            await db.query('COMMIT;');
        }
        catch (err) {
            await db.query('ROLLBACK;'); // Rollback transaction if error
            log('error', '/register', `Error: ${err.message}`, { username: username, email: email }); // Log error
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Successful registration
        log('info', '/register', 'Successful registration', {firstName: firstName, lastName: lastName, email: email }); // Log successful registration
        return res.status(201).json({ success: true, user: {username: username, email: email}, message: 'Registered successfully' }); // Successful register (201 = created)
    }
    catch (err) {
        log('error', '/register', `Registration error: ${err.message}`, { firstName: firstName, lastName: lastName, email: email }); // Log error
        return res.status(500).json({ success: false, message: 'Internal server error' }); // 500 status code to frontend (internal server error)
    }
});


/** Portfolio/names route
 * Get a list of all of a user's portfolios
 */
app.get('/api/portfolio/names', checkAuthHelper, async (req, res) => {

    try {
        const { rows: portfolioQuery } = await db.query(
            'SELECT portfolio_name FROM portfolios WHERE user_id = $1 ORDER BY portfolio_name ASC;',
            [req.session.user.user_id]
        );
        
        // User has no default portfolio
        if (portfolioQuery.length === 0) {
            log('error', '/portfolio/names', 'User does not have any portfolios', {user: req.session.user.user_id});
            return res.status(404).json({ success: false, portfolioNames: [], message: 'Internal server error.' });
        }
        
        // Convert portfolio names to list
        const portfolioNames = portfolioQuery.map(p => p.portfolio_name);
        
        // Return result
        log('info', '/portfolio/names', 'Porfolio names fetched successfully', { user: req.session.user.user_id, portfolios: portfolioNames});
        return res.status(200).json({ success: true, portfolioNames: portfolioNames});
    }
    catch (err) {
        log('error', '/portfolio/names', `Internal server error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, portfolioNames: [], message: 'Internal server error.' });
    }
});


/** Porfolio/stocks route
 * Get stock data for a certain portfolio
 */
app.get('/api/portfolio/stocks', checkAuthHelper, async (req, res) => {
    try {
    
        const portfolioName = formatPortfolio(req.query.portfolio);

        if (!portfolioName) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Error checking before query database
        if (portfolioName.length > 50 || portfolioName === 'CreateNew') {
            return res.status(400).json({ success: false, message: 'Invalid input'});
        }

        // Get portfolio
        let portfolioQuery = 'SELECT portfolio_id FROM portfolios WHERE user_id = $1';
        let portfolioParams = [ req.session.user.user_id ];
        if (portfolioName !== 'All') { // Default portfolio is container for all stocks not in portfolio, but want to show all stocks on frontend
            portfolioQuery += ' AND portfolio_name = $2';
            portfolioParams.push(portfolioName);
        }
        portfolioQuery += ';';

        const { rows: portfolioIds } = await db.query(portfolioQuery, portfolioParams);
        
        // If portfolio not found
        if (portfolioIds.length === 0) {
            log('error', '/portfolio/stocks', 'Portfolio not found', { user: req.session.user.user_id });
            return res.status(404).json({ success: false, message: 'Portfolio not found'});
        }

        // Get stock data given portfolio ids list
        const portfolioIdsList = portfolioIds.map(p => p.portfolio_id);
        const { rows: stocks } = await db.query(
            'SELECT symbol, SUM(shares) as total_shares FROM portfolio_details WHERE portfolio_id = ANY($1) GROUP BY symbol ORDER BY total_shares DESC;',
            [ portfolioIdsList ]
        );

        // If no stocks in portfolio
        if (stocks.length === 0) {
            log('info', 'portfolio/stocks', 'Empty portfolio', { stocks: [] });
            return res.status(200).json({ success: true, stocks: [], value: 0 });
        }

        // Fetch stock values from yahoo finance API
        let portfolioValue = 0;
        try {
            const stockSymbols = stocks.map(stock => stock.symbol);

            // API call to yahoo finance
            const stockPrices = await yahooFinance.quote(stockSymbols, {fields: ['shortName', 'regularMarketPrice' ] });

            // Combine data
            const stockData = stocks.map(stock => {
                const stockInfo = stockPrices.find(s => s.symbol === stock.symbol);

                portfolioValue += parseFloat(stockInfo.regularMarketPrice.toFixed(2)) * stock.total_shares;
                
                return {
                    company: stockInfo.shortName,
                    symbol: stock.symbol,
                    shares: stock.total_shares,
                    share_price: stockInfo?.regularMarketPrice.toFixed(2) || 0,
                    total_price: ((stockInfo?.regularMarketPrice || 0) * stock.total_shares).toFixed(2),
                };
            });

            // Send result
            log('info', 'portfolio/stocks', 'Stocks fetched successfully', stockData);
            return res.status(200).json({ success: true, stocks: stockData, value: portfolioValue.toFixed(2) });
        }
        catch (err) {
            // Error handling
            log('error', '/portfolio/stocks', `Fetch stocks error: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Internal server error.'});
        }
    }
    catch (err) {
        log('error', '/portfolio/stocks', `Error returning portfolio stocks: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Porfolio/new route
 * Create new portfolio
 */
app.post('/api/portfolio/new', checkAuthHelper, async (req, res) => {
    try {
        const { portfolio } = req.body;

        // Ensure field is provided
        if (!portfolio) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const portfolioName = formatPortfolio(portfolio); // Consistent format

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

        try {
            // Begin transaction
            await db.query('BEGIN;');

            // Ensure another portfolio with same name doesn't exist
            const { rows: existsResult } = await db.query(
                'SELECT portfolio_name FROM portfolios WHERE portfolio_name = $1 AND user_id = $2;',
                [ portfolioName, req.session.user.user_id ]
            );
            if (existsResult.length !== 0) {
                return res.status(400).json({ success: false, message: 'Portfolio name already exists '});
            }

            // Insert portfolio into database
            await db.query('INSERT INTO portfolios (portfolio_name, user_id) VALUES ($1, $2);', [ portfolioName, req.session.user.user_id ]);

            // Commit transaction
            await db.query('COMMIT;');
        }
        catch (err) {
            // Rollback transaction if error
            await db.query('ROLLBACK;');
            log('error', '/portfolio/new', `Error creating portfolio: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }


        return res.status(200).json({ success: true, message: 'Portfolio created successfully' });
    }
    catch (err) {
        log('error', 'portfolio/new', 'Internal server error', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Portfolio/transactions route
 * Get all transactions for a certain portfolio
 */
app.get('/api/transactions', checkAuthHelper, async (req, res) => {
    try {
        // Get request variables
        const transactionFilter = formatStockTransaction(req.query.transaction);
        const stockFilter = formatStockTransaction(req.query.stock);
        const portfolioFilter = formatPortfolio(req.query.portfolio);
        const startFilter = formatDate(req.query.startDate, '00:00:00.000000');
        const endFilter = formatDate(req.query.endDate, '23:59:59.999999');

        // Check for empty fields
        if (!portfolioFilter || !startFilter || !endFilter || !transactionFilter || !stockFilter) {
            log('error', '/portfolio/transactions', 'Empty input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'All input fields required', transactions: [] });
        }
        // Error check inputs
        if (portfolioFilter.length >= 50) {
            log('error', '/portfolio/transactions', 'Portfolio filter over 50 characters', {user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Portfolio name must be less than 50 characters.', transactions: [] });
        }
        if (stockFilter.length >= 10) {
            log('error', '/portfolio/transactions', 'Stock filter over 10 characters', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Stock length must be less than 10 characers.', transactions: [] });
        }
        if (transactionFilter !== 'BUY' && transactionFilter !== 'SELL' && transactionFilter !== 'ALL') {
            log('error', '/portfolio/transactions', 'Invalid transaction filter', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Invalid transaction filter', transactions: [] });
        }

        // Get query and params
        let transactionQuery = 'SELECT symbol, transaction_type, shares, share_price, (shares * share_price) AS total_price, transaction_date FROM transactions t JOIN portfolios p ON t.portfolio_id = p.portfolio_id WHERE p.user_id = $1 AND t.transaction_date BETWEEN $2 AND $3';
        let transactionQueryParams = [ req.session.user.user_id, startFilter, endFilter ];
        let paramIdx = 4;

        if (portfolioFilter !== 'All') {
            transactionQuery += ` AND p.portfolio_name = $${paramIdx}`;
            transactionQueryParams.push(portfolioFilter);
            paramIdx++;
        }

        if (stockFilter !== 'ALL') {
            transactionQuery += ` AND t.symbol = $${paramIdx}`;
            transactionQueryParams.push(stockFilter);
            paramIdx++;
        }
        if (transactionFilter !== 'ALL') {
            transactionQuery += ` AND t.transaction_type = $${paramIdx}`;
            transactionQueryParams.push(transactionFilter);
            paramIdx++;
        }
        transactionQuery += ' ORDER BY transaction_date DESC;';

        // Query database
        console.log(transactionQuery);
        console.log(transactionQueryParams);
        const { rows: queryRes } = await db.query(transactionQuery, transactionQueryParams);

        if (queryRes.length === 0) {
            log('info', '/portfolio/transactions', 'No transactions with given params', { user: req.session.user.user_id });
            return res.status(200).json({ success: true, message: 'No transactions', transactions: []});
        }

        try { // Fetch stock data
            // Get each stocks name
            const stockSymbols = queryRes.map(row => row.symbol);
            
            // Query yahoo finance to get company name for each stock symbol
            const yahooQuery = await yahooFinance.quote(stockSymbols, {fields: ['shortName'] });

            // Structure transaction return value
            const transactionData = queryRes.map(t => {
                const stockInfo = yahooQuery.find(s => s.symbol === t.symbol);
                
                return {
                    company: stockInfo.shortName,
                    symbol: t.symbol,
                    type: t.transaction_type,
                    shares: t.shares,
                    share_price: t.share_price,
                    total_price: t.total_price,
                    date: t.transaction_date.toISOString().split('T')[0]
                };
            });

            // Return result
            log('info', '/portfolio/transactions', 'Successfully fetched transactions', { user: req.session.user.user_id, transactions: transactionData });
            return res.status(200).json({ success: true, transactions: transactionData });
        }
        catch (err) {
            log('error', '/portfolio/transactions', `Error fetching stock data: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

    }
    catch (err) {
        log('error', '/portfolio/transactions', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, messgage: 'Internal server error' });
    }

});


/** watchlist route
 * Get all stocks in a portfolio's watchlist
 */
app.get('/api/watchlist', checkAuthHelper, async (req, res) => {
    try {
        // Get search parameters
        const portfolioParam = formatPortfolio(req.query.portfolio);

        // Error check
        if (portfolioParam === '' || portfolioParam.length >= 50) {
            log('error', '/portfolio/watchlist', 'Invalid portfolio input', req.session.user.user_id);
            return res.status(400).json({ success: false, message: 'Invalid portfolio parameter' });
        }

        // Query database
        const { rows: queryRes } = await db.query(
            'SELECT symbol FROM portfolios p JOIN watchlists w ON p.portfolio_id = w.portfolio_id WHERE p.portfolio_name = $1 AND p.user_id = $2;',
            [ portfolioParam, req.session.user.user_id ]
        );
        if (queryRes.length === 0) {
            log('info', '/portfolio/watchlist', 'No stocks in portfolio watchlist');
            return res.status(200).json({ success: true, watchlist: [] });
        }

        // Convert query to list of stocks
        const stockSymbols = queryRes.map(stock => stock.symbol);

        // Fetch stock data
        const stockData = await fetchYahooWatchSearch(stockSymbols, '/watchlist', req.session.user.user_id);
        if (!stockData) {
            return res.status(500).json({ success: false, watchlist: [], message: 'Internal server error.' });
        }

        // Return result
        log('info', '/portfolio/watchlist', 'Stocks fetched successfully', { user: req.session.user.user_id, stock: stockData });
        return res.status(200).json({ success: true, watchlist: stockData });
    }
    catch (err) {
        log('error', '/portfolio/watchlist', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


/** watchlist/add route */
app.post('/api/watchlist/add', checkAuthHelper, async (req, res) => {
    try {
        const { portfolio, stock } = req.body;
        const portfolioName = formatPortfolio(portfolio);
        const stockSymbol = formatStockTransaction(stock);

        // Error check inputs
        if (!portfolioName || !stockSymbol) {
            log('error', '/portfolio/watchlist/add', 'Empty input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'All input fields required' });
        }
        if (portfolioName.length > 50 || stockSymbol.length > 10) {
            log('error', '/portfolio/watchlist/add', 'Invalid input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Invalid input fields' });
        }

        try {
            // Begin transaction
            await db.query('BEGIN;');

            // Get portfolio id
            const { rows: portfolioIdRes } = await db.query(
                'SELECT portfolio_id FROM portfolios WHERE user_id = $1 AND portfolio_name = $2;',
                [ req.session.user.user_id, portfolioName ]
            );
            if (portfolioIdRes.length !== 1) {
                log('error', '/portfolio/watchlist/add', 'Portfolio not found', { user: req.session.user.user_id });
                return res.status(404).json({ success: false, message: 'Portfolio not found' });
            }
            const portfolioId = portfolioIdRes[0].portfolio_id;

            // Insert stock into watchlist
            await db.query(
                'INSERT INTO watchlists (portfolio_id, symbol) VALUES ($1, $2);',
                [ portfolioId, stockSymbol ]
            );

            // Commit transaction
            await db.query('COMMIT;');
        }
        catch (err) {
            // Rollback transaction if error
            await db.query('ROLLBACK;');
            log('error', '/portfolio/watchlist/add', `Error adding stock: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Return successful result
        log('info', '/portfolio/watchlist/add', 'Stock added successfully', { user: req.session.user.user_id, stock: stockSymbol });
        return res.status(200).json({ success: true, message: 'Stock added successfully' });

    }
    catch (err) {
        log('error', '/portfolio/watchlist/add', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Portfolio/watchlist/remove route
 * 
 */
app.post('/api/watchlist/remove', checkAuthHelper, async (req, res) => {
    try {
        const { portfolio, stock } = req.body;
        const portfolioName = formatPortfolio(portfolio);
        const stockSymbol = formatStockTransaction(stock);

        // Error check inputs
        if (!portfolioName || !stockSymbol) {
            log('error', '/portfolio/watchlist/rempve', 'Empty input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'All input fields required' });
        }
        if (portfolioName.length > 50 || stockSymbol.length > 10) {
            log('error', '/portfolio/watchlist/remove', 'Invalid input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Invalid input fields' });
        }

        try {
            // Begin transaction
            await db.query('BEGIN;');

            // Get portfolio id
            const { rows: portfolioIdRes } = await db.query(
                'SELECT portfolio_id FROM portfolios WHERE user_id = $1 AND portfolio_name = $2;',
                [ req.session.user.user_id, portfolioName ]
            );
            if (portfolioIdRes.length !== 1) {
                log('error', '/portfolio/watchlist/remove', 'Portfolio not found', { user: req.session.user.user_id });
                return res.status(404).json({ success: false, message: 'Portfolio not found' });
            }
            const portfolioId = portfolioIdRes[0].portfolio_id;

            // Remove stock from watchlist
            await db.query(
                'DELETE FROM watchlists WHERE portfolio_id = $1 AND symbol = $2;',
                [ portfolioId, stockSymbol ]
            );

            // Commit transaction
            await db.query('COMMIT;');
        }
        catch (err) {
            // Rollback transaction if error
            await db.query('ROLLBACK;');
            log('error', '/portfolio/watchlist/remove', `Error removing stock: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Return success
        log('info', '/watchlist/remove', 'Stock removed successfully', { user: req.session.user.user_id });
        return res.status(200).json({ success: true, message: 'Watchlist updated successfully' });

    }
    catch (err) {
        log('error', '/portfolio/watchlist/remove', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Market/search route
 * Display stock information for a list of searched stocks
 *  */
app.get('/api/market/search', checkAuthHelper, async (req, res) => {
    try {
        const searchStocksList = (req.query.stock?.split(',').map(s => formatStockTransaction(s))).filter(s => s !== null);

        // Error check inputs
        if (!searchStocksList) {
            log('error', '/market/search', 'Invalid search input', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Invalid search input' });
        };

        // Check each input length
        for (let i = 0; i < searchStocksList.length; i++) {
            if (searchStocksList[i].length >= 10) {
                log('error', '/market/search', 'Stock symbol too long', { user: req.session.user.user_id });
                return res.status(400).json({ success: false, message: 'Stock symbol must be less than 10 characters' });
            }
        }
        
        // Fetch stock data
        const stockData = await fetchYahooWatchSearch(searchStocksList, '/market/search', req.session.user.user_id);
        if (!stockData) {
            return res.status(500).json({ success: false, watchlist: [], message: 'Internal server error.' });
        }

        // Return result
        log('info', '/market/search', 'Stocks fetched successfully', stockData);
        return res.status(200).json({ success: true, stock: stockData });
    }
    catch (err) {
        log('error', '/market/search', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Market/buy route
 * Buy a stock
 */
app.post('/api/market/buy', checkAuthHelper, async (req, res) => {
    try {
        const { portfolio, stock, shares } = req.body;
        const portfolioName = formatPortfolio(portfolio);
        const stockSymbol = formatStockTransaction(stock);
        const numShares = parseInt(shares, 10);

        // Error check inputs
        if (!portfolioName || !stockSymbol || !numShares) {
            log('error', '/market/buy', 'Empty input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'All input fields required' });
        }
        if (isNaN(numShares))  {
            log('error', '/market/buy', 'Invalid shares input', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Shares must be a number' });
        }
        if (portfolioName.length >= 50 || stockSymbol.length >= 10 || shares <= 0) {
            log('error', '/market/buy', 'Invalid input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Invalid input fields' });
        }

        try {
            // Begin transaction
            await db.query('BEGIN;');

            // Get user balance
            const { rows: balanceQueryRes } = await db.query(
                'SELECT balance FROM users WHERE user_id = $1;',
                [ req.session.user.user_id ]
            );
            const balance = balanceQueryRes[0].balance;

            // Fetch stock price
            const stockPrice = await fetchYahooBuySell(stockSymbol, '/market/buy', req.session.user.user_id);
            if (!stockPrice) {
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            // Check if user can afford stock
            const totalCost = stockPrice * numShares;
            if (totalCost > balance) {
                log('error', '/market/buy', 'Insufficient funds', { user: req.session.user.user_id });
                return res.status(400).json({ success: false, message: 'Insufficient funds' });
            }

            // Get portfolio id
            const { rows: portfolioIdRes } = await db.query(
                'SELECT portfolio_id FROM portfolios WHERE user_id = $1 AND portfolio_name = $2;',
                [ req.session.user.user_id, portfolioName ]
            );
            if (portfolioIdRes.length !== 1) {
                log('error', '/market/buy', 'Portfolio not found', { user: req.session.user.user_id });
                return res.status(404).json({ success: false, message: 'Portfolio not found' });
            }
            const portfolioId = portfolioIdRes[0].portfolio_id;

            // Update portfolio details
            const { rows: stockExistsRes } = await db.query(
                'SELECT * FROM portfolio_details WHERE portfolio_id = $1 AND symbol = $2;',
                [ portfolioId, stockSymbol ]
            );
            if (stockExistsRes.length === 1) {
                await db.query(
                    'UPDATE portfolio_details SET shares = shares + $1 WHERE portfolio_id = $2 AND symbol = $3;',
                    [ numShares, portfolioId, stockSymbol ]
                );
            }
            else {
                await db.query(
                    'INSERT INTO portfolio_details (portfolio_id, symbol, shares) VALUES ($1, $2, $3);',
                    [ portfolioId, stockSymbol, numShares ]
                );
            }

            // Insert transaction into transactions
            await db.query(
                'INSERT INTO transactions (portfolio_id, symbol, transaction_type, shares, share_price) VALUES ($1, $2, $3, $4, $5);',
                [ portfolioId, stockSymbol, 'BUY', numShares, stockPrice ]
            );

            // Update user balance
            await db.query(
                'UPDATE users SET balance = balance - $1 WHERE user_id = $2;',
                [ totalCost, req.session.user.user_id ]
            );

            // Commit transaction
            await db.query('COMMIT;');
        }
        catch (err) {
            // Rollback transaction if error
            await db.query('ROLLBACK;');
            log('error', '/market/buy', `Error buying stock: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }


        // Return successful result
        log('info', '/market/buy', 'Stock bought successfully', { user: req.session.user.user_id, stock: stockSymbol, shares: numShares });
        return res.status(200).json({ success: true, message: 'Stock bought successfully' });
    }
    catch (err) {
        log('error', '/market/buy', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Market/sell route
 * Sell a stock
 */
app.post('/api/market/sell', checkAuthHelper, async (req, res) => {
    try {
        const { portfolio, stock, shares } = req.body;
        const portfolioName = formatPortfolio(portfolio);
        const stockSymbol = formatStockTransaction(stock);
        const numShares = formatSharesBalance(shares);

        // Error check inputs
        if (!portfolioName || !stockSymbol || !numShares) {
            log('error', '/market/sell', 'Empty input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'All input fields required' });
        }
        if (isNaN(numShares))  {
            log('error', '/market/sell', 'Invalid shares input', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Shares must be a number' });
        }
        if (portfolioName.length >= 50 || stockSymbol.length >= 10 || shares <= 0) {
            log('error', '/market/sell', 'Invalid input fields', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Invalid input fields' });
        }

        // Begin sell transaction
        try {
            // Fetch stock price
            const stockPrice = await fetchYahooBuySell(stockSymbol, '/market/buy', req.session.user.user_id);
            if (!stockPrice) {
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            
            // Begin transaction
            await db.query('BEGIN;');

            // Get portfolio id
            const { rows: portfolioIdRes } = await db.query(
                'SELECT portfolio_id FROM portfolios WHERE user_id = $1 AND portfolio_name = $2;',
                [ req.session.user.user_id, portfolioName ]
            );
            if (portfolioIdRes.length !== 1) {
                log('error', '/market/buy', 'Portfolio not found', { user: req.session.user.user_id });
                return res.status(404).json({ success: false, message: 'Portfolio not found' });
            }
            const portfolioId = portfolioIdRes[0].portfolio_id;

            // See if user has enough shares to sell
            const { rows: sharesRes } = await db.query(
                'SELECT shares FROM portfolio_details WHERE portfolio_id = $1 AND symbol = $2',
                [ portfolioId, stockSymbol]
            );
            if (sharesRes.length !== 1 || sharesRes[0].shares < numShares) {
                log('info', '/market/sell', 'Cannot sell unowned stock', { user: req.session.user.user_id });
                return res.status(400).json({ success: false, message: 'Insufficient shares' });
            }

            // Update portfolio details
            await db.query(
                'UPDATE portfolio_details SET shares = shares - $1 WHERE portfolio_id = $2 AND symbol = $3;',
                [ numShares, portfolioId, stockSymbol ]
            );

            // Handle 0 shares left
            await db.query(
                'DELETE FROM portfolio_details WHERE portfolio_id = $1 AND symbol = $2 AND shares = 0;',
                [portfolioId, stockSymbol]
              );

            // Update transactions
            await db.query(
                'INSERT INTO transactions (portfolio_id, symbol, transaction_type, shares, share_price) VALUES ($1, $2, $3, $4, $5);',
                [ portfolioId, stockSymbol, 'SELL', numShares, stockPrice ]
            );

            // Update user balance
            await db.query(
                'UPDATE users SET balance = balance + $1 WHERE user_id = $2;',
                [ numShares * stockPrice, req.session.user.user_id ]
            );

            // Commit transaction
            await db.query('COMMIT;');
        }
        catch (err) {
            // Rollback transaction if error
            await db.query('ROLLBACK;');
            log('error', '/market/sell', `Error buying stock: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Return successful result
        log('info', '/market/sell', 'Stock sold successfully', { user: req.session.user.user_id, stock: stockSymbol, shares: numShares });
        return res.status(200).json({ success: true, message: 'Stock sold successfully' });
    }
    catch (err) {
        log('error', '/market/sell', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** User/stats route
 * Get a user's balance
 */
app.get('/api/balance', checkAuthHelper, async (req, res) => {

    try {
        // Query for user info
        const { rows: queryRes } = await db.query('SELECT balance FROM users WHERE user_id = $1;',
            [ req.session.user.user_id ]
        );

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
        log('error', '/user/stats', `Internal server error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** Balance/add route
 * Add capital for a user
 */
app.post('/api/balance/add', checkAuthHelper, async (req, res) => {
    try {
        const { balance } = req.body;
        const increment = formatSharesBalance(balance);
        if (isNaN(increment))  {
            log('info', '/balance/add', 'Increment input must be a number', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Balance must be a number' });
        }
        if (increment <= 0) {
            log ('info', '/balance/add', 'Input must be positive', { user: req.session.user.user_id });
            return res.status(400).json({ success: false, message: 'Balance must be positive' });
        }

        try {
            // Begin transaction
            await db.query('BEGIN;');

            // Make sure user balance does not exceed max
            const { rows: queryRes } = await db.query(
                'SELECT balance FROM users WHERE user_id = $1;',
                [req.session.user.user_id]
            );
            if (queryRes.length !== 1) {
                log('error', '/balance/add', 'No user', { user: req.session.user.user_id });
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            if (queryRes[0].balance + increment >= MAX_NUM) {
                log('info', '/balance/add', 'Increment result cannot exceed max balance', { user: req.session.user.user_id });
                return res.status(400).json({ success: false, message: 'Invalid increment input.' });
            }

            await db.query(
                'UPDATE users SET balance = balance + $1 WHERE user_id = $2;',
                [ increment, req.session.user.user_id ]
            );

            await db.query('COMMIT;');

        }
        catch (err) {
            // Rollback if error
            await db.query('ROLLBACK;');
            log('error', '/balance/add', `Database error ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        log('info', '/balance/add', 'Balance increased successfully', { user: req.session.user.user_id });
        return res.status(200).json({ success: true, message: 'Balance increased successfully' });
    }
    catch (err) {
        log('error', '/balance/add', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


/** /Email route
 * Send email to support staff
 */
app.post('/api/email', async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Mockstreet message from: ${subject}`,
            text: message
        };

        try {
            await transporter.sendMail(mailOptions);
            log('info', '/email', 'Email sent successfully');
            return res.status(200).json({ success: true, message: 'Email sent' });
        }
        catch (err) {
            log('error', '/email', `Error sending email: ${err.message}`, mailOptions);
            return res.status(500).json({ success: false, message: 'Error sending email' });
        }
    }
    catch (err) {
        log('error', '/email', `Error: ${err.message}`, { user: req.session.user.user_id || 'No user'});
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});