const mongoose = require('mongoose');
const { AbsencePresence } = require('../models/absencepresence');
const Audition = require("../models/audition")
const { CandAud } = require("../models/candidatAudition")
const  { Concert } = require('../models/concert');


exports.getListeParticipants = async (req, res) => {
  try {
    const concerti = req.params.idC;
    if (!mongoose.Types.ObjectId.isValid(concerti)) {
      return res.status(400).send('Identifiant de concert invalide');
    }
    const seuil = req.params.pourcentage / 100; 
    const calculateTauxPresencePasses = async (choriste, concertsPasses) => {
  let presenceCount = 0;

  for (const concert of concertsPasses) {
      const absences = await AbsencePresence.find({
          'concert': concert._id,
          'choriste': choriste._id,
          'etat': true,
      }).exec();
      presenceCount += absences.length;
  }
  if (!absences || absences.length === 0) {
    res.status(404).send('participants inexistant');
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

    const choristes = absences.map(absence => absence.choriste);
    
       const concertsPasses = await Concert.find({
          date: { $lt: new Date() },
       }).exec();
       const participantsAvecTaux = await Promise.all(choristes.map(async (choriste) => {
        const { tauxPresence, tauxAbsence } = await calculateTauxPresencePasses(choriste, concertsPasses);
  
        if (tauxPresence >= seuil) {
          console.log(`Le choriste ${choriste.nom} a un taux de présence suffisant.`);
          return { choriste, tauxPresence: tauxPresence * 100 + "%", tauxAbsence: tauxAbsence * 100 + "%" };
        } else {
          console.log(`Le choriste ${choriste.nom} n'a pas atteint le seuil de présence.`);
          return null; 
        }
      }));
      const participantsFiltres = participantsAvecTaux.filter(participant => participant !== null);
      const groupByPupitre = async (participants) => {
    const participantsParPupitre = {
      Soprano: [],
      Alto: [],
      Tenor: [],
      Basse: [],
    };
  
    for (const participant of participants) {
      const valid1 = await Audition.findOne({ candidat: participant.choriste.candidatId._id });
      const valid2 = await CandAud.findOne({ audition: valid1._id });
      const tessiture = valid2.tessiture;
  
      if (participantsParPupitre.hasOwnProperty(tessiture)) {
        participantsParPupitre[tessiture].push(participant);
      }
    }
  
    return participantsParPupitre;
  };
  const participantsGroupes = await groupByPupitre(participantsFiltres);
  const concert = await Concert.findById(concerti);
  concert.ListeParticipants = [];

  for (const pupitre in participantsGroupes) {
    if (participantsGroupes.hasOwnProperty(pupitre)) {
      const participants = participantsGroupes[pupitre].map(participant => ({
        nom: participant.choriste.candidatId.nom,
        prenom: participant.choriste.candidatId.prenom,
        email: participant.choriste.candidatId.email,
        tauxPresence: participant.tauxPresence,

      }));

      concert.ListeParticipants.push({
        pupitre: pupitre,
        participants: participants,
      });
    }
  }

  await concert.save();
  res.json(concert.ListeParticipants);

} catch (error) {
  console.error(error);
  res.status(500).send('Erreur serveur');
}
};

exports.getListeParticipantsParAbsence = async (req, res) => {
  try {
    const concerti = req.params.idC;
    if (!mongoose.Types.ObjectId.isValid(concerti)) {
      return res.status(400).send('Identifiant de concert invalide');
    }
    const seuil = req.params.pourcentage / 100; 
    const calculateTauxPresencePasses = async (choriste, concertsPasses) => {
      let presenceCount = 0;

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

    const absences = await AbsencePresence.find({
      'concert': concerti,
    }).populate({
      path: 'choriste',
      populate: {
        path: 'candidatId',
        model: 'Personne',
      },
    }).exec();
    if (!absences || absences.length === 0) {
      res.status(404).send('participants inexistant');
    }
    const choristes = absences.map(absence => absence.choriste);
    const concertsPasses = await Concert.find({
      date: { $lt: new Date() },
    }).exec();
    const participantsAvecTaux = await Promise.all(choristes.map(async (choriste) => {
      const { tauxPresence, tauxAbsence } = await calculateTauxPresencePasses(choriste, concertsPasses);

      if (tauxAbsence <= seuil) {
        console.log(`Le choriste ${choriste.candidatId.nom} a un taux d absence suffisant.`);
        return { choriste, tauxPresence: tauxPresence * 100 + "%", tauxAbsence: tauxAbsence * 100 + "%" };
      } else {
        console.log(`Le choriste ${choriste.candidatId.nom} superieur au seuil d absence.`);
        return null; 
      }
    }));
    const participantsFiltres = participantsAvecTaux.filter(participant => participant !== null);
    const groupByPupitre = async (participants) => {
      const participantsParPupitre = {
        Soprano: [],
        Alto: [],
        Tenor: [],
        Basse: [],
      };

      for (const participant of participants) {
        const valid1 = await Audition.findOne({ candidat: participant.choriste.candidatId._id });
        const valid2 = await CandAud.findOne({ audition: valid1._id });
        const tessiture = valid2.tessiture;

        if (participantsParPupitre.hasOwnProperty(tessiture)) {
          participantsParPupitre[tessiture].push(participant);
        }
      }

      return participantsParPupitre;
    };

    const participantsGroupes = await groupByPupitre(participantsFiltres);
    const concert = await Concert.findById(concerti);
  
    concert.ListeParticipants = [];
    for (const pupitre in participantsGroupes) {
      if (participantsGroupes.hasOwnProperty(pupitre)) {
        const participants = participantsGroupes[pupitre].map(participant => ({
          nom: participant.choriste.candidatId.nom,
          prenom: participant.choriste.candidatId.prenom,
          email: participant.choriste.candidatId.email,
          tauxAbsence: participant.tauxAbsence,
        }));
  
        concert.ListeParticipants.push({
          pupitre: pupitre,
          participants: participants,
        });
      }
    }
  
    await concert.save();
    res.json({ participants: concert.ListeParticipants });

  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getParticipantsByConcertId = async (req, res) => {
  try {
    const concertId = req.params.concertId;
    if (!mongoose.Types.ObjectId.isValid(concertId)) {
      return res.status(400).send('Identifiant de concert invalide');
    }

    const participants = await AbsencePresence.find({
      'concert': concertId,
      'etat': true,
    }).populate({
      path: 'choriste',
      model: 'Choriste',
      select: 'candidatId role login statutAcutel EtatConge historiqueStatut confirmationStatus',
      populate: {
        path: 'candidatId',
        model: 'Personne',
        select: 'nom prenom telephone cin email situationPro' ,
      },
    }).exec();
    if (!participants || participants.length === 0) {
      res.status(404).send('concert inexistant');
    }
    const participantNames = participants.map(participant => ({
      nom: participant.choriste.candidatId.nom,
      prenom: participant.choriste.candidatId.prenom,
      telephone : participant.choriste.candidatId.telephone ,
      cin : participant.choriste.candidatId.cin ,
      email : participant.choriste.candidatId.email ,
      situationPro : participant.choriste.candidatId.situationPro ,
    }));
    res.json({ participants: participantNames });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getAll= async (req, res) => {
  try {
    const concerti = req.params.idC;

    if (!mongoose.Types.ObjectId.isValid(concerti)) {
      return res.status(400).send('Identifiant de concert invalide');
    }

    const tess = req.params.tessit;
    const absences = await AbsencePresence.find({
      'concert': concerti,
      }).populate({
      path: 'choriste',
      populate: {
        path: 'candidatId',
        model: 'Personne',
      },
    }).exec();
    if (!absences || absences.length === 0) {
      res.status(404).send('concert inexistant');
    }
    const presentsPupitre = [];

    for (const absence of absences) {
      const valid1 = await Audition.findOne({ candidat: absence.choriste.candidatId._id });
      const valid2 = await CandAud.findOne({ audition: valid1._id });

      if (valid2.tessiture.toLowerCase() === tess.toLowerCase()) {
        presentsPupitre.push({
          nom: absence.choriste.candidatId.nom,
          prenom: absence.choriste.candidatId.prenom,
          telephone : absence.choriste.candidatId.telephone ,
          cin : absence.choriste.candidatId.cin ,
          email : absence.choriste.candidatId.email ,
          situationPro : absence.choriste.candidatId.situationPro ,
        });
      }
    }

   const responseKey = `Liste_participants_${tess}`;
   res.json({ [responseKey]: presentsPupitre});
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};



