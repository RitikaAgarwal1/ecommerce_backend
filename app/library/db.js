const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'bi8lv1zmd9vrr7kw13qs-mysql.services.clever-cloud.com',
    user: 'uudolryxhcqygeoc',
    database: 'bi8lv1zmd9vrr7kw13qs',
    password: '3WmuNuhoTxco61S8ttw4'
});

//getting mysql connection

const getConnection = () => {
    return conn.connect();
}

//executing queries

const exeQuery = async (query, body = {}) => {
    console.log('db.js', query, body);
    return new Promise(async (resolve, reject) => {
        try {
            conn.connect();
            conn.query(query, body, (error, results) => {
                if (error) {
                    console.log('query error', error.message);
                    reject(error.message);
                    conn.end();
                };
                console.log(results);
                resolve(results);
                conn.end();
            });
        } catch (e) {
            console.log('catch error', e.message);
            reject(e.message);
            conn.end();
        }
    });
}

module.exports = {
    exeQuery,
    getConnection
};