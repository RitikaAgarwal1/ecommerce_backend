const express = require('express');
const router = new express.Router();
const { validate, ValidationError } = require('express-validation');
const { exeQuery } = require('../library/db');
const { insertQuery, fetchAllData, deleteAllData } = require('../library/dbQuery');
const { createBuffer } = require('../library/upload');


// //for saving file in public folder

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'app/public')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({ storage: storage }).single('file')

// router.post('/upload', function (req, res) {

//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             console.log('27', err);
//             return res.status(500).json(err)
//         } else if (err) {
//             console.log('30', err);
//             return res.status(500).json(err)
//         }
//         console.log('upload file', req.file);
//         return res.status(200).send(req.file)
//     })
// });

//for getting buffer of files

// router.post('/advertisement', async(req, res) => {
//     console.log('ad', req.files, req.file);
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     form.parse(req, (err, fields, files) => {
//         if(err){
//             console.log('error  at form parsing', err);
//             return res.status(400).json({
//                 error: 'Image could not be uploaded!'
//             });
//         }
//         if(files.file){
//             const data = fs.readFileSync(files.file.path);
//             const photoType = files.file.type;
//             console.log('data', data, photoType);
//         }
//     })
// });

//for adding banner image
router.post('/addBanner', async (req, res) => {
    try {
        const body = await createBuffer(req);
        const result = await exeQuery(insertQuery('promotion'), body);
        console.log(result);
        res.status(200).send({
            message: 'Successfully added banner!'
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
        if (result.length > 0) {
            res.set('Content-Type', result[0].fileType);
            res.send(result[0].buffer);
        } else {
            res.send({
                message: "No data!"
            });
        }
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
        if (result.affectedRows >= 0) {
            res.send({
                message: "There is no image for deleting!"
            });
        } else {
            res.send({
                message: "Banner successfully deleted!"
            });
        }

    } catch (e) {
        console.log('error', e);
        res.status(500).send({
            Error: e.message
        });
    }
});

module.exports = router;