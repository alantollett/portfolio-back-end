// add the process environment variables
require('dotenv').config();

const util = require( 'util' );
const mysql = require( 'mysql' );

function getDatabaseConnection() {
    const con = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: "portfolio_optimiser"
    });

    return {
        query(sql, args) {
            return util.promisify(con.query).call(con, sql, args);
        },
        close() {
            return util.promisify(con.end ).call(con);
        }
    };
}

module.exports = getDatabaseConnection;