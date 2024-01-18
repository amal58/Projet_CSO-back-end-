const Choriste = require('../models/choriste');
const Personne=require('../models/personne')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

const updateStatus = async (choristeId, anneeIntegration) => {
  try {

    const choriste = await Choriste.findById(choristeId);

    if (!choriste) {
      throw new Error('Choriste non trouvé');
    }
    const candidatAssocie = await Personne.findById(choriste.candidatId);
    const differenceAnnees = new Date().getFullYear() - anneeIntegration.getFullYear();

    if (anneeIntegration.getFullYear() === 2018) {

      const saisonPrecedenteExiste = choriste.historiqueStatut.some(
        (statut) => statut.saison === new Date().getFullYear() - 1
      );
      if (!saisonPrecedenteExiste) {
        choriste.historiqueStatut.push({
          saison: new Date().getFullYear() - 1,
          statut: choriste.statutAcutel,
        });
        choriste.statutAcutel = 'veteran';
        notifierAuChefDePupitre(candidatAssocie.nom,candidatAssocie.prenom,choriste.statutAcutel);
      } else {
        console.error('existe déjà un statut dans cette saison veteran');
      }
    }

    else if (differenceAnnees === 1) {
      const saisonPrecedenteExiste = choriste.historiqueStatut.some(
        (statut) => statut.saison === new Date().getFullYear() - 1
      );
      if (!saisonPrecedenteExiste) {
        choriste.historiqueStatut.push({
          saison: new Date().getFullYear() - 1,
          statut: choriste.statutAcutel,
        });
        choriste.statutAcutel = 'choriste';
        notifierAuChefDePupitre(candidatAssocie.nom,candidatAssocie.prenom,choriste.statutAcutel);
      } else {
        console.error('existe déjà un statut dans cette saison choriste');
      }
    }

    else if (differenceAnnees >= 2) {
      const saisonPrecedenteExiste = choriste.historiqueStatut.some(
        (statut) => statut.saison === new Date().getFullYear() - 1
      );

      if (!saisonPrecedenteExiste) {
        choriste.historiqueStatut.push({
          saison: new Date().getFullYear() - 1,
          statut: choriste.statutAcutel,
        });
        choriste.statutAcutel = 'senior';
        notifierAuChefDePupitre(candidatAssocie.nom,candidatAssocie.prenom,choriste.statutAcutel);
      } else {
        console.error('existe déjà un statut dans cette saison senior');
      }
    }

    await choriste.save();
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut :', error.message);
    throw new Error('Erreur lors de la mise à jour du statut');
  }
};


const consulteProfilAdmin = async (req, res) => {
  try {
    const choristeId = req.params.id;

    const choriste = await Choriste.findOne({ _id: choristeId, role: 'choriste' });

    if (!choriste) {
      return res.status(404).json({ message: 'Choriste non trouvé' });
    }

    const candidat = await Personne.findOne({ _id: choriste.candidatId });
    if (!candidat || !candidat.createdAt || !(candidat.createdAt instanceof Date)) {
      return res.status(404).json({ message: 'Candidat non trouvé ou date d\'intégration non valide' });
    }

    await updateStatus(choristeId, candidat.createdAt);

    const updatedChoriste = await Choriste.findOne({ _id: choristeId, role: 'choriste' });
    const updatedCandidat = await Personne.findOne({ _id: updatedChoriste.candidatId });

    res.json({
      profil: {
        _id: updatedCandidat._id,
        nom: updatedCandidat.nom,
        prenom: updatedCandidat.prenom,
        statutActuel: updatedChoriste.statutAcutel,
        role: updatedChoriste.role,
        dateNaissance: updatedCandidat.dateNaissance,
        cin: updatedCandidat.cin,
        telephone: updatedCandidat.telephone,
        AnneeIntegration: updatedCandidat.createdAt.getFullYear(),
      },
      historiqueStatut: updatedChoriste.historiqueStatut,
    });
  } catch (error) {
    console.error('Erreur lors de la consultation du profil et du statut actuel du choriste :', error);
    res.status(500).json({ error: 'Erreur interne du serveur', message: error.message });
  }
};


const consulterProfil = async (req, res) => {
  try {
    const { choristeId } = req.params;
    // const choristeId = req.choristeId; 

    console.log(choristeId)
    const choriste = await Choriste.findOne({ _id: choristeId, role: 'choriste' });

    if (!choriste) {
      return res.status(404).json({ message: 'Choriste non trouvé' });
    }

    const candidat = await Personne.findOne({ _id: choriste.candidatId });
    if (!candidat || !candidat.createdAt || !(candidat.createdAt instanceof Date)) {
      return res.status(404).json({ message: 'Candidat non trouvé ou date d\'intégration non valide' });
    }

    await updateStatus(choristeId, candidat.createdAt);

    const updatedChoriste = await Choriste.findOne({ _id: choristeId, role: 'choriste' });
    const updatedCandidat = await Personne.findOne({ _id: updatedChoriste.candidatId });

    res.json({
      profil: {
        _id: updatedCandidat._id,
        nom: updatedCandidat.nom,
        prenom: updatedCandidat.prenom,
        statutActuel: updatedChoriste.statutAcutel,
        role: updatedChoriste.role,
        dateNaissance: updatedCandidat.dateNaissance,
        cin: updatedCandidat.cin,
        telephone: updatedCandidat.telephone,
        AnneeIntegration: updatedCandidat.createdAt.getFullYear(),
      },
      historiqueStatut: updatedChoriste.historiqueStatut,
    });
  } catch (error) {
    console.error('Erreur lors de la consultation du profil et du statut actuel du choriste :', error);
    res.status(500).json({ error: 'Erreur interne du serveur', message: error.message });
  }
};

const notifierAuChefDePupitre = (nom, prenom, nouvelleStatut) => {

    cron.schedule('*/1 * * * *', () => { // Exécute toutes les minutes, vous pouvez ajuster le timing selon vos besoins
      console.log(`Notification envoyée au chef de pupitre - ${nom} ${prenom} - Nouvelle tessiture : ${nouvelleStatut}`);
    });
  };





module.exports = {
  consulterProfil,
  consulteProfilAdmin
};