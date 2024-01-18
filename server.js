const app =require("./app")
const schedule = require('node-schedule');
const moment = require('moment');

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
            io.emit("new_notification","Vous avez une nouvelle demande de conge")
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
 
    schedule.scheduleJob('* * * * *', async()=>{
     try {
         const tab = [];
         const existcongee =  await Conge.find({etat:'en attente'}).populate({ 
            path: 'choriste',
            populate: {
              path: 'candidatId',
            } 
         });
       
         Socket.emit("list",existcongee)
     } catch (e) {
         console.error("Une erreur s'est produite :", e);
     }
    })
})
 

schedule.scheduleJob('*/2 * * * *', async () => { 
    try {
        const date = moment();
        const today = moment();
       
        const existe_congées = await Conge.find({
            etat: "accepte",
            dateFinConge: { $gt: date }
        }).populate({ 
            path: 'choriste',
            populate: {
              path: 'candidatId',
            } 
         });

        existe_congées.map(async (elem) => {
            console.log(elem);
            console.log(elem.dateDebutConge);
            console.log(today);

            const diff = moment(elem.dateDebutConge).diff(today, 'minutes'); 
            console.log(diff);

            if (diff === 0 || (diff > 0 && diff < 3)&& elem.choriste.EtatConge==false) {
                console.log("succes");
                try {
              await    Choriste.findByIdAndUpdate({ _id: elem.choriste._id }, { EtatConge: true });}
                catch (error) {
                    console.error("Erreur lors de la mise à jour du statut :", error);
                }
                io.emit("notif_congé", `congée de maintenant a ${elem.dateFinConge}`);
                io.emit("notif_choriste", ` monsieur votre statut est inactif ${elem.choriste._id}`);
            }
        });
    } catch (e) {
        console.error("Une erreur s'est produite :", e);
    }
});
