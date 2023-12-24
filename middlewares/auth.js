const jwt = require("jsonwebtoken");
const User = require('../models/User');

module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    
    // Recherchez l'utilisateur par son ID
    User.findOne({ _id: userId }).then((user) => {
      if (user) {
        req.auth = {
          userId: userId,
          role: user.role
        };
        next();
      } else {
        res.status(401).json({ message: "L'utilisateur n'existe pas" });
      }
    }).catch((error) => {
      res.status(500).json({ error: error.message });
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.isAdmin = (req, res, next) => {
  try {
    if (req.auth.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Accès refusé. Vous n'êtes pas un administrateur !!" });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};