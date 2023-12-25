const http =require("http")
const app =require("./app")
const io = require('socket.io')(http, {cors: {origin : '*'}});
var path = require('path');
const schedule = require('node-schedule');
const Choriste = require('./models/choriste');

const port =process.env.PORT|| 5000
app.set("port",port)

const server =http.createServer(app)

server.listen(port,()=>{
    console.log("listening on "+ port)
})


app.post("/ajouteconger/:id",async (req, res) =>{
    try{
        const conge = new Conge({
            dateDebutConge: req.body.dateDebutConge,
            dateFinConge: req.body.dateFinConge,
            etat: req.body.etat,
            choriste: req.params.id
        })
       const resultat = await  conge.save();
       const choriste=  await Choriste.findById({_id: req.params.id})
       if(resultat){
            io.emit("new_notification",`vous avez une nouvelle congée de ${choriste.nom} ${choriste.prenom}`)
    }
    await Choriste.findByIdAndUpdate({_id:req.params.id},
        {
         $addToSet: {
            Conges: resultat._id
         }   
        },
        {
            new: true
        }
        )
    res.status(200).json({
        message: "bien retourner",
        response: resultat
    })
}
    catch(e){
console.log(e);
    }
})




io.on('connection',socket=>{
 
    schedule.scheduleJob('* * * * *', async()=>{
 
     try {
         const tab = [];
         const existcongee =  await Congee.find({enConge: false}).populate("Choriste") ;
     console.log(existcongee);
     socket.emit("list",existcongee)
         
     } catch (e) {
        
         console.error("Une erreur s'est produite :", e);
     }
    })
 })
 
 


