const { AbsencePresence } = require('../models/absencepresence');
const Choriste = require('../models/choriste');
const Audition = require("../models/audition")
const { CandAud } = require("../models/candidatAudition")
const { Personne } = require("../models/personne")
const Concert = require('../models/concert');
console.log("helloooo1111");

exports.getListeParticipants = async (req, res) => {
  try {
    const concerti = req.params.idC;
    const seuil = req.params.pourcentage / 100; // Convertir le seuil en décimal (par exemple, 75% devient 0.75)
// Fonction pour calculer le taux de présence basé sur les concerts passés
const calculateTauxPresencePasses = async (choriste, concertsPasses) => {
  let presenceCount = 0;

  // Parcourir tous les concerts passés
  for (const concert of concertsPasses) {
      const absences = await AbsencePresence.find({
          'concert': concert._id,
          'choriste': choriste._id,
          'etat': true,
      }).exec();
      presenceCount += absences.length;
  }

  let concertsPassesChoriste = 0;
  for (const concert of concertsPasses) {
      const nb = await AbsencePresence.find({
          'concert': concert._id,
          'choriste': choriste._id,
      }).exec();
      concertsPassesChoriste += nb.length;
  }

  console.log(presenceCount);
  const totalConcerts = concertsPasses.length;
  console.log(totalConcerts);

  const tauxPresencePasses = presenceCount / totalConcerts;
  const tauxAbsencePasses = 1 - tauxPresencePasses;

  return { tauxPresence: tauxPresencePasses, tauxAbsence: tauxAbsencePasses };
};

    // Use await directly with the query
    const absences = await AbsencePresence.find({
      'concert': concerti,
      }).populate({
      path: 'choriste',
      populate: {
        path: 'candidatId',
        model: 'Personne',
      },
    }).exec();
    console.log("22222");

    // Récupérer la liste des choristes
    const choristes = absences.map(absence => absence.choriste);
    
    // Récupérer la liste des concerts passés
       const concertsPasses = await Concert.find({
          date: { $lt: new Date() },
       }).exec();
       const participantsAvecTaux = await Promise.all(choristes.map(async (choriste) => {
        const { tauxPresence, tauxAbsence } = await calculateTauxPresencePasses(choriste, concertsPasses);
  
        // Comparer le taux de présence avec le seuil
        if (tauxPresence >= seuil) {
          console.log(`Le choriste ${choriste.nom} a un taux de présence suffisant.`);
          return { choriste, tauxPresence: tauxPresence * 100 + "%", tauxAbsence: tauxAbsence * 100 + "%" };
        } else {
          console.log(`Le choriste ${choriste.nom} n'a pas atteint le seuil de présence.`);
          return null; // Ne pas inclure ce choriste dans les résultats
        }
      }));
   // Filtrer les participants qui ont dépassé le seuil
      const participantsFiltres = participantsAvecTaux.filter(participant => participant !== null);
// Fonction pour grouper les participants par pupitre
const groupByPupitre = async (participants) => {
    // Initialiser une structure de données pour stocker les participants par pupitre
    const participantsParPupitre = {
      Soprano: [],
      Alto: [],
      Tenor: [],
      Basse: [],
    };
  
    // Parcourir tous les participants
    for (const participant of participants) {
      const valid1 = await Audition.findOne({ candidat: participant.choriste.candidatId._id });
      const valid2 = await CandAud.findOne({ audition: valid1._id });
      const tessiture = valid2.tessiture;
  
      // Ajouter le participant à la liste correspondante du pupitre
      if (participantsParPupitre.hasOwnProperty(tessiture)) {
        participantsParPupitre[tessiture].push(participant);
      }
    }
  
    // Retourner la structure de données avec les listes de participants par pupitre
    return participantsParPupitre;
  };
  
  // Utilisation de la fonction groupByPupitre avec la liste de participants
  const participantsGroupes = await groupByPupitre(participantsFiltres);
  
  // Envoyer la réponse
  res.json({ participants: participantsGroupes });
  } catch (error) {
    console.error(error);
    // Handle the error and send an appropriate response
    res.status(500).send('Erreur serveur');
  }
};
exports.getListeParticipantsParAbsence = async (req, res) => {
  try {
    const concerti = req.params.idC;
    const seuil = req.params.pourcentage / 100; // Convertir le seuil en décimal (par exemple, 75% devient 0.75)
// Fonction pour calculer le taux de présence basé sur les concerts passés
const calculateTauxPresencePasses = async (choriste, concertsPasses) => {
  let presenceCount = 0;

  // Parcourir tous les concerts passés
  for (const concert of concertsPasses) {
      const absences = await AbsencePresence.find({
          'concert': concert._id,
          'choriste': choriste._id,
          'etat': true,
      }).exec();
      presenceCount += absences.length;
  }

  let concertsPassesChoriste = 0;
  for (const concert of concertsPasses) {
      const nb = await AbsencePresence.find({
          'concert': concert._id,
          'choriste': choriste._id,
      }).exec();
      concertsPassesChoriste += nb.length;
  }

  console.log(presenceCount);
  const totalConcerts = concertsPasses.length;
  console.log(totalConcerts);

  const tauxPresencePasses = presenceCount / totalConcerts;
  const tauxAbsencePasses = 1 - tauxPresencePasses;

  return { tauxPresence: tauxPresencePasses, tauxAbsence: tauxAbsencePasses };
};

    // Use await directly with the query
    const absences = await AbsencePresence.find({
      'concert': concerti,
      }).populate({
      path: 'choriste',
      populate: {
        path: 'candidatId',
        model: 'Personne',
      },
    }).exec();
    console.log("22222");

    // Récupérer la liste des choristes
    const choristes = absences.map(absence => absence.choriste);
    
    // Récupérer la liste des concerts passés
       const concertsPasses = await Concert.find({
          date: { $lt: new Date() },
       }).exec();
       const participantsAvecTaux = await Promise.all(choristes.map(async (choriste) => {
        const { tauxPresence, tauxAbsence } = await calculateTauxPresencePasses(choriste, concertsPasses);
  
        // Comparer le taux de présence avec le seuil
        if (tauxAbsence <= seuil) {
          console.log(`Le choriste ${choriste.candidatId.nom} a un taux d absence suffisant.`);
          return { choriste, tauxPresence: tauxPresence * 100 + "%", tauxAbsence: tauxAbsence * 100 + "%" };
        } else {
          console.log(`Le choriste ${choriste.candidatId.nom} superieur au seuil d absence.`);
          return null; // Ne pas inclure ce choriste dans les résultats
        }
      }));
   // Filtrer les participants qui ont dépassé le seuil
      const participantsFiltres = participantsAvecTaux.filter(participant => participant !== null);
// Fonction pour grouper les participants par pupitre
const groupByPupitre = async (participants) => {
    // Initialiser une structure de données pour stocker les participants par pupitre
    const participantsParPupitre = {
      Soprano: [],
      Alto: [],
      Tenor: [],
      Basse: [],
    };
  
    // Parcourir tous les participants
    for (const participant of participants) {
      const valid1 = await Audition.findOne({ candidat: participant.choriste.candidatId._id });
      const valid2 = await CandAud.findOne({ audition: valid1._id });
      const tessiture = valid2.tessiture;
  
      // Ajouter le participant à la liste correspondante du pupitre
      if (participantsParPupitre.hasOwnProperty(tessiture)) {
        participantsParPupitre[tessiture].push(participant);
      }
    }
  
    // Retourner la structure de données avec les listes de participants par pupitre
    return participantsParPupitre;
  };
  
  // Utilisation de la fonction groupByPupitre avec la liste de participants
  const participantsGroupes = await groupByPupitre(participantsFiltres);
  
  // Envoyer la réponse
  res.json({ participants: participantsGroupes });

  } catch (error) {
    console.error(error);
    // Handle the error and send an appropriate response
    res.status(500).send('Erreur serveur');
  }
};

