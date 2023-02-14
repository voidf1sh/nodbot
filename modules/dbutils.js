// Import the mySQL module
const mysql = require('mysql');
// Import environment variables for database connections
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    getData(queryParts) {
        // Return a Promise so we can resolve with data later
        return new Promise((resolve, reject) => {
            // Set up the database connection
            const db = mysql.createConnection({
                host: process.env.DBHOST,
                user: process.env.DBUSER,
                password: process.env.DBPASS,
                database: process.env.DBNAME,
                port: process.env.DBPORT
            });
            // Open the connection
            db.connect((err) => {
                if (err) {
                    reject(`Error connecting to the database: ${err.message}`);
                    return;
                }
            });
            
            db.query(queryParts.rawQuery, queryParts.values, (err, results) => {
                if (err) {
                    reject("Error fetching the data: " + err.message + "\nOffending Query: " + query);
                    // Close the database connection
                    db.end();
                    return;
                }
                // If an empty set is returned
                if (results.length == 0) {
                    reject("No results were returned.");
                    // Close the database connection
                    db.end();
                    return;
                }
                // Close the database connection
                db.end();
                resolve(results);
            });
        });
    },
    setData(queryParts) {
        // Return a Promise so we can resolve with data later
        return new Promise((resolve, reject) => {
            // Set up the database connection
            const db = mysql.createConnection({
                host: process.env.DBHOST,
                user: process.env.DBUSER,
                password: process.env.DBPASS,
                database: process.env.DBNAME,
                port: process.env.DBPORT
            });
            // Open the connection
            db.connect((err) => {
                if (err) {
                    reject(`Error connecting to the database: ${err.message}`);
                    return;
                }
            });
            db.query(queryParts.rawQuery, queryParts.values, (err, results) => {
                if (err) {
                    reject(`Error setting the data: ${err.message}\nOffending Query: ${query}`);
                    // Close the database connection
                    db.end();
                    return;
                }
                // Close the database connection
                db.end();
                resolve(`Query executed successfully: ${results.affectedRows} row changed.`);
            });
        });
    }
}