const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'mockstreet',
    password: '#BamaDB21!',
    port: 5432,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch((err) => console.error('Connection error', err.stack));
