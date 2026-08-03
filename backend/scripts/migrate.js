/**
 * Idempotent SQL migrator for production and local development.
 * Applies pending *.sql files from ../migrations in lexicographic order.
 * Never drops, resets, or recreates the database.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "..", "migrations");

async function migrate() {
	if (!process.env.DATABASE_URL) {
		console.error("Missing required environment variable: DATABASE_URL");
		process.exit(1);
	}

	const client = new Client({
		connectionString: process.env.DATABASE_URL,
	});

	await client.connect();

	try {
		await client.query(`
			CREATE TABLE IF NOT EXISTS schema_migrations (
				id TEXT PRIMARY KEY,
				applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			)
		`);

		const files = fs
			.readdirSync(migrationsDir)
			.filter((name) => name.endsWith(".sql"))
			.sort();

		if (files.length === 0) {
			console.log("No migration files found.");
			return;
		}

		for (const file of files) {
			const { rows } = await client.query("SELECT 1 FROM schema_migrations WHERE id = $1", [
				file,
			]);

			if (rows.length > 0) {
				console.log(`Skipping ${file} (already applied)`);
				continue;
			}

			const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

			await client.query("BEGIN");
			try {
				await client.query(sql);
				await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [file]);
				await client.query("COMMIT");
				console.log(`Applied ${file}`);
			} catch (err) {
				await client.query("ROLLBACK");
				throw err;
			}
		}

		console.log("Migrations complete.");
	} finally {
		await client.end();
	}
}

migrate().catch((err) => {
	const message = err instanceof Error ? err.message : String(err);
	console.error("Migration failed:", message);
	process.exit(1);
});
