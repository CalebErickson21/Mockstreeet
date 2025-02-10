// psql -U postgres -d mockstreet -h localhost -p 5432
// Dependencies
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch((err) => console.error('Connection error', err.stack));

module.exports = client;
