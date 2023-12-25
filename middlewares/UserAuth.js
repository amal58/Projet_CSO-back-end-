const jwt = require("jsonwebtoken");
const Choriste = require('../models/choriste');

exports.loggedMiddleware = function (req,res,next){
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).send('you dont have access to this route');
    try {
    jwt.verify(authHeader, "RANDOM_TOKEN_SECRET",(err,user)=>{
if(err) return res.status(403).json(err)
req.user = user;
        next();
        });
    } catch (error) {
      console.log(error);
      return res.status(401).send('Invalid Token') ;
    }}













