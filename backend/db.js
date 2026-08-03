// Dependencies
import pkg from "pg"; // PostgreSQL client for node.js
const { Pool } = pkg;

import dotenv from "dotenv"; // Environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
	console.error("Missing required environment variable: DATABASE_URL");
	process.exit(1);
}

// Connection pool (shared across requests)
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

pool
	.query("SELECT 1")
	.then(() => console.log("Success: Connection to Database"))
	.catch((err) => {
		const message = err instanceof Error ? err.message : String(err);
		console.error("Failure: Connection to Database:", message);
	});

pool.on("error", (err) => {
	const message = err instanceof Error ? err.message : String(err);
	console.error("Failure: Unexpected database pool error:", message);
});

export default pool;