// Contrôleur pour récupérer la liste des choristes présents par pupitre à un concert
exports.getParticipantsByConcertId = async (req, res) => {
  try {
    const concerti = req.params.concertId;
    // Utilisez directement le filtre dans la requête MongoDB
    const participants = await AbsencePresence.find({
      'concert': concerti,
      'etat': true,
    }).populate('choriste').exec();
 
    // Envoyer la liste des choristes présents en tant que réponse
    res.json({ participants });
  } catch (error) {
    console.error(error);
    // Gérer l'erreur selon vos besoins
    res.status(500).send('Erreur serveur');
  }
};

exports.getAll= async (req, res) => {
  try {
    const concerti = req.params.idC;
    const tess = req.params.tessit;

    // Use await directly with the query
    const absences = await AbsencePresence.find({
      'concert': concerti,
      }).populate({
      path: 'choriste',
      populate: {
        path: 'candidatId',
        model: 'Personne',
      },
    }).exec();

    const presentsPupitre = [];

    for (const absence of absences) {
      const valid1 = await Audition.findOne({ candidat: absence.choriste.candidatId._id });
      const valid2 = await CandAud.findOne({ audition: valid1._id });
      // console.log("personne recupérée "+absence.choriste.candidatId)
      // console.log("resultat valid 1 "+valid1)
      // console.log("resultat valid 2 "+valid2)

      if (valid2.tessiture.toLowerCase() === tess.toLowerCase()) {
        presentsPupitre.push({
          nom: absence.choriste.candidatId.nom,
          prenom: absence.choriste.candidatId.prenom,
        });
      }
    }

   //console.log(absences);
   const responseKey = `Liste_participants_${tess}`;

   // Envoyer la réponse ou effectuer d'autres actions
   res.json({ [responseKey]: presentsPupitre});
  } catch (error) {
    console.error(error);
    // Handle the error and send an appropriate response
    res.status(500).send('Erreur serveur');
  }
};
