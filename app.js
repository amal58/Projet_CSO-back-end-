const express = require ("express")
const app= express()
const mongoose = require('mongoose')
const candARoutes=require('./routes/candidatAudition')
const auditionRoutes = require('./routes/audition');
const personneRoutes = require('./routes/personne');
const choristeRoutes = require('./routes/choriste');
const Choriste = require('./models/choriste');
const repetitionRoutes = require('./routes/repetition');
const abprRoutes = require('./routes/absencepresence');
const bcrypt=require('bcryptjs')
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
  app.use(express.json())

 
  app.use('/api/auditions', auditionRoutes); 
  app.use("/api/cand",candARoutes)
  app.use('/api/candidats', personneRoutes);
  app.use('/api/choriste', choristeRoutes);
  app.use('/api/repetitions', repetitionRoutes);
  app.use('/api/absencepresence', abprRoutes);

module.exports=app