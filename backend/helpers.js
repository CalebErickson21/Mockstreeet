// Dependencies
import finnhub from 'finnhub';

export const finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_API_KEY);

// Helper functions

// Logging
export const log = (level, module, message, data = null) => {
    const timeStamp = new Date().toISOString();
    console[level](`[${level.toUpperCase()}] [${timeStamp}] [${module}] - [${message}]`, data || '');
}

// Check user login status
export const checkAuthHelper = ( req, res, next ) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, user: null, message: 'User not authenticated' });
    }

    next();
}

// Format portfolio names
export const formatPortfolio = (str) => {
    return (str || '').trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

// Format stock names and transaction types
export const formatStockTransaction = (str) => {
    return (str || '').trim().toUpperCase().trim();
}

// Format shares
export const formatSharesBalance = (num) => {
    return parseInt(num, 10);
}

// Format dates
export const formatDate = (date, ending) => {
    return new Date(date).toISOString().split('T')[0] + ' ' +ending;
}

export const fetchYahooBuySell = async (symbol, route, userId) => {
    try {
        const quote = await fetchFinnhubQuote(symbol);
        if (!quote || quote.c === 0) {
            log('error', route, 'Stock price not found', { user: userId });
            return null;
        }
        const price = parseFloat(Number(quote.c).toFixed(2));
        log('info', route, 'Fetched stock price successfully: fetchYahooBuySell', { symbol: price});
        return price;
    }
    catch (err) {
        log('error', route, `Error fetching stock price: ${err.message}`, { user: userId });
        return null;
    }
}

export const fetchFinnhubQuote = (symbol) =>
    new Promise((resolve, reject) => {
        finnhubClient.quote(symbol, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(data);
        });
    });

export const fetchFinnhubProfile = (symbol) =>
    new Promise((resolve, reject) => {
        finnhubClient.companyProfile2({ symbol }, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(data);
        });
    });

export const fetchStockSearch = async (list, route, userId) => {
    try {
        const result = await Promise.all(
            list.map(async (symbol) => {
                const [quote, profile] = await Promise.all([
                    fetchFinnhubQuote(symbol),
                    fetchFinnhubProfile(symbol),
                ]);

                if (!quote || !profile || !profile.name || quote.c === 0) {
                    return null;
                }

                return {
                    company: profile.name,
                    symbol,
                    share_price: Number(quote.c).toFixed(2),
                };
            })
        );

        const stockData = result.filter((stock) => stock !== null);
        log('info', route, 'Fetched stock data successfully: fetchStockSearch', stockData);
        return stockData;
    } catch (err) {
        log('error', route, `Error fetching stock data: ${err.message}`, { user: userId });
        return null;
    }
};