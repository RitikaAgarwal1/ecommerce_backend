const express = require('express');
const uuidv1 = require('uuidv1');
const router = new express.Router();
const { registration, bulkDeleteValidate, signin } = require('../library/validation');
const fs = require('fs');
const { exeQuery, getConnection } = require('../library/db');
const { insertQuery, fetchAllData, deleteById, deleteBySelection, fetchDataByKey } = require('../library/dbQuery');
const jwt = require('jsonwebtoken');//to generate signed token
const { auth, isAuth } = require('../library/auth');
const { createBuffer } = require('../library/upload');

let userDetails;

//for signing out
router.get('/signout', async (req, res) => {
    res.clearCookie('access-token');
    res.json({
        message: "You have successfully logged out"
    });
});

//for user sign in
router.post('/signin', async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Credentials are required!'
        });
    }
    try {
        console.log(req.body);
        await signin.validateAsync(req.body);
        const emailid = req.body.email;
        const password = req.body.password;
        const userDetails = await exeQuery(fetchDataByKey('users'), ['email', emailid]);
        if (userDetails.length == 0) {
            res.status(400).json({
                Error: "User with this email does not exist. Kindly register yourself"
            });
        } else if (userDetails[0].pwd != password) {
            res.status(401).json({
                Error: "Email and password doesnt match!"
            });
        } else {
            const token = jwt.sign({ _id: userDetails[0].uuid }, process.env.JWT_SECRET);
            res.cookie('access-token', token, { expire: new Date() + 9999 });
            const { uuid, first_name, last_name, email, user_role } = userDetails[0];
            res.json({
                token, user: { uuid, first_name, last_name, email, user_role }
            })
        }

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
    }

});

//for registering new user or admin
router.post('/register', async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        let body = await createBuffer(req);
        let bufferpic = body.pic ? body.pic.buffer : fs.readFileSync(__dirname + "/assets/avatar.png");
        let filetype = body.pic ? body.pic.fileType : 'image/png';

        body = {
            first_name: body.fields.first_name,
            last_name: body.fields.last_name,
            phone: body.fields.phone,
            email: body.fields.email,
            pwd: body.fields.pwd,
            address: body.fields.address,
            user_role: body.fields.user_role,
            created_on: new Date(),
            company_name: body.fields.company_name,
            uuid: uuidv1(),
            pic: JSON.stringify({ buffer: bufferpic, fileType: filetype })
        };

        console.log(body);
        await registration.validateAsync(body);

        const result = await exeQuery(insertQuery('users'), body);
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

//for fetching user details
router.get('/userDetails', async (req, res) => {
    try {
        if (Object.keys(req.query).length!= 0) {
            const result = await exeQuery(fetchDataByKey('users'), [req.query.field, req.query.value]);
            res.send(result);
        } else {
            const result = await exeQuery(fetchAllData('users'));
            res.send(result);
        }
    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

//for deleting user by id
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
router.delete('/deleteBulkUsers', async (req, res) => {
    if (!req.body) {
        res.status(404).send({
            Error: 'Payload is required!'
        });
    }
    try {
        await bulkDeleteValidate.validateAsync(req.body);
        const result = await exeQuery(deleteBySelection('users'), [req.body.ids]);
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
                Error: e
            });
        }
    };
});

//for fetching users by uuid
router.get('/userById/:userId', auth, isAuth, async (req, res) => {
    try {
        const result = await exeQuery(fetchDataByKey('users'), ['uuid', req.params.userId]);
        //console.log(result[0]);
        if (result) req.profile = result[0];
        //console.log(JSON.parse(result[0].pic));
        return res.json({
            user: req.profile
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            Error: e
        });
    }
});

//for fetching users by uuid
router.get('/userImageByUuid', async (req, res) => {
    try {
        const result = await exeQuery(fetchDataByKey('users'), [req.query.field, req.query.value]);
        res.set('Content-Type', JSON.parse(result[0].pic).fileType);
        res.send(JSON.parse(result[0].pic).buffer);
        //console.log(JSON.parse(result[0].pic).fileType);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            Error: e
        });
    }
});

module.exports = router;