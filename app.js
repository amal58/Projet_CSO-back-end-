const express = require("express");
const bodyParser = require('body-parser');  // Importez bodyParser ici
const app = express();
const path = require('path');

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/notifUrgent', function(req, res) {
  res.sendFile(path.join(__dirname + '/NotifUrgent.html'));
 });

 const repetitionRoutes = require('./routes/repetition');

const OeuvreRoutes = require("./routes/oeuvre");
const mongoose = require('mongoose');
const concertRoutes = require("./routes/concert");
const ValidMailPRoutes = require('./routes/validerMailPersonne');
const auditionRoutes = require('./routes/audition');
const candARoutes=require("./routes/candidatAudition");
const choristeRoutes=require("./routes/choriste");
const notificationUrgenteRoutes = require('./routes/notifUrgent');
const participantsRoutes = require('./routes/participantsRoutes');
const routePresenceListe = require('./routes/Listepresence')
mongoose.connect('mongodb+srv://p92934700:7RoxD6S97xxp1Dea@cluster0.peomj36.mongodb.net/projetCSO', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB", error);
});


// Utilisez bodyParser ici avant les app.use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/Oeuvre", OeuvreRoutes);
app.use("/api/concert", concertRoutes);
app.use('/validerMail', ValidMailPRoutes);
app.use('/api/auditions', auditionRoutes); 
app.use("/api/cand",candARoutes)
app.use("/api/choriste",choristeRoutes)
app.use("/api/notifUrgente",notificationUrgenteRoutes)
app.use('/api', participantsRoutes);
app.use("/lsP",routePresenceListe)



app.use('/api/repetitions', repetitionRoutes);




module.exports = app;