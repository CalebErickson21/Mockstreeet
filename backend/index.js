// Import dependencies
import db from './db.js'; // Connect to database
import express, { query } from 'express'; // Routes and middleware
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
app.post('/login', async (req, res) => {
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
            return res.status(401).json({success: false, message: 'Invalid username or email'}); // Return 401 (unauthorized)
        }

        // User found
        const user = queryRes.rows[0];
        
        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Incorrect password'}); // Return 401 (unauthorized)
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
app.get('/logout', (req, res) => {
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
app.post('/register', async (req, res) => {
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
app.get('/portfolio/names', checkAuthHelper, async (req, res) => {

    try {
        const { rows: portfolioQuery } = await db.query(
            'SELECT portfolio_name FROM portfolios WHERE user_id = $1;',
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
app.get('/portfolio/stocks', checkAuthHelper, async (req, res) => {
    try {
    
        const portfolioName = toTitleCase(req.query.portfolio);

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
            'SELECT symbol, shares FROM portfolio_details WHERE portfolio_id = ANY($1);',
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

                portfolioValue += stockInfo.regularMarketPrice.toFixed(2) * stock.shares;
                
                return {
                    company: stockInfo.shortName,
                    symbol: stock.symbol,
                    shares: stock.shares,
                    share_price: stockInfo?.regularMarketPrice.toFixed(2) || 'Error',
                    total_price: ((stockInfo?.regularMarketPrice.toFixed(2) || 0) * stock.shares),
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
app.post('/portfolio/new', checkAuthHelper, async (req, res) => {
    try {
        const { portfolio } = req.body;

        // Ensure field is provided
        if (!portfolio) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const portfolioName = toTitleCase(portfolio); // Consistent format

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
app.get('/portfolio/transactions', checkAuthHelper, async (req, res) => {
    try {
        // Get request variables
        const transactionFilter = (req.query.transaction).toUpperCase().trim();
        const portfolioFilter = toTitleCase(req.query.portfolio);
        const stockFilter = (req.query.stock).toUpperCase().trim();
        const startFilter = new Date(req.query.startDate).toISOString().split('T')[0] + ' 00:00:00.000000';
        const endFilter = new Date(req.query.endDate).toISOString().split('T')[0] + ' 23:59:59.999999';

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

        if (stockFilter !== 'All') {
            transactionQuery += ` AND t.symbol = $${paramIdx}`;
            transactionQueryParams.push(stockFilter);
            paramIdx++;
        }
        if (transactionFilter !== 'ALL') {
            transactionQuery += ` AND t.transaction_type = $${paramIdx}`;
            transactionQueryParams.push(transactionFilter);
            paramIdx++;
        }
        transactionQuery += ';';

        // Query database
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


/** Portfolio/watchlist route
 * Get all stocks in a portfolio's watchlist
 */
app.get('/portfolio/watchlist', checkAuthHelper, async (req, res) => {
    try {
        // Get search parameters
        const portfolioParam = toTitleCase(req.query.portfolio);

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

        // Query yahoo finance api to fetch live stock data
        try {
            const yahooRes = await yahooFinance.quote(stockSymbols, { fields: ['shortName', 'regularMarketPrice'] });
    
            // Combine return data
            const stockData = stockSymbols.map(stock => {
                const stockInfo = yahooRes.find(s => s.symbol === stock);
                return {
                    company: stockInfo.shortName,
                    symbol: stockInfo.symbol,
                    share_price: stockInfo.regularMarketPrice.toFixed(2)
                };
            }).filter(stock => stock !== undefined);
    
            // Return result
            log('info', '/portfolio/watchlist', 'Stocks fetched successfully', { user: req.session.user.user_id, stock: stockData });
            return res.status(200).json({ success: true, watchlist: stockData });
        }
        catch (err) {
            log('error', '/portfolio/watchlist', `Error fetching yahoo stocks: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, message: 'Error fetching yahoo stocks' });
        }
    }
    catch (err) {
        log('error', '/portfolio/watchlist', `Error: ${err.message}`, { user: req.session.user.user_id });
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


/** Market/search route
 * Display stock information for a list of searched stocks
 *  */
app.get('/market/search', checkAuthHelper, async (req, res) => {
    try {
        const searchStocksList = (req.query.stock?.split(',').map(item => item.toUpperCase().trim()) || '').filter(s => s !== '');

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
        let stockData = [];
        try { // Query yahoo finance for stock data
            const yahooRes = await yahooFinance.quote(searchStocksList, { fields: ['shortName', 'regularMarketPrice']});

            // Combine return data
            stockData = searchStocksList.map(stock => {
                const stockInfo = yahooRes.find(s => s.symbol === stock);
                return {
                    company: stockInfo.shortName,
                    symbol: stockInfo.symbol,
                    share_price: stockInfo.regularMarketPrice.toFixed(2)
                };
            }).filter(stock => stock !== undefined);
        }
        catch (err) {
            log('error', '/market/search', `Error fetching stock data: ${err.message}`, { user: req.session.user.user_id });
            return res.status(500).json({ success: false, stock: [], message: 'Error fetching stock data' });
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
app.post('/market/buy', checkAuthHelper, async (req, res) => {
    try {
        const { portfolio, stock, shares } = req.body;
        const portfolioName = toTitleCase(portfolio);
        const stockSymbol = stock.toUpperCase().trim();
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

            // Check stock price
            let stockPrice;
            try {
                const yahooRes = await yahooFinance.quote([ stockSymbol ], { fields: [ 'regularMarketPrice' ] });
                if (yahooRes.length !== 1) {
                    log('error', '/market/buy', 'Stock price not found', { user: req.session.user.user_id });
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }
                stockPrice = yahooRes[0].regularMarketPrice.toFixed(2);
            }
            catch (err) {
                log('error', '/market/buy', 'Error fetching stock price', { user: req.session.user.user_id });
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

            // Insert stock into portfolio details
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
app.post('/market/sell', checkAuthHelper, async (req, res) => {
});


/** User/stats route
 * Get a user's balance
 */
app.get('/user/stats', checkAuthHelper, async (req, res) => {

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


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});