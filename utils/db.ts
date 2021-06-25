import { Pool, QueryResult } from 'pg';

export default class DB {
    private pool: Pool;

    constructor() {
        // Initialize the pool
        this.pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

        // Table editing
        // this.pool.query("DROP TABLE IF EXISTS emails").then(result => {}).catch(error => {});
        // this.pool.query("CREATE TABLE IF NOT EXISTS emails ( id serial PRIMARY KEY, email VARCHAR(255) UNIQUE, user_id VARCHAR(255) UNIQUE )") .then(result => {}) .catch(error => {});
    }

    public async query(query : string, args? : any[]) : Promise<QueryResult> {
        // Execute the query and get the result
        return await this.pool.query(query, args);
    }

    public async close() : Promise<void> {
        // End the pool
        await this.pool.end();
    }
}
