const jwt = require("jsonwebtoken");

const loggedMiddleware = function (req,res,next){
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).send('you dont have access to this route');
    try {
    jwt.verify(authHeader, "RANDOM_TOKEN_SECRET",(err,user)=>{
if(err) return res.status(403).json(err)
     req.user = user;
     req.choristeId = user.existUser || user.existChoriste;

        next();
        });
    } catch (error) {
      console.log(error);
      return res.status(401).send('Invalid Token') ;
    }}


const isAdmin= (req,res,next)=>{
  const role=req.user.role
  if(role=="admin"){
     next()
  }else {
    res.status(401).json("vous n'avez pas l'acces a cette page ")
  }
try{
}catch(e){
  res.status(500).json({message:"failed"})
}
}

const isMnager= (req,res,next)=>{
  const role=req.user.role
  if(role=="Manager"){
     next()
  }else {
    res.status(401).json("vous n'avez pas l'acces a cette page ")
  }
try{
}catch(e){
  res.status(500).json({message:"failed"})
}
}

const isChoriste= (req,res,next)=>{
  const role=req.user.role
  if(role=="choriste"){
     next()
  }else {
    res.status(401).json("vous n'avez pas l'acces a cette page ")
  }
try{
}catch(e){
  res.status(500).json({message:"failed"})
}
}

const ischefpupitre= (req,res,next)=>{
  const role=req.user.role
  if(role=="chefpupitre"){
     next()
  }else {
    res.status(401).json("vous n'avez pas l'acces a cette page ")
  }
try{
}catch(e){
  res.status(500).json({message:"failed"})
}
}
const ischefchoeur= (req,res,next)=>{
  const role=req.user.role
  if(role=="chefchoeur"){
     next()
  }else {
    res.status(401).json("vous n'avez pas l'acces a cette page ")
  }
try{
}catch(e){
  res.status(500).json({message:"failed"})
}
}


module.exports={
   loggedMiddleware,
   ischefpupitre,
   ischefchoeur,
   isChoriste,
   isAdmin,
   isMnager
}