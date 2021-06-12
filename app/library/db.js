const mysql = require('mysql');

const conn = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DB,
    password: process.env.PASSWORD,
    connectionLimit: 200
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

//updating queries
const updateQuery = async (obj) => {
    return new Promise(async (reslove, reject) => {
        try {
            let objKeys = Object.keys(obj);
            let maxLength = objKeys.length;
            let query = ``;
            for (let i = 0; i < maxLength; i++) {
                query += `"${objKeys[i]}" = ? `;
                if (i != maxLength - 1) query += ', ';
            };
            reslove([query, Object.values(obj)]);
        } catch (err) {
            reject(err)
        }
    });
}

module.exports = {
    exeQuery,
    connection,
    updateQuery
};