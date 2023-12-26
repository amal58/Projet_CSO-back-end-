const app =require("./app")
const schedule = require('node-schedule');

const Conge= require('./models/conge');
const http = require('http');
const Choriste = require('./models/choriste');
const Personne = require('./models/personne');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const port =process.env.PORT|| 5000
app.set("port",port)

server.listen(port,()=>{
    console.log("listening on "+ port)
})

app.post ("/ajouteconger/:id", async (req, res) =>{
    try{
        const conge = new Conge({
            dateDebutConge: req.body.dateDebutConge,
            dateFinConge: req.body.dateFinConge,
            etat: req.body.etat,
            choriste: req.params.id
        })
       const resultat = await  conge.save();
       const choriste=  await Choriste.findOne({_id: req.params.id}).populate("candidatId")
       if(choriste){
            io.emit("new_notification","hhjggffuf")
     }
    res.status(200).json({
        message: "bien retourner",
        response: resultat
    })
}
    catch(e){
console.log(e);
    }
})



io.on("connection",Socket=>{
    console.log(Socket)
    schedule.scheduleJob('* * * * *', async()=>{
     try {
         const tab = [];
         const existcongee =  await Conge.find({etat:'en attente'}).populate({ 
            path: 'choriste',
            populate: {
              path: 'candidatId',
            } 
         });
         console.log(existcongee);
         Socket.emit("list",existcongee)
     } catch (e) {
         console.error("Une erreur s'est produite :", e);
     }
    })
})
 


