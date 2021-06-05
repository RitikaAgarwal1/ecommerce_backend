const express = require('express');
const router = new express.Router();
const {filterFromData} = require('../library/dbQuery');
const { exeQuery } = require('../library/db');

//for fetching product details
router.get('/filterData', async (req, res) => {
    try {
        const result = await exeQuery(filterFromData(req.query.tableName), [`%${req.query.value}%`]);
        console.log(result);
        res.send(result);
    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

module.exports = router;