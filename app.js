const express = require ("express")
const app= express()
const mongoose = require('mongoose')
const repetitionRoutes = require('./routes/repetition');
const congeRoutes = require('./routes/conge');
const candidatRoutes = require('./routes/candidat');
const choristeRoutes = require('./routes/choriste');
const abprRoutes = require('./routes/absencepresence');
const cron = require('node-cron');
const congeController = require('./controllers/conge');



//'*/2 * * * * *' chaque 2 secondes
// Exécuter la fonction toutes les 2 HEURES
cron.schedule('0 */2 * * *', () => {
  console.log('Exécution du job cron toutes les 2 SECONDES pour envoyer des notifications de congé.');
  congeController.processCongeNotifications();
});





mongoose
.connect("mongodb://127.0.0.1:27017/data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });


  app.use(express.json())

  app.use('/api/repetitions', repetitionRoutes);
  app.use('/api/conge', congeRoutes);
  
  app.use('/api/candidats', candidatRoutes);
  app.use('/api/choristes', choristeRoutes);

  app.use('/api/absencepresence', abprRoutes);

module.exports=app