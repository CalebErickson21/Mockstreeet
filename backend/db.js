// Dependencies
import pkg from 'pg'; // PostgreSQL client for node.js
const { Client } = pkg;

import dotenv from 'dotenv'; // Environment variables
dotenv.config();

// Creates new client instance
const client = new Client({
  connectionString: process.env.DATABASE_URL // Connection string in .env file
});

// Connect to client
client.connect()
  .then(() => console.log('Success: Connection to Database')) // Successful connection
  .catch((err) => console.error('Failure: Connection to Datase: ', err.stack)); // Connection error

// Export client to be included in another file
export default client
