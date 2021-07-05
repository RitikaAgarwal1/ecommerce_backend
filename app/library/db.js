const mysql = require('mysql');

const conn = mysql.createPool({
    connectionLimit : 200,
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DB,
    password: process.env.PASSWORD
});

//getting mysql connection
const connection = () => {
    return conn;
}

//executing queries
const exeQuery = async (query, body = {}) => {
    //console.log('db.js', query, body);
    return new Promise(async (resolve, reject) => {
        try {
            conn.query(query, body, (error, results) => {
                if (error) {
                    console.log('query error', error.message);
                    reject(error.message);
                };
                //console.log(results);
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
    connection
};