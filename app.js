const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const personneRoutes = require('./routes/personne');
const Personne = require('./models/personne');
const auditionRoutes = require('./routes/audition');

const app = express();
// Configurer body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Appeler la fonction pour insérer les exemples après la connexion réussie
    // insererExemples();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
app.use('/api/auditions', auditionRoutes); 
app.use('/api/candidats', personneRoutes);
app.use(express.json());

// // Exemples à insérer dans la base de données
// const exemples = [
//   {
//     "email": "jo@example.com",
//     "nom": "Doe",
//     "prenom": "John",
//     "nomJeuneFille": null,
//     "sexe": "Homme",
//     "dateNaissance": "1990-01-01",
//     "Nationalite": "French",
//     "taille": 180,
//     "telephone": "+123456789",
//     "cin": "AB123456",
//     "situationPro": "Employed",
//     "role": "candidat"
//   },
//   {
//     "email": "char@example.com",
//     "nom": "Brown",
//     "prenom": "Charles",
//     "nomJeuneFille": null,
//     "sexe": "Homme",
//     "dateNaissance": "1993-11-12",
//     "Nationalite": "American",
//     "taille": 185,
//     "telephone": "+1122334455",
//     "cin": "OP789012",
//     "situationPro": "Doctor",
//     "role": "candidat"
//   },
//   {
//     "email": "sope@example.com",
//     "nom": "Martin",
//     "prenom": "Sophie",
//     "nomJeuneFille": null,
//     "sexe": "Femme",
//     "dateNaissance": "1994-09-07",
//     "Nationalite": "French",
//     "taille": 168,
//     "telephone": "+9988776655",
//     "cin": "QR012345",
//     "situationPro": "Teacher",
//     "role": "candidat"
//   },
//   {
//     "email": "mar@example.com",
//     "nom": "Martin",
//     "prenom": "Sophie",
//     "nomJeuneFille": null,
//     "sexe": "Femme",
//     "dateNaissance": "1994-09-07",
//     "Nationalite": "French",
//     "taille": 168,
//     "telephone": "+9988776655",
//     "cin": "QR012345",
//     "situationPro": "Teacher",
//     "role": "candidat"
//   },
//   {
//     "email": "so@example.com",
//     "nom": "Martin",
//     "prenom": "Sophie",
//     "nomJeuneFille": null,
//     "sexe": "Femme",
//     "dateNaissance": "1994-09-07",
//     "Nationalite": "French",
//     "taille": 168,
//     "telephone": "+9988776655",
//     "cin": "QR012345",
//     "situationPro": "Teacher",
//     "role": "candidat"
//   },
//   {
//     "email": "ali@example.com",
//     "nom": "Johnson",
//     "prenom": "Alice",
//     "nomJeuneFille": null,
//     "sexe": "Femme",
//     "dateNaissance": "1988-08-20",
//     "Nationalite": "American",
//     "taille": 170,
//     "telephone": "+1122334455",
//     "cin": "EF456789",
//     "situationPro": "Unemployed",
//     "role": "candidat"
//   }
  
  
  
 
// ];

// // Fonction pour insérer les exemples dans la base de données
// async function insererExemples() {
//   try {
//     await Personne.insertMany(exemples);
//     console.log('Exemples insérés avec succès dans la base de données.');
//   } catch (error) {
//     console.error('Erreur lors de l\'insertion des exemples :', error);
//   }
// }

module.exports = app;
