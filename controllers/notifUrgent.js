const Notification = require('../models/notifUrgent');

exports.gererChangementHoraireLieu = async (req, res) => {
  try {
    const { nouvelHoraire, nouveauLieu } = req.body;
    const choristesConcernes = req.body.choristesConcernes;

    // Enregistrez le nouvel horaire et/ou lieu dans votre base de données
    // ...

    // Créez une notification pour chaque choriste concerné
    const notifications = await Promise.all(
      choristesConcernes.map(async (idChoriste) => {
        const notification = new Notification({
          content: `Changement d'horaire ou de lieu : Nouvel horaire - ${nouvelHoraire}, Nouveau lieu - ${nouveauLieu}`,
          type: 'changement_horaire_lieu',
          recipient: idChoriste,
        });
        return notification.save();
      })
    );

    // Envoyez les notifications (par exemple, par e-mail)
    // ...

    res.status(200).json({ message: 'Changements d\'horaire et de lieu traités avec succès', notifications });
  } catch (error) {
    console.error('Erreur lors de la gestion du changement d\'horaire et de lieu :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};