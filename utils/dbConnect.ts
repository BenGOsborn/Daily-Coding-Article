import mysql from 'mysql';

export default function runQuery(query : string, callback : mysql.queryCallback) : void {
    // Create a connection
    const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL as string);

    // Connect to the database
    connection.connect((error) => {
        if (error) {
            console.log(`Failed to connect to database: ${error}`);
        }
    });

    // Use the specified database
    connection.query('USE heroku_1984af7c7592a8b', (error, result) => {
        if (error) {
            console.log(error);
        }
    });

    // Execute the query and run the callback
    connection.query(query, callback);

    // End the connection
    connection.destroy();
}