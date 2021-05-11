const expressJwt = require('express-jwt');//for authentication check

exports.auth = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    let user = req.auth && req.params.userId == req.auth._id;
    if (!user){
        return res.status(403).json({
            Error: "Access Denied!"
        })
    }
    next();
};