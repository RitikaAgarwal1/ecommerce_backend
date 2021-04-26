const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Ecommerce',
    password: 'Global!234'
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