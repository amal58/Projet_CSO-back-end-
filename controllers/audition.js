const Audition = require('../models/audition');
const Personne = require('../models/personne');
const nodemailer = require('nodemailer');

exports.generateAuditions = async (req, res, next) => {
  try {
    const { dateDebut, nombreCandidatsParHeure, heureDebut, heureFin } = req.body;

    const plageHoraireDebut = new Date(`${dateDebut}T${heureDebut}`);
    const plageHoraireFin = new Date(`${dateDebut}T${heureFin}`);

    // Trouver tous les candidats
    const candidats = await Personne.find({ role: 'candidat' });

    // Générer les auditions
    const auditions = [];
    let dateAudition = new Date(plageHoraireDebut);

    for (let i = 0; i < candidats.length; i += 2) {
      if (dateAudition > plageHoraireFin) {
        // Si la plage horaire est terminée, passer au jour suivant
        dateAudition = new Date(`${dateDebut}T${heureDebut}`);
        dateAudition.setDate(dateAudition.getDate() + 1); // Passer au jour suivant
      }

      auditions.push({
        date: dateAudition.toISOString(),
        heureDebut: dateAudition.toISOString(),
        candidat: candidats[i]._id,
      });

      auditions.push({
        date: dateAudition.toISOString(),
        heureDebut: dateAudition.toISOString(),
        candidat: candidats[i + 1]._id,
      });

      // Passer à l'heure suivante
      dateAudition.setTime(dateAudition.getTime() + (60 * 60 * 1000));
    }

    // Enregistrer les auditions dans la base de données
    const createdAuditions = await Audition.insertMany(auditions);

    // Configuration du transporteur nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      secureConnection:false,
      port: 587,
      tls:{
        ciphers:'SSLv3',
      },
      auth: {
        user: 'simaatest@outlook.com',
        pass: 'SIMAA test2012',
      },
      // Ajoutez ces options pour augmenter le délai d'attente (en millisecondes)
      connectionTimeout: 5000,
      greetingTimeout: 10000,
      socketTimeout: 15000,

    });

    const destinationEmail = 'hesemi6841@mcenb.com'; // Remplacez par votre adresse e-mail

    // Envoi des e-mails d'invitation
    for (const audition of createdAuditions) {
      const candidat = await Personne.findById(audition.candidat);

      const mailOptions = {
        from: 'simaatest@outlook.com',
        to: destinationEmail,
        subject: 'Invitation à audition',
        text: `Cher ${candidat.prenom},\n\nVous êtes invité(e) à participer à l'audition le ${audition.date} à ${audition.heureDebut}.\n\nCordialement,\nVotre équipe d'audition`,
      };

      // Envoyer l'e-mail
      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({
      message: 'Auditions générées avec succès',
      auditions: createdAuditions,
    });
  } catch (error) {
    console.error('Erreur lors de la génération des auditions :', error);
    res.status(500).json({
      message: 'Erreur lors de la génération des auditions',
      error: error.message,
    });
  }
};
