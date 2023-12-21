const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")
const { Absence, absenceValidationSchema } = require('../models/absence');
const Concert = require('../models/concert');
const { getUserIdFromRequest } = require('../middlewares/auth');
const { Repetition } = require('../models/repetition');

const Choriste = require('../models/choriste');



exports.createAbsence = async (req, res) => {
  // Valider les données de la requête
  const { error } = absenceValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Récupérer les paramètres de l'URL
    const { id_repetition, urlQR } = req.params;
    console.log('ID de la répétition:', id_repetition);
    console.log('URL QR:', urlQR);

    // Rechercher la répétition correspondant à l'`id_repetition`
    const repetition = await Repetition.findOne({ _id: id_repetition });
   
    // Vérifier si la répétition existe
    if (!repetition) {
      return res.status(404).json({ error: 'Répétition non trouvée pour les paramètres fournis' });
    }

    // Vérifier si l'URL QR correspond à celui de la répétition
    if (repetition.urlQR !== urlQR) {
      return res.status(400).json({ error: "L'URL QR ne correspond pas à celui de la répétition" });
    }

    // Récupérer l'ID du compte à partir de la requête
    const compteId = await getUserIdFromRequest(req);
    console.log('ID du compte:', compteId);

    if (!compteId) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    // Trouver le choriste correspondant à l'ID du compte
    const choriste = await Choriste.findOne({ compteId });
    console.log('Choriste trouvé:', choriste);

    if (!choriste) {
      return res.status(404).json({ error: 'Choriste non trouvé' });
    }

    // Vérifier si la date d'insertion est égale à la date de répétition
    const dateInsertion = new Date(); // Assurez-vous d'obtenir la date d'insertion correcte selon votre application
    const dateRepetition = repetition.date;

    if (!isSameDate(dateInsertion, dateRepetition)) {
      return res.status(400).json({ error: "La présence ne peut être créée que le jour de la répétition" });
    }

    // Créer un nouvel objet Absence
    const nouvelleAbsence = new Absence({
      etat: true,
      choriste: choriste._id, 
      repetition: repetition._id,
    });

    // Enregistrer l'absence dans la base de données
    const absenceEnregistree = await nouvelleAbsence.save();

    res.status(201).json({
      absence: absenceEnregistree,
      message: 'présence créée avec succès !',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour envoyer un e-mail de confirmation avec un lien
async function sendConfirmationEmail(choristeEmail, dateConcert, confirmationLink) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        secureConnection: false,
        port: 587,
        tls: {
          ciphers: 'SSLv3',
        },
        auth: {
          user: 'simaatest@outlook.com',
          pass: 'SIMAA test2012',
        },
        connectionTimeout: 5000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
  
      const mailOptions = {
        from: 'simaatest@outlook.com',
        to: choristeEmail,
        subject: 'Confirmation d\'absence',
        html: `
          <p>Merci de confirmer votre absence pour le concert du ${dateConcert}.</p>
          <p>Cliquez sur le lien ci-dessous pour confirmer :</p>
          <form method="get" action="${confirmationLink}">
          <button type="submit">Confirmer l'absence</button>
          </form>
          
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('E-mail envoyé :', info.response);
    } catch (error) {
      console.error('Erreur d\'envoi d\'e-mail:', error);
      throw error;
    }
  }
  
  exports.confirmAbsence = async (req, res) => {
    try {
      const { concertId } = req.params;
  
      // Vérifier si l'absence a déjà été confirmée
      const compteId = await getUserIdFromRequest(req);
      console.log(compteId);
      const choristeid = await Choriste.findOne({ compteId });
      console.log(choristeid );
      const existingAbsence = await Absence.findOne({ choriste: choristeid, concert: concertId });
  
      if (existingAbsence && existingAbsence.etat) {
        return res.status(400).json({ error: 'L\'absence a déjà été confirmée' });
      }
  
      // Exemple : Traitez la confirmation d'absence ici en utilisant l'ID du concert
      // ...
  
      // Exemple : Enregistrez l'absence dans la base de données
      console.log(concertId);
      const concert = await Concert.findById(concertId);
      console.log(concert);
  
      if (!concert) {
        return res.status(404).json({ error: 'Concert non trouvé' });
      }
  
      
  
      // Générez un lien unique pour la confirmation d'absence
      const confirmationLink = `http://127.0.0.1:5000/api/absences/confirmation-absence/${compteId}/${concertId}`;
  
      // Envoyez un e-mail de confirmation avec le lien
      const choristeEmail = "saadsimaa@gmail.com"; // Remplacez par l'e-mail du choriste
      await sendConfirmationEmail(choristeEmail, concert.date, confirmationLink);
  
      res.status(200).json({ message: 'Confirmation d\'absence réussie' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  exports.confirmDispo = async (req, res) => {
    const { compteId, concertId} = req.params;
  
    try {
      const choriste = await Choriste.findOne({ compteId: compteId }); 
     
      const concert = await Concert.findById(concertId);
  
      if (!choriste) {
        return res.status(404).json({ erreur: "Choriste non trouvé" });
      }
  
      // Vérifiez si le token reçu correspond au token associé au choriste
      
  
      choriste.confirmationStatus = "Confirmé";
      
      await choriste.save();
  
      // Ajoutez le choriste à la liste d'absence uniquement après confirmation
      if (
        choriste.confirmationStatus === "Confirmé"
      ) {
        // Créer un nouvel objet Absence
      const nouvelleAbsence = new Absence({
        choriste: choriste._id,
        concert: concert._id,
      });
  
      await nouvelleAbsence.save();
      }
  
      res.json({
        message:
          "Confirmation réussie. Le choriste a été ajouté à la liste d'absence.",
      });
    } catch (error) {
      console.error("Erreur lors de la confirmation de disponibilité :", error);
      res.status(500).json({ erreur: "Erreur interne du serveur" });
    }
  };



function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }