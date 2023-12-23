const Choriste = require('../models/choriste');
const Personne=require('../models/personne')

const updateStatus = async (choristeId, anneeIntegration) => {
  try {
    // Récupérer le choriste
    const choriste = await Choriste.findById(choristeId);

    if (!choriste) {
      throw new Error('Choriste non trouvé');
    }

    // Calculer la différence d'années entre maintenant et l'année d'intégration
    const differenceAnnees = new Date().getFullYear() - anneeIntegration.getFullYear();

    if (anneeIntegration.getFullYear() === 2018) {
      // Mettre à jour l'historique des statuts avec l'ancien statut actuel et l'année précédente
      const saisonPrecedenteExiste = choriste.historiqueStatut.some(
        (statut) => statut.saison === new Date().getFullYear() - 1
      );
      if (!saisonPrecedenteExiste) {
        choriste.historiqueStatut.push({
          saison: new Date().getFullYear() - 1,
          statut: choriste.statutAcutel,
        });
        choriste.statutAcutel = 'veteran';
      } else {
        console.error('existe déjà un statut dans cette saison veteran');
      }
    }

    // Vérifier si le statut actuel est 'junior'
    else if (differenceAnnees === 1) {
      const saisonPrecedenteExiste = choriste.historiqueStatut.some(
        (statut) => statut.saison === new Date().getFullYear() - 1
      );
      if (!saisonPrecedenteExiste) {
        // Mettre à jour le statut actuel en 'choriste' pour la 2ème saison
        choriste.historiqueStatut.push({
          saison: new Date().getFullYear() - 1,
          statut: choriste.statutAcutel,
        });
        choriste.statutAcutel = 'choriste';
      } else {
        console.error('existe déjà un statut dans cette saison choriste');
      }
    }

    // Vérifier si le statut actuel est 'senior'
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
      } else {
        console.error('existe déjà un statut dans cette saison senior');
      }
    }

    // Enregistrer les modifications
    await choriste.save();
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut :', error.message);
    throw new Error('Erreur lors de la mise à jour du statut');
  }
};




//consulter profil + status + historique statut
const consulterProfil = async (req, res) => {
  try {
    const choristeId = req.params.id;

    // Récupérer le choriste en vérifiant le rôle
    const choriste = await Choriste.findOne({ _id: choristeId, role: 'choriste' });

    if (!choriste) {
      return res.status(404).json({ message: 'Choriste non trouvé' });
    }

    // Assurez-vous que vous avez la date d'intégration correcte
    const candidat = await Personne.findOne({ _id: choriste.candidatId });
    if (!candidat || !candidat.createdAt || !(candidat.createdAt instanceof Date)) {
      return res.status(404).json({ message: 'Candidat non trouvé ou date d\'intégration non valide' });
    }

    // Appeler updateStatus avant de récupérer les données du profil
    await updateStatus(choristeId, candidat.createdAt);

    // Récupérer le candidat associé au choriste
    const updatedChoriste = await Choriste.findOne({ _id: choristeId, role: 'choriste' });
    const updatedCandidat = await Personne.findOne({ _id: updatedChoriste.candidatId });

    // Retourner les détails du profil mis à jour, le statut actuel et l'historique des statuts
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
        // Ajoutez d'autres champs du modèle Personne au besoin
      },
      historiqueStatut: updatedChoriste.historiqueStatut,
    });
  } catch (error) {
    console.error('Erreur lors de la consultation du profil et du statut actuel du choriste :', error);
    res.status(500).json({ error: 'Erreur interne du serveur', message: error.message });
  }
};


module.exports = {
  consulterProfil,
};
