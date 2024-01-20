const { AbsencePresence,absenceValidationSchema } = require('../models/absencepresence');
const Choriste =require('../models/choriste')
const Personne=require('../models/personne')
const Repetition=require('../models/repetition')
const socketIo = require('socket.io');
const app=require('../app')


const verifierSeuilNomination = async (choristeId ,req) => {

  const nombreAbsences = await AbsencePresence.countDocuments({ choriste: choristeId });
  console.log(nombreAbsences)
  const verif = await AbsencePresence.findOne()
  console.log(verif.seuilelimine)
  console.log(verif.seuilnomine)
  if (nombreAbsences >= verif.seuilnomine) {

    await Choriste.findByIdAndUpdate(choristeId, { etat: 'nominer' });
    console.log(choristeId)
  
     const message = "Attention !! Suite à votre nombre d'absence vous etes actuellement nominé " +nombreAbsences +" absence";
     req.emit('notification', {message}); 
  
    
  }
  if(nombreAbsences >= verif.seuilelimine){
    await Choriste.findByIdAndUpdate(choristeId, { etat: 'eliminer',statutAcutel:'inactif' });
 
    const message = "Suite à votre nombre d'absence vous etes actuellement éliminé "+nombreAbsences +" absence";
    req.emit('notification', {message}); 
  }
  
};
 


const getChoristesNominer = async (req, res) => {
  try {
    const choristesNominer = await Choriste.find({ etat: 'nominer' });

    if (choristesNominer.length === 0) {
      return res.status(200).json({ message: 'Aucun choriste n est actuellement nominé.' });
    }

    const nombre = choristesNominer.length;
    return res.status(200).json({nombre,
      choristesNominer: await Promise.all(choristesNominer.map(async choriste => {
        const candidat = await Personne.findOne({ _id: choriste.candidatId });
    
        return {
          nom: candidat ? `${candidat.nom} ${candidat.prenom}` : 'Nom inconnu',
          email: candidat ? ` ${candidat.email}` : 'email inconnu',
          cin: candidat ? `${candidat.cin}` : 'cin inconnu',
          role: choriste.role,
          statutAcutel: choriste.statutAcutel,
          telephone:candidat ? `${candidat.telephone}`:'telephone',
          sexe: candidat ? `${candidat.sexe}`: 'sexe inconnu',

        };
      })),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des choristes nominés:', error);
    return res.status(500).json({ erreur: 'Erreur lors de la récupération des choristes nominés.' });
  }
};


const getChoristesEliminer = async (req, res) => {
  try {
    const choristesEliminer = await Choriste.find({ etat: 'eliminer' });

    if (choristesEliminer.length === 0) {
      return res.status(200).json({ message: 'Aucun choriste n est actuellement eliminé.' });
    }
    
   const nombre = choristesEliminer.length;
    return res.status(200).json({nombre,
      choristesEliminer: await Promise.all(choristesEliminer.map(async choriste => {
        const candidat = await Personne.findOne({ _id: choriste.candidatId });
    
        return {
          nom: candidat ? `${candidat.nom} ${candidat.prenom}` : 'Nom inconnu',
          email: candidat ? ` ${candidat.email}` : 'email inconnu',
          cin: candidat ? `${candidat.cin}` : 'cin inconnu',
          role: choriste.role,
          statutAcutel: choriste.statutAcutel,
          telephone:candidat ? `${candidat.telephone}`:'telephone',
          sexe: candidat ? `${candidat.sexe}`: 'sexe inconnu',

        };
      })),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des choristes eliminés:', error);
    return res.status(500).json({ erreur: 'Erreur lors de la récupération des choristes Eliminer.' });
  }
};



const demanderAbsence = async (req, res) => {
  
  try {
    const io = req.app.io;
    const var1=io;
    const { error, value } = absenceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ erreur: error.details[0].message });
    }

    const { date, RaisonAbsence, repetition, concert } = value;
    const choriste = req.choristeId;
    console.log("verife choriste",choriste)
    const choristed= await Choriste.findOne({_id:choriste});
    const verif =choristed.etat;
    console.log("hedhi mtaa eta",verif)
    if(verif ==='eliminer'){
      return res.status(200).json("vous etes actuellement eliminer")
    }else{

    const nouvelleAbsence = new AbsencePresence({
      etat: repetition ? false : undefined,
      CurrentDate: date,
      RaisonAbsence,
      choriste:choristed,
      repetition,
      concert,
     
    });
    await nouvelleAbsence.save();
    console.log(choristed)
    await verifierSeuilNomination(choristed,var1);
    // Répondre avec un message de succès
  
    return res.status(201).json({ message: 'Demande d absence soumise avec succès.' });
 } } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};


//:::::::::::::::::::::::::::::
 const getAbsencesForChoriste = async (req, res) => {
  try {
    const choristed = req.choristeId; 
    console.log(choristed)

     // Vérifier si le choriste existe avant de rechercher ses absences
     const choriste = await Choriste.findById(choristed);
     if (!choriste) {
       return res.status(404).json({ message: 'Choriste non trouvé.' });
     }
     const absences = await AbsencePresence.find({ 'choriste': choristed }).populate({
      path: 'concert',
      select: 'date lieu',
    }).populate({
      path:'repetition',
      select:'date lieu',
    }).exec();

    const nombreAbsences = absences.length;
console.log(nombreAbsences)
    res.status(200).json({nombreAbsences,absences:absences });

  } catch (error) {
    console.error('Erreur lors de la récupération des absences:', error);
    res.status(500).json({ error: error.message, message: 'Erreur lors de la récupération des absences.' });
  }
};



const mettreAJourSeuil = async (req, res) => {
  try {
    const { seuilNomine, seuilElimine } = req.body;
    console.log(seuilNomine,seuilElimine)

    if (seuilNomine === undefined || seuilElimine === undefined) {
      return res.status(400).json({ error: 'Les deux seuils sont requis.' });
    }
    await AbsencePresence.mettreAJourSeuils(seuilNomine, seuilElimine);
    return res.status(200).json({ message: 'Seuils mis à jour avec succès. Les nouveaux valeur de seuil Elimine et Nomine sont',seuilNomine,seuilElimine });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des seuils :', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour des seuils.' });
  }
};


const eliminerChoriste = async (req, res) => {
  try {
    const choristeId = req.params.id;

    const choriste = await Choriste.findById(choristeId);

    if (!choriste) {
      return res.status(404).json({ message: 'Choriste non trouvé.' });
    }
    choriste.etat = 'eliminer';
    choriste.statutAcutel = 'inactif';
    await choriste.save();
    return res.status(200).json({ message: 'Choriste éliminé  pour une raison disciplinaire.' });
  } catch (error) {
    console.error('Erreur lors de l\'élimination du choriste :', error);
    return res.status(500).json({ error: 'Erreur lors de l\'élimination du choriste.' });
  }
};



module.exports = {
  getAbsencesForChoriste,
  demanderAbsence,
  getChoristesNominer,
  getChoristesEliminer,
  mettreAJourSeuil,
  eliminerChoriste
};
