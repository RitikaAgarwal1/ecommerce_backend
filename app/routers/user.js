const express = require('express');
const uuidv1 = require('uuidv1');
const router = new express.Router();
const { registration, bulkDeleteValidate, signin } = require('../library/validation');
const fs = require('fs');
const { exeQuery, getConnection } = require('../library/db');
const { insertQuery, fetchAllData, deleteById, deleteBySelection, getUserByEmail, getUserById } = require('../library/dbQuery');
const jwt = require('jsonwebtoken');//to generate signed token
const {auth, isAuth, isAdmin} = require('../library/auth');

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
        await signin.validateAsync(req.body);
        const emailid = req.body.email;
        const password = req.body.password;
        const userDetails = await exeQuery(getUserByEmail('users'), emailid);
        if (userDetails.length == 0) {
            res.status(400).json({
                Error: "User with this email does not exist. Kindly register yourself"
            });
        } else if (userDetails[0].pwd != password) {
            res.status(401).json({
                Error: "Email and password doesnt match!"
            });
        } else {
            const token = jwt.sign({ _id: userDetails.uuid }, process.env.JWT_SECRET);
            res.cookie('access-token', token, { expire: new Date() + 9999 });
            console.log('userDetails', userDetails[0].pwd == password);
            const { uuid, first_name, last_name, email, user_role } = userDetails[0];
            res.json({
                token, userDetails: { uuid, first_name, last_name, email, user_role }
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
        const body = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            pwd: req.body.pwd,
            address: req.body.address,
            user_role: req.body.user_role,
            created_on: new Date(),
            company_name: req.body.company_name,
            uuid: uuidv1(),
            pic: req.body.pic ? req.body.pic : fs.readFileSync(__dirname + "/assets/avatar.png")
        };
        await registration.validateAsync(body);

        const result = await exeQuery(insertQuery('users'), body);
        console.log(result);
        res.status(200).send({
            message: 'Successfully posted!',
            data: req.body
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
router.get('/userById/:userId', auth, isAuth, isAdmin, async (req, res) => {
    try {
        const result = await exeQuery(getUserById('users'), req.params.userId);
        req.profile = result[0];
        res.json({
            user: req.profile
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            Error: e
        });
    }
});

module.exports = router;