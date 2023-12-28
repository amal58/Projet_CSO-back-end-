const { AbsencePresence,absenceValidationSchema } = require('../models/absencepresence');
const Choriste =require('../models/choriste')
const Repetition=require('../models/repetition')
const socketIo = require('socket.io');
const app=require('../app')


const verifierSeuilNomination = async (choristeId ,req) => {

  const nombreAbsences = await AbsencePresence.countDocuments({ choriste: choristeId });
  console.log(nombreAbsences)
  const verif = await AbsencePresence.findOne()
  console.log(verif.seuilelimine)
  console.log(verif.seuilnomine)
  // Vérifier si le nombre d'absences dépasse le seuil de nomination
  if (nombreAbsences >= verif.seuilnomine) {
    // Mettre à jour l'état du choriste en "nominé"
    await Choriste.findByIdAndUpdate(choristeId, { etat: 'nominer' });
    console.log(choristeId)
  
    // Émettez une notification via WebSocket avec un message personnalisé
     const message = "Attention !! Suite à votre nombre d'absence vous etes actuellement nominé " +nombreAbsences +" absence";
     req.emit('notification', {message}); 
  
    
  }
  if(nombreAbsences >= verif.seuilelimine){
    // Mettre à jour l'état du choriste en "nominé"
    await Choriste.findByIdAndUpdate(choristeId, { etat: 'eliminer',statutAcutel:'inactif' });
 
    //envoyer notification
    const message = "Suite à votre nombre d'absence vous etes actuellement éliminé "+nombreAbsences +" absence";
    req.emit('notification', {message}); 
  }
  
};
 


const getChoristesNominer = async (req, res) => {
  try {
    // Récupérer tous les choristes dont l'état est "nominé"
    const choristesNominer = await Choriste.find({ etat: 'nominer' });

    // Vérifier si la liste est vide
    if (choristesNominer.length === 0) {
      // Envoyer un message si la liste est vide
      return res.status(200).json({ message: 'Aucun choriste n est actuellement nominé.' });
    }

    return res.status(200).json(choristesNominer);
  } catch (error) {
    console.error('Erreur lors de la récupération des choristes nominés:', error);
    // Envoyer une réponse avec un code d'erreur en cas d'erreur
    return res.status(500).json({ erreur: 'Erreur lors de la récupération des choristes nominés.' });
  }
};


const getChoristesEliminer = async (req, res) => {
  try {
    // Récupérer tous les choristes dont l'état est "nominé"
    const choristesEliminer = await Choriste.find({ etat: 'eliminer' });

    // Vérifier si la liste est vide
    if (choristesEliminer.length === 0) {
      // Envoyer un message si la liste est vide
      return res.status(200).json({ message: 'Aucun choriste n est actuellement eliminé.' });
    }

    return res.status(200).json(choristesEliminer);
  } catch (error) {
    console.error('Erreur lors de la récupération des choristes eliminés:', error);
    // Envoyer une réponse avec un code d'erreur en cas d'erreur
    return res.status(500).json({ erreur: 'Erreur lors de la récupération des choristes Eliminer.' });
  }
};



// Fonction pour gérer la demande d'absence pour une répétition ou un concert
const demanderAbsence = async (req, res) => {
  
  try {
    const io = req.app.io;
    const var1=io;
    const { error, value } = absenceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ erreur: error.details[0].message });
    }

    // Extraire les informations pertinentes de la requête
    const { date, RaisonAbsence, choriste, repetition, concert } = value;
    const choristed= await Choriste.findOne({_id:choriste});
    const verif =choristed.etat;
    console.log(verif)
    if(verif ==='eliminer'){
      return res.status(200).json("vous etes actuellement eliminer")
    }else{
    // Créer un nouveau document d'absence
    const nouvelleAbsence = new AbsencePresence({
      etat: repetition ? false : undefined,
      CurrentDate: date,
      RaisonAbsence,
      choriste,
      repetition,
      concert,
     
    });

    // Enregistrer le document d'absence dans la base de données
    await nouvelleAbsence.save();
    console.log(choriste)
    await verifierSeuilNomination(choriste,var1);
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
    const choristeId = req.params.id; 
    console.log(choristeId)

     // Vérifier si le choriste existe avant de rechercher ses absences
     const choriste = await Choriste.findById(choristeId);
     if (!choriste) {
       return res.status(404).json({ message: 'Choriste non trouvé.' });
     }
     const absences = await AbsencePresence.find({ 'choriste': choristeId }).populate({
      path: 'concert',
      select: 'date lieu',
    }).populate({
      path:'repetition',
      select:'date lieu',
    }).exec();


    res.status(200).json({ absences });

  } catch (error) {
    console.error('Erreur lors de la récupération des absences:', error);
    res.status(500).json({ error: error.message, message: 'Erreur lors de la récupération des absences.' });
  }
};



// Mettre à jour les seuils avec les valeurs fournies dans req.body
const mettreAJourSeuil = async (req, res) => {
  try {
    const { seuilNomine, seuilElimine } = req.body;
    console.log(seuilNomine,seuilElimine)

    if (seuilNomine === undefined || seuilElimine === undefined) {
      return res.status(400).json({ error: 'Les deux seuils sont requis.' });
    }

    // Appeler la méthode statique pour mettre à jour les seuils
    await AbsencePresence.mettreAJourSeuils(seuilNomine, seuilElimine);
    return res.status(200).json({ message: 'Seuils mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des seuils :', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour des seuils.' });
  }
};


module.exports = {
  getAbsencesForChoriste,
  demanderAbsence,
  getChoristesNominer,
getChoristesEliminer,
mettreAJourSeuil
};
