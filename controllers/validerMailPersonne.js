// appController.js
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const express = require('express');
const validator = require('validator');
const Personne = require('../models/personne'); // Assurez-vous que le modèle Personne est importé correctement
const PersonneInitiale = require('../models/personneInitiale'); // Assurez-vous que le modèle Personne est importé correctement
require('dotenv').config();

const router = express.Router();
const emailVerificationCache = new Map();

// Contrôleur pour l'envoi de l'e-mail
// Contrôleur pour l'envoi de l'e-mail
exports.sendEmailController = async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;

    // Valider les champs du formulaire
    if (!nom || !prenom || !email) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs du formulaire.' });
    }

    // Générer un token unique pour le lien de confirmation
    const token = jwt.sign({ nom, prenom, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Configurer le transporteur pour l'envoi d'e-mail
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: '#' + process.env.PASSWORD + '#',
      },
    });

    // Options de l'e-mail
    const mailOptions = {
      from: 'youssefabdi55@outlook.fr',
      to: email,
      subject: 'Validation email',
      text: `Bonjour ${prenom} ${nom},\n\nCeci est un message de validation email. Cliquez sur le lien suivant pour confirmer votre email : http://localhost:5000/validerMail/valider-email/${token}`,
    };

    // Envoyer l'e-mail
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `Email envoyé : ${info.response}` });
  } catch (error) {
    res.status(500).json({ error: `Erreur d'envoi de l'e-mail : ${error.message}` });
  }
};

exports.validerEmail = async (req, res) => {
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

  try {
    // Vérifier si l'email existe déjà dans la base de données
    const emailExiste = await PersonneInitiale.exists({ email });

    if (emailExiste) {
      return res.status(400).json({ error: 'Cet email est déjà enregistré.' });
    }

    // Créer une instance de PersonneInitiale avec les champs du formulaire
    const personneInitiale = new PersonneInitiale({ nom, prenom, email });

    // Valider l'instance de PersonneInitiale
    await personneInitiale.validate();

    // Enregistrer la PersonneInitiale dans la base de données
    await personneInitiale.save();

    return res.status(201).json({
      model: PersonneInitiale,
      message: 'Personne enregistrée avec succès',
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
      return res.status(400).json({
        error: 'Erreur de validation',
        validationErrors,
      });
    } else {
      console.error('Erreur lors de l\'enregistrement de la Personne :', error.message);
      return res.status(500).json({
        error: 'Erreur lors de l\'enregistrement de la Personne',
      });
    }
  }
};

