const express = require('express');
const router = new express.Router();
const { filterFromData, updateData } = require('../library/dbQuery');
const fs = require('fs');
const { exeQuery } = require('../library/db');
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

router.put('/updateByColName', async (req, res) => {
    try {
        const result = await exeQuery(updateData(req.body.tableName), [req.body.obj, req.body.key, req.body.value]);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;