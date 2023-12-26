var path = require('path');
const schedule = require('node-schedule');
const Choriste = require('../models/choriste');
const Conge= require('../models/conge');

const io = require('socket.io');


exports.AjouterConge = async (req, res) =>{
    try{
  
        const conge = new Conge({
            dateDebutConge: req.body.dateDebutConge,
            dateFinConge: req.body.dateFinConge,
            etat: req.body.etat,
            choriste: req.params.id
        })
       const resultat = await  conge.save();

       const choriste=  await Choriste.findById({_id: req.params.id}).populate("candidatId")
       if(resultat){
            io.emit("new_notification",`vous avez une nouvelle congée de ${choriste.candidatId.nom} ${choriste.candidatId.prenom}`)
    }
  
    res.status(200).json({
        message: "bien retourner",
        response: resultat
    })
}
    catch(e){
console.log(e);
    }
}





 
    // schedule.scheduleJob('* * * * *', async()=>{
 
    //  try {
    //      const tab = [];
    //      const existcongee =  await Conge.find({enConge: false}).populate("Choriste") ;
    //  console.log(existcongee);
    //  socket.emit("list",existcongee)
         
    //  } catch (e) {
        
    //      console.error("Une erreur s'est produite :", e);
    //  }
    // })
 
 