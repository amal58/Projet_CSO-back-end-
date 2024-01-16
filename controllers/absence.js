const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")
const { Absence, absenceValidationSchema } = require('../models/absence');
const Concert = require('../models/concert');
const { getUserIdFromRequest } = require('../middlewares/auth');
const { Repetition } = require('../models/repetition');
const Audition = require('../models/audition'); // Assurez-vous de spécifier le chemin correct

const Personne = require('../models/personne');


const CandA = require('../models/candidataudition');

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
    // console.log('ID du compte:', compteId);

    // if (!compteId) {
    //   return res.status(401).json({ error: 'Token invalide ou expiré' });
    // }

    // // Trouver le choriste correspondant à l'ID du compte
    const choriste = await Choriste.findById(compteId); 
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

//Fonction pour envoyer un e-mail de confirmation avec un lien
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
        user: 'saadsima@outlook.com',
        pass: 'SIMAA test2012',
      },
      connectionTimeout: 5000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const mailOptions = {
      from: 'saadsima@outlook.com',
      to: choristeEmail,
      subject: 'Confirmation d\'absence',
      html: `
        <p>Merci de confirmer votre absence pour le concert du ${dateConcert}.</p>
        <p>Cliquez sur le lien ci-dessous pour confirmer :</p>
        <form method="get" action="${confirmationLink}">
        <button type="submit">Confirmer la disponibilité</button>
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
    console.log('Req headers:', req.headers)
    const compteId = await getUserIdFromRequest(req);
    console.log('ID du compte:', compteId);

    if (!compteId) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    // Trouver le choriste correspondant à l'ID du compte
    const choriste = await Choriste.findOne({ _id: compteId }); // Utilisez _id plutôt que compteId

    if (!choriste) {
      return res.status(404).json({ error: 'Choriste non trouvé' });
    }

    console.log(choriste);
    const existingAbsence = await Absence.findOne({ choriste: compteId, concert: concertId }); // Utilisez _id plutôt que choristeid

    if (existingAbsence && existingAbsence.etat) {
      return res.status(400).json({ error: 'La disponibilité a déjà été confirmée' });
    }

    console.log('msg demandeeeeeeee', compteId);
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

    res.status(200).json({ message: 'Confirmation da la disponibilité réussie' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.confirmDispo = async (req, res) => {
  const { compteId, concertId} = req.params;

  try {
    const choriste = await Choriste.findById(compteId); 
   
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
        "Confirmation réussie. Le choriste a été ajouté à la liste de disponibilité.",
    });
  } catch (error) {
    console.error("Erreur lors de la confirmation de disponibilité :", error);
    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

exports.modifyChoristeState = async (req, res) => {
  // Valider les données de la requête si nécessaire

  try {
    // Récupérer les paramètres de l'URL
    const { concertId, urlQR } = req.params;
    console.log('ID du concert:', concertId);
    console.log('URL QR:', urlQR);

    // Récupérer l'ID du choriste à partir de la requête
    const compteId = await getUserIdFromRequest(req);
    console.log('ID du compte:', compteId);

    if (!compteId) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    // Trouver le choriste correspondant à l'ID du compte
    const choriste = await Choriste.findById(compteId);

    if (!choriste) {
      return res.status(404).json({ error: 'Choriste non trouvé' });
    }

    // Rechercher l'absence correspondant au choriste et au concert
    const absence = await Absence.findOne({
      choriste: choriste._id,
      concert: concertId,
    });

    // Vérifier si l'absence existe
    if (!absence) {
      return res.status(404).json({ error: 'Absence non trouvée pour les paramètres fournis' });
    }

    // Vérifier si l'URL QR correspond à celui du concert
    const concert = await Concert.findOne({ _id: concertId });

    if (!concert || concert.urlQR !== urlQR) {
      return res.status(400).json({ error: "L'URL QR ne correspond pas à celui du concert" });
    }
    choriste.confirmationStatus = "En attente de confirmation";
    await choriste.save();
    // Mettre à jour l'état de l'absence
    await Absence.findOneAndUpdate(
      { _id: absence._id },
      { $set: { etat: true } },
      { new: true } // Pour renvoyer le document mis à jour
    );

    res.json({
      message: "État de l'absence modifié avec succès !",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChoristesDispo = async (req, res) => {
  try {
    const { concertId } = req.params;

    // Recherche des choristes absents pour le concert spécifié
    const absentChoristes = await Absence.find({ concert: concertId, etat: false })
      .populate('choriste') // Assurez-vous que vous avez une référence correcte dans votre modèle Absence
      .select('choriste'); // Sélectionnez uniquement le champ 'choriste' dans le résultat

    res.json({ absentChoristes });
  } catch (error) {
    console.error('Erreur lors de la récupération des choristes absents :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
exports.listerAbsencesParTessitureEtConcert = async (req, res) => {
  const { concert } = req.params;

  try {
    // Trouver les absences pour le concert donné
    const absences = await Absence.find({ concert: concert }).populate('choriste').exec();

    // Créer un tableau pour stocker les résultats
    const resultats = [];

    // Parcourir les absences
    for (const absence of absences) {
      // Récupérer le candidatId du choriste
      const candidatId = absence.choriste.candidatId;

      // Chercher l'audition correspondante
      const audition = await Audition.findOne({ candidat: candidatId});

      // Si une audition est trouvée, chercher la tessiture dans CandA
      if (audition) {
        const candA = await CandA.findOne({ audition: audition._id });

        // Si CandA est trouvé, vérifier la tessiture
        if (candA && candA.tessiture === req.params.tessiture) {
          const choristeInfo = await Personne.findById(candidatId);
          // Ajouter le résultat au tableau
          resultats.push({
            choriste: absence.choriste,
            tessiture: candA.tessiture,
            nom: choristeInfo.nom,
            prenom: choristeInfo.prenom,
            // Autres champs que vous souhaitez inclure
          });
        }
      }
    }

    // Envoyer les résultats en réponse
    res.json(resultats);
  } catch (error) {
    console.error('Erreur lors de la récupération des presences :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des presences' });
  }
};

exports.statspresenceChoriste = async (req, res) => {
  try {
    const choristeId = await getUserIdFromRequest(req);

    // Vérifiez si choristeId est défini
    if (!choristeId) {
      res.status(403).json({ error: 'Accès non autorisé' });
      return;
    }

    // Récupérer l'ID de l'œuvre spécifiée dans la requête
    const oeuvreId = req.params.oeuvreId.toString(); // Convertissez l'ID en chaîne

    console.log('ID de l\'oeuvre :', oeuvreId);
    // Récupérer le nombre total d'absences
    const nombreAbsences = await Absence.find({ choriste: choristeId }).countDocuments();

    // Récupérer les répétitions absentes avec le programme spécifié
    const repetitionsAbsentes = await Absence.find({
      choriste: choristeId,
      repetition: { $exists: true },
    }).populate({
      path: 'repetition',
      match: { 'repetition.programme': oeuvreId }, // Filtrer les répétitions par programme
    });
    
    // Récupérer les concerts absents avec le programme spécifié
    const concertsAbsents = await Absence.find({
      choriste: choristeId,
      concert: { $exists: true },
    }).populate({
      path: 'concert',
      match: { 'concert.programme': oeuvreId }, // Filtrer les concerts par programme
    });

    const nombreRepetitionsAbsentes = repetitionsAbsentes.length;
    const nombreConcertsAbsents = concertsAbsents.length;

    res.json({
      nombreAbsences,
      nombreRepetitionsAbsentes,
      repetitionsAbsentes,
      nombreConcertsAbsents,
      concertsAbsents,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques d\'absence :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
exports.getAbsencesAndConcertsAndRepetitions = async function (req, res) {
  try {
    const choristeId = req.params.choristeId;

    // Récupérer les absences du choriste
    const absences = await Absence.find({ choriste: choristeId, etat: true })
      .populate('repetition concert')
      .exec();

    // Récupérer les répétitions du choriste, y compris celles où il est absent
    const toutesRepetitions = await Repetition.find({ choriste: choristeId })
      .populate('concert')
      .exec();

    // Séparer les répétitions où le choriste est absent
    const repetitions = toutesRepetitions.filter(rep => absences.some(abs => abs.repetition && abs.repetition._id.equals(rep._id)));

    // Récupérer les concerts du choriste, y compris ceux où il est absent
    const tousConcerts = await Concert.find({ choristes: choristeId })
      .exec();

    // Séparer les concerts où le choriste est absent
    const concerts = tousConcerts.filter(concert => absences.some(abs => abs.concert && abs.concert._id.equals(concert._id)));

    // Logique pour déterminer la maîtrise des œuvres
    const maitriseOeuvre = await determineMaitriseOeuvre(choristeId);

    // Extraire les identifiants des répétitions et des concerts où le choriste est absent
    const repetitionsAbsentIds = absences.filter(abs => abs.repetition).map(abs => abs.repetition._id);
    const concertsAbsentIds = absences.filter(abs => abs.concert).map(abs => abs.concert._id);

    // Envoyer la réponse avec les données récupérées et la maîtrise des œuvres
    return res.status(200).json({
      absences,
      
      maitriseOeuvre,
      repetitionsAbsentIds,
      concertsAbsentIds
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};



async function determineMaitriseOeuvre(choristeId) {
  try {
    const absences = await Absence.find({ choriste: choristeId, etat: true })
      .populate('repetition')
      .exec();

    console.log('Absences:', absences);

    const occurencesOeuvres = {};

    absences.forEach((absence) => {
      if (absence.repetition) {
        absence.repetition.programme.forEach((oeuvre) => {
          occurencesOeuvres[oeuvre] = (occurencesOeuvres[oeuvre] || 0) + 1;
        });
      }
    });

    console.log('Occurrences d\'œuvres:', occurencesOeuvres);

    const oeuvresMaitrisePlusDeDeux = Object.entries(occurencesOeuvres)
      .filter(([_, count]) => count >= 2)
      .map(([oeuvre, _]) => oeuvre);

    console.log('Œuvres maîtrisées au moins deux fois:', oeuvresMaitrisePlusDeDeux);

    return oeuvresMaitrisePlusDeDeux.length;
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la détermination de la maîtrise des œuvres');
  }
}

exports.statistiqueConcert = async function (req, res) {
  try {
    const concertId = req.params.concertId;


    const nombrePresence = await Absence.countDocuments({ concert: concertId, etat: true });

    const nombreAbsence = await Absence.countDocuments({ concert: concertId, etat: false });

    return res.status(200).json({
      nombrePresence,
      nombreAbsence
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

exports.statistiqueRepetition = async function (req, res) {
  try {
    const repetitionId = req.params.repetitionId;


    const nombrePresence = await Absence.countDocuments({ repetition: repetitionId, etat: true });


    const nombreAbsence = await Absence.countDocuments({ repetition: repetitionId, etat: false });


    return res.status(200).json({ nombrePresence, nombreAbsence });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};



















function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }