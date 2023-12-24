const mongoose = require('mongoose');
const Choriste = require('../models/choriste');
const Audition = require('../models/audition');
const audition = require('../models/candidatAudition');
const personne = require('../models/personne');
const jwt=require ("jsonwebtoken")
const bcrypt = require ("bcryptjs")

////////////get all choriste (role=choriste)
exports.GetAllChoristes = async (req, res) => {
    try {
      const tab = [];
      const allChoristes = await Choriste.find({role:"choriste"}).populate('candidatId');
      for (const elem of allChoristes) {
        const existAudition = await Audition.findOne({
          candidat: elem.candidatId._id
        });
        if (existAudition) {
          const existAuditionDetail = await audition.findOne({
            audition: existAudition._id
          });
          console.log(existAuditionDetail);
          tab.push({elem,existAuditionDetail});
        }
      }
      console.log(tab);
      res.status(200).json({ message: "extraction avec succes", resultat: tab });
    } catch (e) {
      console.error(e);
      res.status(400).json(e);
    }
  };
  
//login choriste
exports.login= async (req,res,next)=>{
try{
    const email=req.body.email
    const existChoriste= await Choriste.findOne({ login: email })
    console.log(existChoriste)
    const existUser= await personne.findOne({ email: email })
    console.log(existUser)
    const existPassword=await Choriste.findOne({candidatId:existUser._id})
    

    if(!existChoriste && !existUser){
         return res.status(401).json({message:"user not found"})
    }
    if(existUser){
      const password= await bcrypt.compare(req.body.password, existPassword.password)
      if(password){
       return  res.status(200).json({
            token: jwt.sign({ existUser: existUser._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h"
            }),
        });

      }else{
             return res.status(400).json({message:"failed to login"})
      }
    }
    if(existChoriste){
        const password=await bcrypt.compare(req.body.password, existChoriste.password)
        if(password){
         return  res.status(200).json({
              token: jwt.sign({ existChoriste: existChoriste._id }, "RANDOM_TOKEN_SECRET", {
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


// modifier tessiture

// exports.modifier_tessiture = async (req, res) => {
//     try {
//       const idChoriste = req.params.id;
//       const nouvelleTessiture = req.body.tessiture; 
//       const existChoriste= await Choriste.findById(idChoriste)
//       if (!existChoriste) {
//         return res.status(404).json({ success: false, message: 'choriste non trouvé.'});
//       }
//       if (Choriste.role !== 'choriste') {
//         return res.status(403).json({ success: false, message: 'L\'utilisateur n\'a pas le rôle de choriste.' });
//       }
//       Choriste.tessiture= nouvelleTessiture;
//       await Choriste.save();
  
//       return res.status(200).json({ success: true, message: 'Utilisateur mis à jour avec succès.', Choriste});
//     } catch (error) {
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   };


exports.modifier_tessiture = async (req, res) => {
try{
    const idChoriste = req.params.id;
    const tessiture = req.body.tessiture; 
    const existChoriste= await Choriste.findById(idChoriste)
    const existAudition= await Audition.findOne({candidat:existChoriste.candidatId})
    const existaudition= await audition.findOne({audition:existAudition._id})
     if(existaudition){
         const fetchtes =await audition.findByIdAndUpdate({ _id:existaudition._id},{tessiture:tessiture},{new:true})
          return res.status(200).json({message:"tessiture modifier", res:fetchtes})

    }else{
        return res.json("error")
    }
}catch(error){
    console.log(error)
    res.status(400).json(error)
}


}










