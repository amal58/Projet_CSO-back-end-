const mongoose = require('mongoose');
const Choriste = require('../models/choriste');
const personne = require('../models/personne');
const jwt=require ("jsonwebtoken")
const bcrypt = require ("bcryptjs");
const { log } = require('console');

exports.login= async (req,res,next)=>{
    try{
        const email=req.body.email
        const existChoriste= await Choriste.findOne({ login: email })
        const existUser= await personne.findOne({ email: email })
        if(!existChoriste && !existUser){
             return res.status(401).json({message:"user not found"})
        }
        if(existUser){
          const existPassword=await Choriste.findOne({candidatId:existUser._id})
          const password= await bcrypt.compare(req.body.password, existPassword.password)
          if(password){
           return  res.status(200).json({
                user:existPassword,
                token: jwt.sign({ existUser: existPassword._id,role:existPassword.role}, "RANDOM_TOKEN_SECRET", {
                    expiresIn: "24h"
                }),
            });
          }else{
                 return res.status(400).json({message:"invalid password"})
          }}
        else if(existChoriste){
            const password=await bcrypt.compare(req.body.password, existChoriste.password)
            console.log(password);
            if(password){
             return  res.status(200).json({
              user:existChoriste,
                  token: jwt.sign({ existChoriste: existChoriste._id ,role:existChoriste.role}, "RANDOM_TOKEN_SECRET", {
                      expiresIn: "24h"
                  }),
              });
            }else{
                   return res.status(400).json({message:"failed to login"})
            }
          }
    }catch(error){
        console.log(error)
    return res.status(400).json({message:"failed!!!!!"})
    }
    }
    
exports.AjoutChoriste = async (req, res) => {
  try {
    const choriste = new Choriste(req.body);
    await choriste.validate();

    await choriste.save();

    res.status(201).json({
      model: Choriste,
      message: "Choriste créée !",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = {};

      for (const field in error.errors) {
        if (error.errors.hasOwnProperty(field)) {
          validationErrors[field] = error.errors[field].message;
        }
      }

      res.status(400).json({
        error: "Erreur de validation",
        validationErrors,
      });
    } else {
      console.error("Erreur lors de la création de choriste :", error.message);
      res.status(500).json({
        error: "Erreur lors de la création de choriste",
      });
    }
  }
};



