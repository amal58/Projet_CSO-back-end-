const jwt = require("jsonwebtoken")
const User = require('../models/compte.js');

const { response } = require("../app");
module.exports.loggedMiddleware = (req, res, next) => {
  try {
    //split:convertir chaine en table
    const token = req.headers.authorization.split(" ")[1]
    //mch yarja3 ml cryptage w ya3tini id mta3 user
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET")
    const userId = decodedToken.userId
    console.log('userId: ', userId);
    User.findOne({ _id: userId }).then((response)=>{
        if(response){
          req.auth = {
            userId: userId,
            role: response.role// role from findone
          }
          next()
        }else{
          res.status(401).json({error:"user doesn't exist"})
        }
    })
    .catch((error)=>{
      res.status(500).json({error: error.message})

    })
    
  } catch (error) {
    res.status(401).json({error: error.message})
  }
}
module.exports.isadmin = (req, res, next)=>{
    try{
      if(req.auth.role=="admin"){
        next()
      }
      else{
        res.status(403).json({error:"no access to this route"})
      }
      
    }catch{
      res.status(401).json({error:error.message})
    }
  }

  module.exports.validateSignup = validateSignup;

