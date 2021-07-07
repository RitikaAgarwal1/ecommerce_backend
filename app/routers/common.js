const express = require('express');
const router = new express.Router();
const { filterFromData, updateData, fetchDataWithLimit, fetchDataByKey, fetchAllData } = require('../library/dbQuery');
const fs = require('fs');
const { exeQuery } = require('../library/db');
const { createBuffer } = require('../library/upload');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//for saving images in a folder
// const fs = require('fs');
// const path = require('path');

// const directory = 'test';

// fs.readdir(directory, (err, files) => {
//   if (err) throw err;

//   for (const file of files) {
//     fs.unlink(path.join(directory, file), err => {
//       if (err) throw err;
//     });
//   }
// });

//for fetching details
router.get('/filterData', async (req, res) => {
    try {
        const result = await exeQuery(filterFromData(req.query.tableName), [req.query.key, `%${req.query.value}%`]);
        console.log(result);
        res.send(result);
    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

//method for sending email template
router.post('/sendMail', (req, res) => {
    const msg = {
        to: req.body.email,
        from: 'contact.ritikaagarwal@gmail.com',
        subject: req.body.subject,
        text: 'Sent from send grid',
        html: req.body.content
    };
    (async () => {
        try {
            const response = await sgMail.send(msg);
            res.send(response);
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body);
                res.send(error.response.body);
            }
        }
    })();
});

//update columns
router.put('/updateByColName', async (req, res) => {
    try {
        const result = await exeQuery(updateData(req.body.tableName), [req.body.obj, req.body.key, req.body.value]);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//update image
router.put('/updateImage', async (req, res) => {
    try {
        let body = await createBuffer(req);
        const obj = {
            "buffer": body.buffer,
            "fileType": body.fileType
        }
        const result = await exeQuery(updateData(body.fields.tableName), [obj, body.fields.key, body.fields.value]);
        //console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//for fetching all details
router.get('/details', async (req, res) => {
    try {
        if (Object.keys(req.query).length != 1) {
            if (req.query.limit) {
                const result = await exeQuery(fetchDataWithLimit(req.query.tableName, req.query.order), [req.query.field, req.query.value, req.query.order_by, Number(req.query.limit), Number(req.query.offset)]);
                res.send(result);
            } else {
                const result = await exeQuery(fetchDataByKey(req.query.tableName), [req.query.field, req.query.value]);
                res.send(result);
            }
        } else if(Object.keys(req.query).length == 1){
            const result = await exeQuery(fetchAllData(req.query.tableName));
            res.send(result);
        }
    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

//for fetching product image by id
router.get('/imageByid', async (req, res) => {
    try {
        const result = await exeQuery(fetchDataByKey(req.query.tableName), [req.query.field, req.query.value]);
        console.log(result);
        res.set('Content-Type', result[0].fileType);
        res.send(result[0].buffer);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            Error: e
        });
    }
});

module.exports = router;