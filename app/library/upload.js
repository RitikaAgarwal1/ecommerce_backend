const formidable = require('formidable');
const fs = require('fs');

const createBuffer = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let form = new formidable.IncomingForm();
            form.keepExtensions = true;
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log('error at form parsing', err);
                    reject({
                        error: 'Image could not be uploaded!'
                    });
                }
                if (files.file) {
                    const result = {
                        buffer: fs.readFileSync(files.file.path),
                        fileType: files.file.type
                    }
                    resolve(result);
                }

                if (files.pic) {
                    const result = {
                        fields,
                        pic: {
                            buffer: fs.readFileSync(files.pic.path),
                            fileType: files.pic.type
                        }
                    }
                    resolve(result);
                }
                resolve(result = {fields});
            })
        } catch (e) {
            console.log('catch error', e.message);
            reject(e.message);
        }
    });
};

module.exports = { createBuffer };