const express = require('express');
const router = new express.Router();
const { validate, ValidationError } = require('express-validation');
const { productValidate, bulkProductValidate, bulkDeleteValidate } = require('../library/validation');
const { exeQuery, getConnection } = require('../library/db');
const { insertQuery, fetchAllData, insertBulkData, deleteById, deleteBySelection } = require('../library/dbQuery');

//for adding product details
router.post('/addProduct', validate(productValidate, {}, {}), async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        const body = {
            title: req.body.title,
            price: req.body.price,
            quantity: req.body.quantity,
            availiblity: req.body.availiblity,
            is_new: req.body.is_new,
            color: req.body.color,
            seller_id: req.body.seller_id,
            offer: req.body.offer,
            shipping_price: req.body.shipping_price,
            category: req.body.category,
            detail: req.body.detail,
            brand: req.body.brand,
            size: req.body.size
        };
        const result = await exeQuery(insertQuery('products'), body);
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

//for fetching product details
router.get('/productDetails', async (req, res) => {
    try {
        const result = await exeQuery(fetchAllData('products'));
        console.log(result);
        res.send(result);
    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

//for adding multiple product details
router.post('/addBulkProduct', validate(bulkProductValidate, {}, {}), async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {

        const model = { title: null, price: null, quantity: null, availiblity: null, is_new: null, color: null, seller_id: null, offer: null, shipping_price: null, category: null, detail: null, brand: null, size: null };

        let reqBody = req.body.map(e => {
            const reqData = Object.assign(model, e);
            return Object.values(reqData);
        });

        const result = await exeQuery(insertBulkData('products', Object.keys(model).join(', ')), [reqBody]);
        console.log('result', result);
        res.status(200).send({
            message: `Successfully posted ${result.affectedRows} rows!`,
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

//for deleting single product by id
router.delete('/deleteProduct', async (req, res) => {
    if (!req.query.id) {
        res.status(404).send({
            Error: 'Id is required!'
        });
    }
    try {
        let response = await exeQuery(deleteById('products'), [req.query.id]);
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

//for deleting multiple products on selection
router.delete('/deleteBulkProducts', validate(bulkDeleteValidate, {}, {}), async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        const result = await exeQuery(deleteBySelection('products'), [req.body.ids]);
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