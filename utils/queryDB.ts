import { Client, QueryResult } from 'pg';

// Maybe I should make this into an obkect which contains a pool, and then I can call query methods on it without having to keep connecting

export default async function query(query : string, args : any[]) : Promise<QueryResult> {
    // Establish the client
    const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

    // Connect to the database
    await client.connect();

    // Attempt to create the tables if they do not exist
    // const email_table = await client.query("CREATE TABLE IF NOT EXISTS emails ( id serial PRIMARY KEY, email VARCHAR(255) )");

    // Make the query
    const result = await client.query(query, args);

    // Close the connection
    await client.end();

    // Return the result
    return result;
}