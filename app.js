const express = require ("express")
const app= express()
const mongoose = require('mongoose')
const nodemon = require("nodemon");

const candARoutes=require("./routes/candidatAudition");
const concertRoutes=require("./routes/concert");
// const chefpupitreRoutes=require("./routes/chefpupitre");
// const historiqueRoutes=require("./routes/consulterHistorique");
// const congeRoutes=require("./routes/conges");
// const AbsenceRoutes=require("./routes/resultatAbsence");
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")


mongoose
.connect("mongodb://localhost:27017/database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

  const options ={
    definition:{
      openapi:"3.0.0",
      info: {
        title:"Todos express Api withswagger",
        version :"0.1.0",
        description:"this is  asimple crud api application",
      
        contact:{"name":"sirine",
        "url":"https://www.linkedin.com/in/sirine-maatali-2023811b9/",
        email:"sirine.maatali.5@gmail.com"
      },
    },
    servers:[
      {url:"http://localhost:5000/api",
    description:"developement server"},
    ],
    components: {
      responses: {
        200: {
          description: "Success",
        },
        201: {
          description: "ceation with Success",
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
  apis:["./routes/*.js"],

  }


const specs = swaggerJSdoc(options)
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs,{explorer:true})
)

  app.use(express.json())
  app.use("/api/cand",candARoutes)
  app.use("/api/concert",concertRoutes)
  // app.use("/api/chef",chefpupitreRoutes)
  // app.use("/api/historique", historiqueRoutes)
  // app.use("/api/conge", congeRoutes)
  // app.use("/api/absence",AbsenceRoutes)
  
module.exports=app