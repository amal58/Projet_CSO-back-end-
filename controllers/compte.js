const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/compte.js")
const { response } = require("../app.js")
exports.signup = (req,res,next)=>{
    bcrypt
    .hash(req.body.password, 10)
    .then((hash)=>{
        const user = new User({
            email :req.body.email,
            password: hash,
            role :req.body.role, 
        });
        user
        .save()
        .then((response) => {
            const newUser = response.toPublic();
            delete newUser.password
            res.status(201).json({
                user: newUser,
                message: "utilisateur crée !",
            })
        })
        .catch((error=> res.status(400).json({error:error.message})))
    })
    .catch((error)=> res.status(500).json({error:error.message}))

}
exports.login = (req,res,next)=>{
    User.findOne({email: req.body.email})
    .then((user) => {
        if(!user){
            return res
            .status(401)
            .json({message: "Login ou mot de passe incorrect"})
        }
        bcrypt 
        .compare(req.body.password, user.password)
        .then((valide)=>{
            if (!valide){
                return res 
                    .status(401)
                    .json({message:"Login ou mot de passe incorrect"})
            }
            res.status(200).json({
                token:jwt.sign({userId:user._id},"RANDOM_TOKEN_SECRET",{
                    expiresIn:"24h",
                }),
            })


        })
        .catch((error) => res.status(500).json({error:error.message}))
     })
        
    
}

