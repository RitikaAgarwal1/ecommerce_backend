const expressJwt = require('express-jwt');//for authentication check

exports.auth = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
});

exports.isAuth = (req, res) => {
    let user = req.profile && req.auth && req.profile.uuid == req.auth.uuid;
    console.log('profile', req.profile);
    console.log('22', req.auth.uuid);
    console.log(req.auth);
    if (!user){
        return res.status(403).json({
            Error: "Access Denied!"
        })
    }
};

exports.isAdmin = (req, res) => {
   if (req.profile.user_role === 'USER'){
       return res.status(403).json({
           Error: "Only Admins have access"
       })
   }
};