const jwt = require('jsonwebtoken');

const redis_client = require('../redis_connect');

function verifyToken(req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        req.userData = decoded;
        req.token = token;
        redis_client.get('BL_' + decode.sub.toString(), (err, data) => {
            if(err) throw err;
            if(data === token) return res.status(401).json({status: false, message: "Blacklisted token"});
            next();
        })
    }catch(err){
        return res.status(401).json({status: true, message: "Invalid session", data: err});
    }
};

function verifyRefreshToken(req, res, next){
    const token = req.body.token;
    if(token === null){
        return res.status(401).json({status: true, message: "Invalid Token"});
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        req.userData = decoded;
        redis_client.get(decode.sub.toString(), (err, data) => {
            if(err) throw err;
            if(data === null) return res.status(401).json({status: false, message: "Invalid Token"});
            if(JSON.parse(data).token != token){
                return res.status(401).json({status: true, message: "Invalid Token"});
            }
            next();
        });
    }catch(err){
        return res.status(401).json({status: true, message: "Invalid session", data: err});
    }
};

module.exports = {
    verifyToken,
    verifyRefreshToken
}