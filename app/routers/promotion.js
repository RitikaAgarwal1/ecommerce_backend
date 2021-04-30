const express = require('express');
const router = new express.Router();
const { validate, ValidationError } = require('express-validation');
const { bannerValidate } = require('../library/validation');
const { exeQuery } = require('../library/db');
const { insertQuery, fetchAllData, deleteAllData } = require('../library/dbQuery');

//for adding banner image
router.post('/addBanner', validate(bannerValidate, {}, {}), async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        const body = {
            banner: req.body.banner
        };
        const result = await exeQuery(insertQuery('promotion'), body);
        console.log(result);
        res.status(200).send({
            message: 'Successfully added banner!',
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

//for fetching banner details
router.get('/bannerDetails', async (req, res) => {
    try {
        const result = await exeQuery(fetchAllData('promotion'));
        console.log(result);
        res.send(result);
    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

//for deleting banner
router.delete('/deleteBanner', async (req, res) => {
    try {
        const result = await exeQuery(deleteAllData('promotion'));
        console.log(result);
        res.send(result);
    } catch (e){
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});