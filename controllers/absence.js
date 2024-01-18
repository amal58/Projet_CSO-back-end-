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
 
  const { error } = absenceValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    
    const { id_repetition, urlQR } = req.params;
    console.log('ID de la répétition:', id_repetition);
    console.log('URL QR:', urlQR);

    
    const repetition = await Repetition.findOne({ _id: id_repetition });
   
   
    if (!repetition) {
      return res.status(404).json({ error: 'Répétition non trouvée pour les paramètres fournis' });
    }

    
    if (repetition.urlQR !== urlQR) {
      return res.status(400).json({ error: "L'URL QR ne correspond pas à celui de la répétition" });
    }

   
    const compteId = await getUserIdFromRequest(req);
    // console.log('ID du compte:', compteId);

    // if (!compteId) {
    //   return res.status(401).json({ error: 'Token invalide ou expiré' });
    // }

   
    const choriste = await Choriste.findById(compteId); 
    console.log('Choriste trouvé:', choriste);

    if (!choriste) {
      return res.status(404).json({ error: 'Choriste non trouvé' });
    }

   
    const dateInsertion = new Date(); 
    const dateRepetition = repetition.date;

    if (!isSameDate(dateInsertion, dateRepetition)) {
      return res.status(400).json({ error: "La présence ne peut être créée que le jour de la répétition" });
    }


    const nouvelleAbsence = new Absence({
      etat: true,
      choriste: choriste._id, 
      repetition: repetition._id,
    });

  
    const absenceEnregistree = await nouvelleAbsence.save();

    res.status(201).json({
      absence: absenceEnregistree,
      message: 'présence créée avec succès !',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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

   
    

    choriste.confirmationStatus = "Confirmé";
    
    await choriste.save();

  
    if (
      choriste.confirmationStatus === "Confirmé"
    ) {
 
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


  try {
  
    const { concertId, urlQR } = req.params;
    console.log('ID du concert:', concertId);
    console.log('URL QR:', urlQR);


    const compteId = await getUserIdFromRequest(req);
    console.log('ID du compte:', compteId);

    if (!compteId) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    const choriste = await Choriste.findById(compteId);

    if (!choriste) {
      return res.status(404).json({ error: 'Choriste non trouvé' });
    }


    const absence = await Absence.findOne({
      choriste: choriste._id,
      concert: concertId,
    });


    if (!absence) {
      return res.status(404).json({ error: 'Absence non trouvée pour les paramètres fournis' });
    }

 
    const concert = await Concert.findOne({ _id: concertId });

    if (!concert || concert.urlQR !== urlQR) {
      return res.status(400).json({ error: "L'URL QR ne correspond pas à celui du concert" });
    }
    choriste.confirmationStatus = "En attente de confirmation";
    await choriste.save();
 
    await Absence.findOneAndUpdate(
      { _id: absence._id },
      { $set: { etat: true } },
      { new: true } 
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

  
    const absentChoristes = await Absence.find({ concert: concertId, etat: false })
      .populate('choriste') 
      .select('choriste'); 

    res.json({ absentChoristes });
  } catch (error) {
    console.error('Erreur lors de la récupération des choristes absents :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
exports.listerAbsencesParTessitureEtConcert = async (req, res) => {
  const { concert } = req.params;

  try {

    const absences = await Absence.find({ concert: concert }).populate('choriste').exec();


    const resultats = [];


    for (const absence of absences) {

      const candidatId = absence.choriste.candidatId;


      const audition = await Audition.findOne({ candidat: candidatId});

 
      if (audition) {
        const candA = await CandA.findOne({ audition: audition._id });

 
        if (candA && candA.tessiture === req.params.tessiture) {
          const choristeInfo = await Personne.findById(candidatId);

          resultats.push({
            choriste: absence.choriste,
            tessiture: candA.tessiture,
            nom: choristeInfo.nom,
            prenom: choristeInfo.prenom,

          });
        }
      }
    }


    res.json(resultats);
  } catch (error) {
    console.error('Erreur lors de la récupération des presences :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des presences' });
  }
};

exports.statspresenceChoriste = async (req, res) => {
  try {
    const choristeId = await getUserIdFromRequest(req);


    if (!choristeId) {
      res.status(403).json({ error: 'Accès non autorisé' });
      return;
    }


    const oeuvreId = req.params.oeuvreId.toString(); 

    console.log('ID de l\'oeuvre :', oeuvreId);
 
    const nombreAbsences = await Absence.find({ choriste: choristeId }).countDocuments();

  
    const repetitionsAbsentes = await Absence.find({
      choriste: choristeId,
      repetition: { $exists: true },
    }).populate({
      path: 'repetition',
      match: { 'repetition.programme': oeuvreId }, 
    });
    
  
    const concertsAbsents = await Absence.find({
      choriste: choristeId,
      concert: { $exists: true },
    }).populate({
      path: 'concert',
      match: { 'concert.programme': oeuvreId }, 
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


    const absences = await Absence.find({ choriste: choristeId, etat: true })
      .populate('repetition concert')
      .exec();


    const toutesRepetitions = await Repetition.find({ choriste: choristeId })
      .populate('concert')
      .exec();


    const repetitions = toutesRepetitions.filter(rep => absences.some(abs => abs.repetition && abs.repetition._id.equals(rep._id)));


    const tousConcerts = await Concert.find({ choristes: choristeId })
      .exec();

    const concerts = tousConcerts.filter(concert => absences.some(abs => abs.concert && abs.concert._id.equals(concert._id)));

    const maitriseOeuvre = await determineMaitriseOeuvre(choristeId);

    const repetitionsAbsentIds = absences.filter(abs => abs.repetition).map(abs => abs.repetition._id);
    const concertsAbsentIds = absences.filter(abs => abs.concert).map(abs => abs.concert._id);

  
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
exports.statistiqueOeuvre = async (req, res) => {
  const oeuvreId = req.params.oeuvreId;

  try {

    let nombrePresenceRepetition = 0;
    let nombreAbsenceRepetition = 0;
    let nombrePresenceConcert = 0;
    let nombreAbsenceConcert = 0;

    
    const absences = await Absence.find({ $or: [{ repetition: { $exists: true } }, { concert: { $exists: true } }] });


    for (const absence of absences) {
      
      if (absence.repetition) {
        const repetition = await Repetition.findById(absence.repetition);
        if (repetition && repetition.programme.includes(oeuvreId)) {
          if (absence.etat) {
            nombrePresenceRepetition++;
          } else {
            nombreAbsenceRepetition++;
          }
        }
      }

     
      if (absence.concert) {
        const concert = await Concert.findById(absence.concert);
        if (concert && concert.programme.includes(oeuvreId)) {
          if (absence.etat) {
            nombrePresenceConcert++;
          } else {
            nombreAbsenceConcert++;
          }
        }
      }
    }


    res.json({
      statsRepetitions: {
        nombrePresence: nombrePresenceRepetition,
        nombreAbsence: nombreAbsenceRepetition,
      },
      statsConcerts: {
        nombrePresence: nombrePresenceConcert,
        nombreAbsence: nombreAbsenceConcert,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques d\'absence pour l\'œuvre :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques.' });
  }
};

exports.AbsenceRepetition = async (req, res) => {
  try {
 
    const absences = await Absence.find({ repetition: { $exists: true }, etat: false })
      .populate('choriste')
      .populate('repetition')
      .exec();

 
    res.json(absences);
  } catch (error) {
    console.error('Erreur lors de la récupération des absences pour les répétitions :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des absences pour les répétitions' });
  }
};
exports.AbsenceRepetitionChoriste = async (req, res) => {
  const { choristeId } = req.params;

  try {
 
    const absences = await Absence.find({ choriste: choristeId, repetition: { $exists: true }, etat: false })
      .populate('choriste')
      .populate('repetition')
      .exec();


    res.json(absences);
  } catch (error) {
    console.error('Erreur lors de la récupération des absences pour les répétitions pour le choriste :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des absences pour les répétitions pour le choriste' });
  }
};

exports.absencesChoristesParTessiture = async (req, res) => {
  const { tessiture } = req.params;

  try {
    const absences = await Absence.find({ etat: false, repetition: { $exists: true } }).populate('choriste').exec();

    const resultats = [];

    for (const absence of absences) {
      const candidatId = absence.choriste.candidatId;

      const audition = await Audition.findOne({ candidat: candidatId });

      if (audition) {
        const candA = await CandA.findOne({ audition });

        if (candA && candA.tessiture === tessiture) {
          const choristeInfo = await Personne.findById(candidatId);
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

    res.json(resultats);
  } catch (error) {
    console.error('Erreur lors de la récupération des absences :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des absences' });
  }
};

exports.absencesRepetitionDate = async (req, res) => {
  const { date } = req.params;

  try {
    // Convertir la chaîne de date en objet Date
    const dateRecherchee = new Date(date);

    // Trouver les absences pour la date spécifique, etat: false, avec le champ repetition
    const absences = await Absence.find({
      etat: false,
      repetition: { $exists: true },
      CurrentDate: {
        $gte: dateRecherchee,
        $lt: new Date(dateRecherchee.getTime() + 24 * 60 * 60 * 1000),
      },
    }).exec();

    // Envoyer les résultats en réponse
    res.json(absences);
  } catch (error) {
    console.error('Erreur lors de la récupération des absences :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des absences' });
  }
};



















function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }