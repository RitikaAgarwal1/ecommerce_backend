const express = require('express');
const uuidv1 = require('uuidv1');
const router = new express.Router();
const { registration, bulkDeleteValidate, signin } = require('../library/validation');
const fs = require('fs');
const { exeQuery } = require('../library/db');
const { insertQuery, fetchAllData, deleteById, deleteBySelection, fetchDataByKey, fetchDataWithLimit, updateData, fetchDataWithApproval, filterAdmins } = require('../library/dbQuery');
const jwt = require('jsonwebtoken');//to generate signed token
const { auth, isAuth } = require('../library/auth');
const { createBuffer } = require('../library/upload');

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
        if (userDetails[0].is_verified == 1 && userDetails[0].is_approved == 1) {
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
                res.cookie('access-token', token, { expiresIn: "20000" });
                const { uuid, first_name, last_name, email, user_role } = userDetails[0];
                res.json({
                    token, user: { uuid, first_name, last_name, email, user_role }
                })
            }
        } else {
            res.status(403).json({
                message: "You need to verify your email id or get approved by Admin"
            });
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
            buffer: body.buffer ? body.buffer : fs.readFileSync(__dirname + "/assets/avatar.png"),
            fileType: body.fileType ? body.fileType : 'image/png',
            is_verified: body.fields.is_verified? body.fields.is_verified : false,
            is_approved: body.fields.is_verified? true : false,
            verify_token: body.fields.is_verified? 'none' : uuidv1()
        };

        console.log('line99', body);

        if (body.user_role == 'USER') body.is_approved = true;

        console.log('body', body);
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

// for verifying email id after registration
router.get('/verify-email', async (req, res) => {
    try {
        const user = await exeQuery(fetchDataByKey('users'), ['verify_token', req.query.token]);
        if (user.length == 0) return res.status(404).send({ Message: 'Token is invalid. Please contact us for assistance.' });
        if (user[0].verify_token === 'none') return res.status(403).send({ Message: 'Token has expired.' });
        const obj = {
            verify_token: 'none',
            is_verified: true
        }
        const resp = await exeQuery(updateData('users'), [obj, 'uuid', user[0].uuid]);
        console.log(resp);
        res.send({ Message: 'Congratulations! Email id got verified. You may now log in.' })
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
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

//for fetching data based on user role and approval status
router.get('/userByApproval', async (req, res) => {
    try{
        const result = await exeQuery(fetchDataWithApproval(req.query.order), [req.query.user_role, req.query.approval_status, Number(req.query.limit), Number(req.query.offset)]);
        console.log(result);
        res.send(result);
    } catch(error){
        console.log(error);
        res.status(500).send(error);
    }
});

//for fetching admin details
router.get('/filterAdminData', async (req, res) => {
    try {
        console.log(req.query);
        const result = await exeQuery(filterAdmins(), [`%${req.query.value}%`, Number(req.query.approval_status)]);
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