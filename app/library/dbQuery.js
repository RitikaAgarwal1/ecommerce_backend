//for inserting single data
const insertQuery = (tableName) =>{
    return `INSERT INTO ${tableName} SET?`;
}

//for fetching all data
const fetchAllData = (tableName) => {
    return `SELECT * FROM ${tableName}`;
}

//for inserting bulk data
const insertBulkData = (tableName, cols) => {
    return `INSERT INTO ${tableName} (${cols}) VALUES ?`;
}

//for deleting data by id
const deleteById = (tableName) => {
    return `DELETE FROM ${tableName} WHERE id = ?`;
}

//for deleting selected data in bulk
const deleteBySelection = (tableName) => {
    return `DELETE FROM ${tableName} WHERE id IN (?)`;
}

//for deleting all data from table
const deleteAllData = (tableName) => {
    return `DELETE FROM ${tableName}`;
}

//for fetching user details using email
const getUserByEmail = (tableName) => {
    return `SELECT * from ${tableName} WHERE email = ?`;
}

//for fetching user details using uuid
const getUserById = (tableName) => {
    return `SELECT * from ${tableName} WHERE uuid = ?`;
}

module.exports = {
    insertQuery,
    fetchAllData,
    insertBulkData,
    deleteById,
    deleteBySelection,
    deleteAllData,
    getUserByEmail,
    getUserById
};