const express = require('express');
const router = new express.Router();
const { productValidate, bulkProductValidate, bulkDeleteValidate } = require('../library/validation');
const { exeQuery } = require('../library/db');
const { insertQuery, fetchAllData, insertBulkData, deleteById, deleteBySelection, fetchDataByKey } = require('../library/dbQuery');
const { createBuffer } = require('../library/upload');
const { auth, isAuth } = require('../library/auth');

//for adding product details
router.post('/addProduct', async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        let body = await createBuffer(req);

        body = {
            title: body.fields.title,
            price: body.fields.price,
            quantity: body.fields.quantity,
            availiblity: body.fields.availiblity,
            created_on: new Date(),
            color: body.fields.color,
            seller_id: body.fields.seller_id,
            offer: body.fields.offer,
            shipping_price: body.fields.shipping_price,
            category: body.fields.category,
            detail: body.fields.detail,
            brand: body.fields.brand,
            size: body.fields.size,
            buffer: body.buffer,
            fileType: body.fileType
        };
        await productValidate.validateAsync(body);

        const result = await exeQuery(insertQuery('products'), body);
        console.log(result);
        res.status(200).send({
            message: 'Successfully posted!',
            data: body
        });
    } catch (err) {
        if (err.isJoi) {
            return res.status(422).json({
                Error: err.details[0].message
            });
        } else {
            console.log(err);
            return res.status(500).json({
                Error: err
            });
        }
    };
});

//for adding multiple product details
router.post('/addBulkProduct', async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        const model = { title: null, price: null, quantity: null, availiblity: null, created_on: new Date(), color: null, seller_id: null, offer: null, shipping_price: null, category: null, detail: null, brand: null, size: null, pic:null };

        let reqBody = req.body.map(e => {
            const reqData = Object.assign(model, e);
            return Object.values(reqData);
        });

        await bulkProductValidate.validateAsync(req.body);

        const result = await exeQuery(insertBulkData('products', Object.keys(model).join(', ')), [reqBody]);
        console.log('result', result);
        res.status(200).send({
            message: `Successfully posted ${result.affectedRows} rows!`,
            data: req.body
        });
    } catch (err) {
        if (err.isJoi) {
            console.log(err);
            return res.status(422).json({
                Error: err.details[0].message
            });
        } else {
            console.log(err);
            return res.status(500).json({
                Error: err
            });
        }
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
router.delete('/deleteBulkProducts', async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        await bulkDeleteValidate.validateAsync(req.body);
        const result = await exeQuery(deleteBySelection('products'), [req.body.ids]);
        console.log('result', result);
        res.send({
            message: `Successfully deleted ids ${req.body.ids.join(', ')}`
        });
    } catch (e) {
        if (e.isJoi) {
            return res.status(422).json({
                Error: e.details[0].message
            });
        } else {
            console.log(e);
            return res.status(500).json({
                Error: e.details[0].message
            });
        }
    };
});

//for fetching products by user uuid
router.get('/productBykey', async (req, res) => {
    try {
        const result = await exeQuery(fetchDataByKey('products'), [req.query.field, req.query.value]);
        return res.send(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            Error: e
        });
    }
});

module.exports = router;