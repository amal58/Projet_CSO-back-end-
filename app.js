const express = require ("express")
const app= express()
const mongoose = require('mongoose')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const concertRoutes=require("./routes/concert");
const dispRoutes=require("./routes/absencepresence");
const candARoutes=require('./routes/candidatAudition')
const auditionRoutes = require('./routes/audition');
const personneRoutes = require('./routes/personne');
const choristeRoutes = require('./routes/choriste');
const Choriste = require('./models/choriste');
const repetitionRoutes = require('./routes/repetition');
const abprRoutes = require('./routes/absencepresence');
const bcrypt=require('bcryptjs')
var path = require('path');
app.set("view engine", "ejs");
app.get('/NotifConge', function(req, res) {
  res.sendFile(path.join(__dirname + '/getnotifConge.html'));
 });

app.get('/GetPlacement', function(req, res) {
  res.sendFile(path.join(__dirname + '/placement.html'));
 });
const connection=async()=>{
try{
await mongoose
      .connect("mongodb://127.0.0.1:27017/data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

console.log("DataBase connected")
const admin=await Choriste.findOne({role:"admin"})
const manager=await Choriste.findOne({role:"Manager"})
if(!admin){
  const password="adminamal"
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const compteAdmin=new Choriste({
    login:"admin@gmail.com",
    password:hashed,
    role:"admin"
  })
  await compteAdmin.save()
console.log(`admin  account has been added : ${compteAdmin.login}`);
}
if(!manager){
  const password="manageramal"
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const compteManager=new Choriste({
    login:"manager@gmail.com",
    password:hashed,
    role:"Manager"
  })
  await compteManager.save()
console.log(`manager  account has been added : ${compteManager.login}`);
}else{
  console.log(` admin and manager accounts already exist \n admin email : ${admin.login} \n manager email: ${manager.login}`);
}
}catch(e){
  console.log(e)
}}
connection()

const options = {
  definition: {
    openapi:"3.0.0",
    info:{
      title:"todo api with swagger",
      version:"0.1.0",
      description:"this is simple crud api application",
      contact:{
        name:"amal",
        url:"https://www.linkedin.com/in/amal-lajili-8b637a1bb/",
        email:"lajiliamal218@gmail.com",
      },
    },
    servers:[
      {
        url:"http://localhost:5000/api",
        description:"development server",
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
        radiotherapie: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Format du jeton d'authentification : Bearer <token>"
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],

  },
  apis:["./routes/*.js"]
    
};
const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

  app.use(express.json())
  app.use("/api/concert",concertRoutes)
  app.use("/api/disp",dispRoutes)
  app.use('/api/auditions', auditionRoutes); 
  app.use("/api/cand",candARoutes)
  app.use('/api/candidats', personneRoutes);
  app.use('/api/choriste', choristeRoutes);
  app.use('/api/repetitions', repetitionRoutes);
  app.use('/api/absencepresence', abprRoutes);

module.exports=app