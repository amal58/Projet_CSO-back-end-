const express = require("express");
const bodyParser = require('body-parser');  
const swaggerJSDoc = require('swagger-jsdoc');  // Add this line
const swaggerUi = require('swagger-ui-express');
const app = express();
const path = require('path');
const saisonRoutes = require('./routes/saison');
const Choriste = require('./models/choriste');
const OeuvreRoutes=require("./routes/oeuvre")
const concertRoutes=require("./routes/concert")

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const et1swagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Projet CSO API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000/', 
      },
    ],
    components: {
      securitySchemes: {
        customAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
    security: [
      {
        customAuth: [],
      },
    ],
    tags: [
      {
        name: 'Saison',
        description: 'Opérations liées aux saisons',
      },
      {
        name: 'Oeuvre',
        description: 'Opérations liées aux oeuvres',
      },
      {
        name: 'Audition',
        description: 'Opérations liées aux audition',
      },
      {
        name: 'Participants_Concert',
        description: 'Liste participants pour un concert',
      },
      {
        name: 'Envoyer_notification_urgent',
        description: 'Envoyer notification au choristes au cas changement repetition ou concert',
      },
      {
        name: 'Liste_présents_par_programme_et_par_pupitre',
        description: 'lister les choristes présents selon le programme et le nom de pupitre',
      },
    ],
  },
  apis: ['./routes/oeuvre.js', './routes/saison.js','./routes/concert.js' ,'./routes/audition.js' , './routes/validerMailPersonne.js','./routes/participantsRoutes.js','./routes/repetition.js','./routes/Listepresence.js'],
};


const swaggerSpec = swaggerJSDoc(et1swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const mongoose = require('mongoose');
const ValidMailPRoutes = require('./routes/validerMailPersonne');
const auditionRoutes = require('./routes/audition');
const routePresenceListe = require('./routes/Listepresence')
const choristeRoutes=require("./routes/choriste");
const repetitionRoutes = require('./routes/repetition');

const participantsRoutes = require('./routes/participantsRoutes');

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
app.use('/api/auditions', auditionRoutes); 
app.use('/validerMail', ValidMailPRoutes);
app.use('/api', participantsRoutes);
app.use('/api/choriste', choristeRoutes);
app.use("/listePresents",routePresenceListe)
app.use('/api/saison', saisonRoutes); 
app.use('/api/repetitions', repetitionRoutes);
app.use('/api/concert', concertRoutes);




module.exports = app;
