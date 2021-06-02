require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONN_STRING, ()=>{
    console.log("Connected to DB");
});

app.use(express.json());

const auth_routes = require('./routes/auth.route');
const user_routes = require('./routes/user.route');

app.use('/v1/auth', auth_routes);
app.use('/v1/user', user_routes);

app.get('/dashboard', verifyToken, (req, res) => {
    return res.json({status: true, message: "Hello from Dashboard"});
});

app.listen(3000, () => console.log("Server is listening..."))