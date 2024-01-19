const express = require("express");
const bodyParser = require('body-parser');  
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const OeuvreRoutes = require("./routes/oeuvre");
const mongoose = require('mongoose');
const concertRoutes = require("./routes/concert");
const repetitionRoutes = require('./routes/repetition');
const ValidMailPRoutes = require('./routes/validerMailPersonne');
const auditionRoutes = require('./routes/audition');
const saisonRoutes = require('./routes/saison');
const choristeRoutes = require('./routes/choriste');
const participantsRoutes = require('./routes/participantsRoutes');
const Choriste = require('./models/choriste');

const connection = async () => {
  try {
    await mongoose.connect('mongodb+srv://p92934700:7RoxD6S97xxp1Dea@cluster0.peomj36.mongodb.net/projetCSO', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected");

    const admin = await Choriste.findOne({ role: "admin" });
    const manager = await Choriste.findOne({ role: "Manager" });

    if (!admin) {
      const password = "adminamal";
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const compteAdmin = new Choriste({
        login: "admin@gmail.com",
        password: hashed,
        role: "admin"
      });

      await compteAdmin.save();
      console.log(`Admin account has been added: ${compteAdmin.login}`);
    }

    if (!manager) {
      const password = "manageramal";
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const compteManager = new Choriste({
        login: "manager@gmail.com",
        password: hashed,
        role: "Manager"
      });

      await compteManager.save();
      console.log(`Manager account has been added: ${compteManager.login}`);
    } else {
      console.log(`Admin and Manager accounts already exist\nAdmin email: ${admin.login}\nManager email: ${manager.login}`);
    }

  } catch (e) {
    console.log(e);
  }
};

connection();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/Oeuvre", OeuvreRoutes);
app.use("/api/concert", concertRoutes);
app.use('/api/repetitions', repetitionRoutes);
app.use('/validerMail', ValidMailPRoutes);
app.use('/api/auditions', auditionRoutes); 
app.use('/api/choriste', choristeRoutes);
app.use('/api/saison', saisonRoutes); 
app.use('/api', participantsRoutes);

module.exports = app;