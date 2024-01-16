const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const express = require('express');
const validator = require('validator');
const Personne = require('../models/personne'); 
const PersonneInitiale = require('../models/personneInitiale'); 
require('dotenv').config();

const router = express.Router();
const emailVerificationCache = new Map();

exports.sendEmailController = async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;

    if (!nom || !prenom || !email) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs du formulaire.' });
    }

    const token = jwt.sign({ nom, prenom, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: '#' + process.env.PASSWORD + '#',
      },
    });

    const mailOptions = {
      from: 'CSO2024@outlook.com',
      to: email,
      subject: 'Validation email',
      text: `Bonjour ${prenom} ${nom},\n\nCeci est un message de validation email. Cliquez sur le lien suivant pour confirmer votre email : http://localhost:5000/validerMail/valider-email/${token}`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `Email envoyé : ${info.response}` });
  } catch (error) {
    res.status(500).json({ error: `Erreur d'envoi de l'e-mail : ${error.message}` });
  }
};

exports.validerEmail = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({ message: 'Token non saisi' });
  }

  let decodedData;

  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Token non valide' });
  }

  const { nom, prenom, email } = decodedData;
  console.log(nom + ' ' + prenom + ' ' + email);

  try {
    const emailExiste = await PersonneInitiale.exists({ email });
    if (emailExiste) {
      return res.status(400).json({ error: 'Cet email est déjà enregistré.' });
    }

    const personneInitiale = new PersonneInitiale({ nom, prenom, email });

    await personneInitiale.validate();

    await personneInitiale.save();

    return res.status(201).json({
      model: PersonneInitiale,
      message: 'Personne enregistrée avec succès',
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = {};

      for (const field in error.errors) {
        if (error.errors.hasOwnProperty(field)) {
          validationErrors[field] = error.errors[field].message;
        }
      }

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

