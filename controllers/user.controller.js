const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const redis_client = require('../redis_connect');

async function Register(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    try{
        const saved_user = await user.save();
        res.json({status: true, message: "Registered Successfully", data: saved_user});
    }catch(err){
        res.json({status: false, message: "Something went wrong", data: err});
    }
}

async function Login(req, res){
    const username = req.body.username;
    const password = req.body.password;

    try{
        const user = await User.findOne({
            username: username,
            password: password
        }).exec();
        if(user == null){
            return res.status(401).json({status: false, message: "login failed.."});
        }
        const access_token = jwt.sign({sub:user._id}, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_TIME});
        const refresh_token = GenerateRefreshToken(user._id);
        return res.json({status: true,message: "login success..",data: {access_token, refresh_token}});
    }catch(err){
        return res.json({status: true,message: "login failed.."});
    }
}

function GetAccessToken(req, res){
    const user_id = req.userData.sub;
    const access_token = jwt.sign({sub:user_id}, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_TIME});
    const refresh_token = GenerateRefreshToken(user_id);
    return res.json({status: true,message: "success",data: {access_token, refresh_token}});
}

async function Logout(req, res){
    const user_id = req.userData.sub;
    const token = req.token;
    await redis_client.del(user_id.toString());
    await redis_client.set('BL_' + user_id.toString(), token));
    return res.json({status: true, message: "Success"});
};

function GenerateRefreshToken(user_id){
    const refresh_token = jwt.sign({sub:user_id}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_TIME});
    redis_client.get(user_id.toString(), (err, data) => {
        if(err) throw err;
        redis_client.set(user_id.toString(), JSON.parse({token: refresh_token}));
    });
    return refresh_token;
}

module.exports = {
    Register,
    Login,
    GetAccessToken,
    Logout
}