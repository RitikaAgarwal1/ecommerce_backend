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
    return `INSERT INTO ${tableName} (${cols}) VALUES ?`
}

//for deleting data by id
const deleteById = (tableName) => {
    return `DELETE FROM ${tableName} WHERE id = ?`;
}

//for deleting selected data in bulk
const deleteBySelection = (tableName) => {
    return `DELETE FROM ${tableName} WHERE id IN (?)`
}

//for deleting all data from table
const deleteAllData = (tableName) => {
    return `DELETE FROM ${tableName}`
}

module.exports = {
    insertQuery,
    fetchAllData,
    insertBulkData,
    deleteById,
    deleteBySelection,
    deleteAllData
};