const mysql = require('mysql');

const conn = mysql.createPool({
    host: 'bi8lv1zmd9vrr7kw13qs-mysql.services.clever-cloud.com',
    user: 'uudolryxhcqygeoc',
    database: 'bi8lv1zmd9vrr7kw13qs',
    password: '3WmuNuhoTxco61S8ttw4'
});

//getting mysql connection

const getConnection = () => {
    return conn;
}

//executing queries

const exeQuery = async (query, body = {}) => {
    console.log('db.js', query, body);
    return new Promise(async (resolve, reject) => {
        try {
            conn.query(query, body, (error, results) => {
                if (error) {
                    console.log('query error', error.message);
                    reject(error.message);
                };
                console.log(results);
                resolve(results);
            });
        } catch (e) {
            console.log('catch error', e.message);
            reject(e.message);
        }
    });
}

module.exports = {
    exeQuery,
    getConnection
};