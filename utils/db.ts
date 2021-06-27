import { Pool } from "pg";

export default class DB {
    private pool: Pool;

    constructor() {
        // Initialize the pool
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        });

        // Table editing
        // this.pool.query("DROP TABLE IF EXISTS users").then(result => {}).catch(error => {});
        // this.pool.query("CREATE TABLE IF NOT EXISTS users ( id serial PRIMARY KEY, email VARCHAR(255) UNIQUE, created TIMESTAMP DEFAULT NOW() )") .then(result => {}) .catch(error => {});
    }

    public async query(query: string, args?: any[]) {
        // Execute the query and get the result
        return await this.pool.query(query, args);
    }

    public async close() {
        // End the pool
        await this.pool.end();
    }
}
