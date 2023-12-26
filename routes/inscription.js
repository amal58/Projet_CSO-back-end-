//inscription routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Récupérez l'e-mail depuis l'URL
  const email = req.query.email;

  // Affichez le formulaire d'inscription avec l'e-mail pré-rempli
  res.render('inscription', { email });
});

module.exports = router;