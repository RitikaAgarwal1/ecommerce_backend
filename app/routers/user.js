const express = require('express');
const router = new express.Router();
const { validate, ValidationError } = require('express-validation');
const { registration, bulkDeleteValidate } = require('../library/validation');
const { exeQuery, getConnection } = require('../library/db');
const { insertQuery, fetchAllData, deleteById, deleteBySelection } = require('../library/dbQuery');

//for registering new user or admin
router.post('/register', validate(registration, {}, {}), async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        const body = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            pwd: req.body.password,
            address: req.body.address,
            user_role: req.body.user_role,
            created_on: new Date(),
            company_name: req.body.company_name,
            uuid: req.body.uuid
        };
        const result = await exeQuery(insertQuery('users'), body);
        console.log(result);
        res.status(200).send({
            message: 'Successfully posted!',
            data: req.body
        });
    } catch (err) {
        if (err instanceof ValidationError) {
            console.log(err);
            return res.status(err.statusCode).json(err)
        }
        console.log(err);
        return res.status(500).json(err)
    };
});

//for fetching user details
router.get('/userDetails', async (req, res) => {
    try {
        const result = await exeQuery(fetchAllData('users'));
        console.log(result);
        res.send(result);
    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

//for deleteing user by id
router.delete('/deleteUser', async (req, res) => {
    if (!req.query.id) {
        res.status(404).send({
            Error: 'Id is required!'
        });
    }
    try {
        let response = await exeQuery(deleteById('users'), [req.query.id]);
        console.log(response);
        res.send({
            message: `Successfully deleted!`
        });
    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

//for deleting multiple users on selection
router.delete('/deleteBulkUsers', validate(bulkDeleteValidate, {}, {}), async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        const result = await exeQuery(deleteBySelection('users'), [req.body.ids]);
        console.log('result', result);
        res.send({
            message: `Successfully deleted ids ${req.body.ids.join(', ')}`
        });
    } catch (e) {
        if (err instanceof ValidationError) {
            console.log(err);
            return res.status(err.statusCode).json(err)
        }
        console.log(err);
        return res.status(500).json(err)
    };
});

module.exports = router;