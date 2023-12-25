const jwt = require("jsonwebtoken")
const Choriste = require('../models/choriste.js');

const { response } = require("../app.js");
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
  async function getUserIdFromRequest(req) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return null; // Token manquant dans l'en-tête Authorization
    }

    const token = authorizationHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        console.log('Token extrait:', token);
        console.log('Contenu du jeton décodé :', decoded);

        // Assurez-vous que le token correspond à un choriste existant dans la base de données
        const choriste = await Choriste.findOne({ _id: decoded.existUser });
        console.log('Le choriste associé au token :', choriste);

        if (!choriste) {
            return null; // Le choriste associé au token n'existe pas
        }

        return decoded.existUser; // Retourne l'ID du compte
    } catch (error) {
        return null; // La vérification du token a échoué, retourne null ou gère l'erreur selon vos besoins
    }
}


  module.exports.getUserIdFromRequest = getUserIdFromRequest;

