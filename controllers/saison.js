const mongoose = require('mongoose');
const Saison = require("../models/saison")
const Oeuvre = require('../models/oeuvre');
const { AbsencePresence, absenceValidationSchema } = require('../models/absencepresence');
const { CandAud } = require('../models/candidatAudition');
const  Choriste  = require('../models/choriste');
const { Repetition, repetitionValidationSchema } = require('../models/repetition');
const  PersonneInitiale  = require('../models/personneInitiale');
const  Conge  = require('../models/conge');
const Personne = require('../models/personne');
const { Concert, concertSchemaValidation } = require('../models/concert');

exports.AjoutSaison = async (req, res) => {
    try {
      const { SaisonName } = req.body;
        if (!SaisonName) {
        return res.status(400).json({
          error: "SaisonName est requis",
        });
      }
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const dateFin = new Date(currentYear, 11, 31); 
      const saison = new Saison({
        SaisonName,
        dateDebut: currentDate, 
        dateFin,
      });
  
      await saison.save();
  
      res.status(201).json({
        model: saison,
        message: "Saison créée !",
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
          error: "Erreur de validation",
          validationErrors,
        });
      } else {
        console.error("Erreur lors de la création de saison :", error.message);
        res.status(500).json({
          error: "Erreur lors de la création de saison",
        });
      }
    }
  };

exports.MiseAjourSaison = async (req, res) => {
    try {
      const saison = await Saison.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
      if (!saison) {
        console.log("Saison non trouvée");
        return res.status(404).json({
          message: "Saison non trouvée",
        });
      }
  
      console.log("Saison mise à jour avec succès");
      res.status(200).json({
        model: saison,
        message: "Saison mise à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du saison:', error);
      res.status(400).json({
        error: error.message,
        message: "Erreur lors de la mise à jour du saison",
      });
    }
  };

exports.ArchiverSaison = async (req, res) => {
    try {
      const Ids = req.params.id ;
      if (!Ids || !mongoose.Types.ObjectId.isValid(Ids)) {
        console.log("Invalid saisonId");
        return res.status(400).json({
            message: "Invalid saisonId provided",
        });
    }

        const personnes = await Personne.find({}, '_id');
        const personneIds = personnes.map(personne => personne._id);

        const oeuvres = await Oeuvre.find({}, '_id');
        const oeuvreIds = oeuvres.map(oeuvre => oeuvre._id);

        const candAuds = await CandAud.find({}, '_id');
        const candAudIds = candAuds.map(candAud => candAud._id);

        const absences = await AbsencePresence.find({}, '_id');
        const absenceIds = absences.map(absence => absence._id);

        const choristes = await Choriste.find({}, '_id');
        const choristeIds = choristes.map(choriste => choriste._id);

        const repetitions = await Repetition.find({}, '_id');
        const repetitionIds = repetitions.map(repetition => repetition._id);

        const personneis = await PersonneInitiale.find({}, '_id');
        const personneiIds = personneis.map(personnei => personnei._id);
        
        const conges = await Conge.find({}, '_id');
        const congeIds = conges.map(conge => conge._id);

        const concerts = await Concert.find({}, '_id');
        const concertIds = concerts.map(concert => concert._id);
        
        const saisonId = req.params.id;

        const updatedSaison = await Saison.findOneAndUpdate(
            { _id: saisonId },
            { $set: { Personnes: personneIds, Oeuvres: oeuvreIds, CandAuds: candAudIds , Absences: absenceIds ,
              Choristes: choristeIds , Repetitions: repetitionIds , PersonneInitiales : personneiIds ,Conges : congeIds ,
              Concerts : concertIds} },
            { new: true }
        );

        if (!updatedSaison) {
            console.log("Saison not found");
            return res.status(404).json({
                message: "Saison not found",
            });
        }

        res.status(200).json({
            updatedSaison,
            message: "Saison updated successfully",
        });
    } catch (error) {
        console.error('Error updating Saison with personne, oeuvre, and CandAud IDs:', error);
        res.status(500).json({
            error: error.message,
            message: "Error updating Saison with personne, oeuvre, and CandAud IDs",
        });
    }
};