const Audition = require('../models/audition');
const Personne = require('../models/personne');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const express = require('express');
const PersonneInitiale = require('../models/personneInitiale'); 
require('dotenv').config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.lancerAudition = async (req, res) => {
  try {
    const msg = req.body.message ;
    const personnesInitiales = await PersonneInitiale.find();  
    if (personnesInitiales.length === 0) {
      return res.status(400).json({ error: 'Aucun mail vérifiée.' });
    }

      const promises = personnesInitiales.map(async (personneInitiale, index) => {
      const { nom, prenom, email } = personneInitiale;

      const token = jwt.sign({ nom, prenom, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, 
        auth: {
          user: process.env.EMAIL_USER,
          pass: '#' + process.env.PASSWORD + '#',
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });

      const mailOptions = {
        from: 'CSO2024@outlook.com',
        to: email,
        subject: 'Lancement audition',
        text: `Bonjour ${prenom} ${nom},\n\n ${msg} http://localhost:5000/api/auditions/validerEmailFormulaire/${token}`,
      };

      if (index > 0) {
        await delay(1000);
      }

      const info = await transporter.sendMail(mailOptions);

      return { email, message: `Email envoyé : ${info.response}` };
    });

    const results = await Promise.all(promises);

    res.status(200).json({ messages: results });
  } catch (error) {
    res.status(500).json({ error: `Erreur d'envoi des e-mails : ${error.message}` });
  }
};

exports.validerEmailFormulaire = async (req, res) => {
  console.log('validerEmailFormulaire called')
  const token = req.params.token ;
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

  return res.status(200).json({ token });
};
exports.enregistrerPersonne = async (req, res) => {
  const authorizationHeader = req.headers.authorization;

if (!authorizationHeader) {
  return res.status(401).json({ message: 'Token non saisi' });
}

const token = authorizationHeader.split(" ")[1];

if (!token) {
  return res.status(401).json({ message: 'Token non saisi' });
}
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: 'Token non valide' });
    }

    try {
      const { nom, prenom, email } = decoded;
      console.log(nom + ' ' + prenom + ' ' + email);

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

      const personne = new Personne(req.body);

      await personne.validate();

      await personne.save();

      res.status(201).json({
        model: Personne,
        message: 'Candidature enregistrée avec succès',
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = {};

        for (const field in error.errors) {
          if (error.errors.hasOwnProperty(field)) {
            validationErrors[field] = error.errors[field].message;
          }
        }

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
