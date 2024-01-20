const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { initializeSocket } = require("./socket");




const app = express();
const server = http.createServer(app);
const io = initializeSocket(server); 
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")
const options ={
  definition:{
    openapi: "3.0.0",
      info:{
        title:"Todos Express API with Swagger",
        version:"0.1.0",
        description:"this is a simple CRUD API application",
        contact: {
          name: "LogRocket",
          url: "http://www.linkedin.com/in/simasaad",
          email: "simaasaad897@gmail.com",
        },
      },
      
      servers: [
        {
          url: "http://localhost:5000/api",
          description:"developement server",
        },
      ],
      components: {
        responses: {
          200: {
            description: "Success",
          },
          400: {
            description: "Bad request. You may need to verify your information.",
          },
          401: {
            description: "Unauthorized request, you need additional privileges",
          },
          403: {
            description:
              "Forbidden request, you must login first. See /auth/login",
          },
          404: {
            description: "Object not found",
          },
          422: {
            description:
              "Unprocessable entry error, the request is valid but the server refused to process it",
          },
          500: {
            description: "Unexpected error, maybe try again later",
          },
        },
  
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },

    apis: ["./routes/*.js"],
  }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // insererExemples();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

const auditionRoutes = require("./routes/audition");
const personneRoutes = require("./routes/candidat");
const auditionC = require("./models/candidataudition.js");

const choriste = require("./models/choriste.js");
const { Absence } = require("./models/absence.js");


const choristeRoutes = require("./routes/choriste.js");
const concertRoutes = require('./routes/concert.js');
const repetitionRoutes = require('./routes/repetition.js');
const absenceRoutes = require('./routes/absence.js');
const oeuvreRoutes = require('./routes/oeuvre.js');
const historiqueRoutes=require("./routes/consulterHistorique");

const specs=swaggerJSDoc(options)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs,{explorer:true})
);

app.use("/api/absences", absenceRoutes);
app.use("/api/auditions", auditionRoutes);
app.use("/api/candidats", personneRoutes);
app.use("/api/oeuvres", oeuvreRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/repetitions', repetitionRoutes);
app.use("/api/historique", historiqueRoutes)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/choristes', choristeRoutes);
app.use((req, res, next) => {
  console.log(`Requested: ${req.method} ${req.url}`);
  next();
});

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});





app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (!res.headersSent) {
    console.log(`No route handled the request: ${req.method} ${req.url}`);
    res.status(404).send('Not Found');
  }
});
//   const exemples = [
  
//     {

//       extrait: "Nom de l'extrait musical",
//       tessiture: "alto",
//       evaluation: "A",
//       decision: "retenu",
//       remarque: "Remarques supplémentaires sur le candidat",
//       audition: "658d7d55bc6c4e6cfd1ac73a", // Remplacez par l'ID réel de l'audition associée
//       ConfirmedEmail: "confirmer"
//     },
      

//       etat: false,
//       choriste: "658d844e2b3416e82d172df9",
      
//       repetition: "65a6dc7e55efc6b2053ea664",
//     },
//     {
//       etat: false,
//       choriste: "658d8d185d961dc80e060bb7",
      
//       repetition: "65a6dc7e55efc6b2053ea664",
//     },
//     {
//       etat: true,
//       choriste: "658d8d185d961dc80e060bba",
      
//       repetition: "65a6dc7e55efc6b2053ea664",
//     },
//     {
//       etat: true,
//       choriste: "658da7efe919aa6af756f5a8",
      
//       repetition: "65a6dc7e55efc6b2053ea664",
//     },

// ];
// // Fonction pour insérer les exemples dans la base de données
// async function insererExemples() {
//   try {

//     await auditionC.insertMany(exemples);

//     await  Absence.insertMany(exemples);

//     console.log('Exemples insérés avec succès dans la base de données.');
//   } catch (error) {
//     console.error('Erreur lors de l\'insertion des exemples :', error);
//   }
// }
module.exports = { app, server, io  };
