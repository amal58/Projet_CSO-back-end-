const Audition = require('../models/audition');
const Personne = require('../models/personne');
const nodemailer = require('nodemailer');


exports.generateAuditions = async (req, res, next) => {
  try {
    const { dateDebut, nombreCandidatsParHeure, heureDebut, heureFin } = req.body;

    const plageHoraireDebut = new Date(`${dateDebut}T${heureDebut}`);
    const plageHoraireFin = new Date(`${dateDebut}T${heureFin}`);


    const candidats = await Personne.find();

    
    const auditions = [];
    let dateAudition = new Date(plageHoraireDebut);

    for (let i = 0; i < candidats.length; i += 2) {
      if (dateAudition > plageHoraireFin) {
        
        dateAudition = new Date(`${dateDebut}T${heureDebut}`);
        dateAudition.setDate(dateAudition.getDate() + 1); // Passer au jour suivant
      }

      auditions.push({
        date: dateAudition.toISOString(),
        heureDebut: dateAudition.toISOString(),
        candidat: candidats[i]._id,
      });

      if (candidats[i + 1]) {
        auditions.push({
          date: dateAudition.toISOString(),
          heureDebut: dateAudition.toISOString(),
          candidat: candidats[i + 1]._id,
        });}

      dateAudition.setTime(dateAudition.getTime() + (60 * 60 * 1000));
    }

   
    const createdAuditions = await Audition.insertMany(auditions);


    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',

      secureConnection: false,

      port: 587,
      tls: {
        ciphers: 'SSLv3',
      },
      auth: {


        user: 'simaasaadin@outlook.com',
        pass: 'SIMAA test2012',

      },
    
      connectionTimeout: 5000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const destinationEmail = 'saadsimaa@gmail.com'; // Remplacez par votre adresse e-mail


    
    for (const audition of createdAuditions) {
      const candidat = await Personne.findById(audition.candidat);

      // const candidatemail = "saadsimaa@gmail.com";
      const mailOptions = {


        from: 'simaasaadin@outlook.com',

        to: destinationEmail,
        subject: 'Invitation à audition',
        text: `Cher(e) ${candidat.prenom},\n\nVous êtes invité(e) à participer à l'audition le ${audition.date} à ${audition.heureDebut}.\n\nCordialement,\nVotre équipe d'audition`,
      };

    
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


exports.generateAdditionalAuditions = async (req, res, next) => {
  try {
    const { listeCandidats, nombreCandidatsParHeure, heureDebut, heureFin, dateDebut } = req.body;


    const candidats = await Personne.find({ email: { $in: listeCandidats } });

    
    const auditions = [];
    let dateAudition = new Date(`${dateDebut}T${heureDebut}`);

    for (let i = 0; i < candidats.length; i += nombreCandidatsParHeure) {
      if (dateAudition > new Date(`${dateDebut}T${heureFin}`)) {
      
        dateAudition = new Date(`${dateDebut}T${heureDebut}`);
        dateAudition.setDate(dateAudition.getDate() + 1); // Passer au jour suivant
      }

      for (let j = 0; j < nombreCandidatsParHeure; j++) {
        const candidat = candidats[i + j];
        if (candidat) {
          auditions.push({
            date: dateAudition.toISOString(),
            heureDebut: dateAudition.toISOString(),
            candidat: candidat._id,
          });
        }
      }

     
      dateAudition.setTime(dateAudition.getTime() + (60 * 60 * 1000));
    }

    
    const createdAuditions = await Audition.insertMany(auditions);


    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: 'SSLv3',
      },
      auth: {
        user: 'simaasaadin@outlook.com',


        pass: 'SIMAA test2012',

      },
      
      connectionTimeout: 5000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const destinationEmail = 'saadsimaa@gmail.com'; 


    for (const audition of createdAuditions) {
      const candidat = await Personne.findById(audition.candidat);
      
      const mailOptions = {
        from: 'simaasaadin@outlook.com',


        to: destinationEmail,

        subject: 'Invitation à audition',
        text: `Cher ${candidat.prenom},\n\nVous êtes invité(e) à participer à l'audition le ${audition.date} à ${audition.heureDebut}.\n\nCordialement,\nVotre équipe d'audition`,
      };

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
exports.getAllAuditions = async (req, res, next) => {
  try {
    const auditions = await Audition.find();
    res.status(200).json({
      message: 'Toutes les auditions récupérées avec succès',
      auditions: auditions,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les auditions :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de toutes les auditions',
      error: error.message,
    });
  }
};

exports.getAuditionsForCandidate = async (req, res, next) => {
  try {
    const candidatId = req.params.candidatId;

   
    const candidat = await Personne.findById(candidatId);

    if (!candidat) {
      return res.status(404).json({
        message: 'Candidat non trouvé',
      });
    }

   
    const auditions = await Audition.find({ candidat: candidatId });

    res.status(200).json({
      message: `Auditions pour le candidat ${candidatId} récupérées avec succès`,
      auditions: auditions,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des auditions pour le candidat :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des auditions pour le candidat',
      error: error.message,
    });
  }
};


exports.getAuditionsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;

  
    const formattedDate = date.split('T')[0];


    const auditions = await Audition.find({
      date: { $gte: new Date(`${formattedDate}T00:00:00.000Z`), $lt: new Date(`${formattedDate}T23:59:59.999Z`) },
    });

    res.status(200).json({
      message: `Auditions pour la date ${formattedDate} récupérées avec succès`,
      auditions: auditions,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des auditions par date :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des auditions par date',
      error: error.message,
    });
  }
};
exports.getAuditionsByHeure = async (req, res) => {
  try {
    const heureParam = req.params.heure;
    const dateParam = req.params.date;

 
    const formattedDate = new Date(`${dateParam}T${heureParam}`);
    if (isNaN(formattedDate.valueOf())) {
      throw new Error('Date ou heure invalide');
    }


    const heureFin = new Date(formattedDate);
    heureFin.setHours(heureFin.getHours() + 1);

    const auditions = await Audition.find({
      $and: [
        { heureDebut: { $gte: formattedDate.toISOString() } },
        { heureDebut: { $lt: heureFin.toISOString() } },
      ],
    });

    res.status(200).json({
      message: `Auditions récupérées avec succès pour l'heure ${heureParam} et la date ${dateParam}`,
      auditions: auditions,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des auditions par heure :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des auditions par heure',
      error: error.message,
    });
  }
};






