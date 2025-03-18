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

export const fetchYahooBuySell = async (symbol, route) => {
    try {
        const yahooRes = await yahooFinance.quote([ symbol ], { fields: [ 'regularMarketPrice' ] });
        if (yahooRes.length !== 1) {
            log('error', route, 'Stock price not found', { user: req.session.user.user_id });
            return null;
        }
        const price = parseFloat(yahooRes[0].regularMarketPrice.toFixed(2));
        log('info', route, 'Fetched stock price successfully: fetchYahooBuySell', { symbol: price});
        return price;
    }
    catch (err) {
        log('error', route, 'Error fetching stock price', { user: req.session.user.user_id });
        return null;
    }
}

export const fetchYahooWatchSearch = async (list, route) => {
    try { // Query yahoo finance for stock data
        const yahooRes = await yahooFinance.quote(list, { fields: ['shortName', 'regularMarketPrice']});

        // Combine return data
        const stockData = list.map(stock => {
            const stockInfo = yahooRes.find(s => s.symbol === stock);
            if (!stockInfo) return null;

            return {
                company: stockInfo.shortName,
                symbol: stockInfo.symbol,
                share_price: stockInfo.regularMarketPrice?.toFixed(2) || 0.00
            };
        }).filter(stock => stock !== null);
        log('info', route, 'Fetched stock data successfully: fetchYahooWatchSearch', stockData);
        return stockData;
    }
    catch (err) {
        log('error', route, `Error fetching stock data: ${err.message}`, { user: req.session.user.user_id });
        return null;
    }
}