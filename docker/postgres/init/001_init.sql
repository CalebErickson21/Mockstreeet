-- Mockstreet database initialization
-- Runs only on first initialization of a fresh Postgres data volume.

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    balance DECIMAL(14,2) DEFAULT 10000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_positive_balance CHECK (balance >= 0)
);

CREATE TABLE IF NOT EXISTS portfolios (
    portfolio_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    portfolio_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_details (
    portfolio_id INT REFERENCES portfolios(portfolio_id) ON DELETE CASCADE,
    symbol VARCHAR(10),
    shares INT NOT NULL,
    PRIMARY KEY (portfolio_id, symbol),
    CONSTRAINT portfolio_details_positive_shares CHECK (shares >= 0)
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    portfolio_id INT REFERENCES portfolios(portfolio_id) ON DELETE CASCADE,
    symbol VARCHAR(10),
    transaction_type VARCHAR(25) CHECK (transaction_type IN ('BUY', 'SELL')),
    shares INT NOT NULL,
    share_price DECIMAL(14,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_positive_shares CHECK (shares >= 0)
);

CREATE TABLE IF NOT EXISTS watchlists (
    portfolio_id INT REFERENCES portfolios(portfolio_id) ON DELETE CASCADE,
    symbol VARCHAR(10),
    PRIMARY KEY (portfolio_id, symbol)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id
    ON portfolios (user_id);

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id_name
    ON portfolios (user_id, portfolio_name);

CREATE INDEX IF NOT EXISTS idx_transactions_portfolio_id_date
    ON transactions (portfolio_id, transaction_date);

CREATE INDEX IF NOT EXISTS idx_transactions_portfolio_symbol_type_date
    ON transactions (portfolio_id, symbol, transaction_type, transaction_date);

CREATE INDEX IF NOT EXISTS idx_users_created_at
    ON users (created_at);
