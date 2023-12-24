const Audition = require('../models/audition');
const Personne = require('../models/personne');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const express = require('express');
const PersonneInitiale = require('../models/personneInitiale'); // Assurez-vous que le modèle Personne est importé correctement
require('dotenv').config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.lancerAudition = async (req, res) => {
  try {
    // Extraire la liste des emails depuis la table PersonneInitiale
    const personnesInitiales = await PersonneInitiale.find();
    
    // Valider si la liste est vide
    if (personnesInitiales.length === 0) {
      return res.status(400).json({ error: 'Aucun mail vérifiée.' });
    }

    // Envoyer un e-mail à chaque personne initiale avec un délai entre les envois
    const promises = personnesInitiales.map(async (personneInitiale, index) => {
      const { nom, prenom, email } = personneInitiale;

      // Générer un token unique pour le lien de confirmation
      const token = jwt.sign({ nom, prenom, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Configurer le transporteur pour l'envoi d'e-mail
      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // Utilisez false si vous utilisez le port 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: '#' + process.env.PASSWORD + '#',
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });

      // Options de l'e-mail
      const mailOptions = {
        from: 'youssefabdi55@outlook.fr',
        to: email,
        subject: 'Validation email',
        text: `Bonjour ${prenom} ${nom},\n\nCeci est un message de validation email. Cliquez sur le lien suivant pour confirmer votre email : http://localhost:5000/api/auditions/validerEmailFormulaire/${token}`,
      };

      // Attente de 1 seconde entre les envois (ajustez selon vos besoins)
      if (index > 0) {
        await delay(1000);
      }

      // Envoyer l'e-mail
      const info = await transporter.sendMail(mailOptions);

      return { email, message: `Email envoyé : ${info.response}` };
    });

    // Attendre que toutes les promesses soient résolues
    const results = await Promise.all(promises);

    res.status(200).json({ messages: results });
  } catch (error) {
    res.status(500).json({ error: `Erreur d'envoi des e-mails : ${error.message}` });
  }
};

exports.validerEmailFormulaire = async (req, res) => {
  console.log('validerEmailFormulaire called')
  const { token } = req.params;
  let decodedData;
  // Vérifier le token
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Token non valide' });
  }

  // Les données du token sont disponibles dans l'objet decodedData
  const { nom, prenom, email } = decodedData;
  console.log(nom + ' ' + prenom + ' ' + email);

  return res.status(200).json({ token });
};
exports.enregistrerPersonne = async (req, res) => {
  const { token } = req.params;

  // Utiliser le token pour récupérer les informations de l'utilisateur
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: 'Token non valide' });
    }

    try {
      const { nom, prenom, email } = decoded;
      console.log(nom + ' ' + prenom + ' ' + email);

      // Check if a person with the same email, name, and surname already exists
      const existingPerson = await Personne.findOne({ email });

      if (existingPerson) {
        return res.status(400).json({ error: 'Candidat avec le même email déjà enregistrée.' });
      }

      if (req.body.email !== email) {
        return res.status(400).json({ error: 'Vous pouvez enregistrer avec votre email seulement' });
      }

      if (req.body.nom.toLowerCase() !== nom.toLowerCase()) {
        return res.status(400).json({ error: 'Vérifiez votre nom' });
      }

      if (req.body.prenom.toLowerCase() !== prenom.toLowerCase()) {
        return res.status(400).json({ error: 'Vérifiez votre prénom' });
      }

      // Créer une instance de Personne avec les champs du formulaire
      const personne = new Personne(req.body);

      // Valider l'instance de Personne
      await personne.validate();

      // Enregistrer la Personne dans la base de données
      await personne.save();

      res.status(201).json({
        model: Personne,
        message: 'Candidature enregistrée avec succès',
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = {};

        // Accumuler les erreurs de validation sans interrompre l'exécution
        for (const field in error.errors) {
          if (error.errors.hasOwnProperty(field)) {
            validationErrors[field] = error.errors[field].message;
          }
        }

        // Envoyer les erreurs de validation accumulées en tant que partie de la réponse
        res.status(400).json({
          error: 'Erreur de validation',
          validationErrors,
        });
      } else {
        console.error('Erreur lors de l\'enregistrement du candidat :', error.message);
        res.status(500).json({
          error: 'Erreur lors de l\'enregistrement de candidat',
        });
      }
    }
  });
};
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