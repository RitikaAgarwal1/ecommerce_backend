//for inserting single data
const insertQuery = (tableName) =>{
    return `INSERT INTO ${tableName} SET?`;
}

//for fetching all data
const fetchAllData = (tableName) => {
    return `SELECT * FROM ${tableName}`;
}

//for fetching all data based on column name
const fetchDataByKey = (tableName) => {
    return `SELECT * FROM ${tableName} WHERE ?? = ?`;
}

//for fetching all data based on column name and limit
const fetchDataWithLimit = (tableName, order) => {
    return `SELECT * FROM ${tableName} WHERE ?? = ? ORDER BY ?? ${order} LIMIT ? OFFSET ?`
}

//for fetching users data based on column name, limit and approved status
const fetchDataWithApproval = (order) => {
    return `SELECT * FROM users WHERE user_role = ? AND is_approved = ? ORDER BY company_name ${order} LIMIT ? OFFSET ?`
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

//for filtering or searching data
const filterFromData = (tableName) => {
    return `SELECT * from ${tableName} WHERE ?? LIKE ?`;
}

//for filtering or searching data in users table
const filterAdmins = () => {
    return `SELECT * from users WHERE company_name LIKE ? AND is_approved = ?`;
}

//for updating data
const updateData = (tableName) => {
    return `UPDATE ${tableName} SET ? WHERE ?? = ?`;
}

//for deleting column
const deleteCol = (tableName) => {
    return `ALTER TABLE ${tableName} DROP COLUMN ?? WHERE ?? =?`;
}

//for deleting user and products together
const deleteUserAndProducts = () => {
    return `call deleteUserDetails(?)`;
}

module.exports = {
    insertQuery,
    fetchAllData,
    insertBulkData,
    deleteById,
    deleteBySelection,
    deleteAllData,
    fetchDataByKey,
    fetchDataWithLimit,
    filterFromData,
    updateData,
    deleteCol,
    fetchDataWithApproval,
    filterAdmins,
    deleteUserAndProducts
};