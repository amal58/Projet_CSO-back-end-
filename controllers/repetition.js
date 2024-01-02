const Choriste=require("../models/choriste")
const Audition=require("../models/audition")
const audition=require("../models/candidatAudition")
const Repetition=require("../models/repetition")
const Personne=require("../models/personne")
//creation repetition
exports.createRepetition = async (req, res) => {
  try {
    let soprano=[]
    let alto=[]
    let basse=[]
    let tenor=[]
//body
    let sop=req.body.sop
    let al=req.body.al
    let bas=req.body.bas
    let ten=req.body.ten
console.log(ten);
    const exist_choriste = await Choriste.find({role:"choriste"}).populate("candidatId")
    for (let i=0;i<exist_choriste.length;i++){
      const exist_audition= await Audition.findOne({candidat:exist_choriste[i].candidatId._id})
      const exist_audCand= await audition.findOne({audition:exist_audition._id})
      if(exist_audCand.tessiture==="base"){
        basse.push({
          candidat:exist_choriste[i]._id,
          tessiture:exist_choriste[i].tessiture,
        })
      } 
      if(exist_audCand.tessiture==="ténor"){
        tenor.push({
          candidat:exist_choriste[i]._id,
          tessiture:exist_choriste[i].tessiture,
        })
      }
      
      if(exist_audCand.tessiture==="seprano"){
        soprano.push({
          candidat:exist_choriste[i]._id,
          tessiture:exist_choriste[i].tessiture,
        })
      }
      if(exist_audCand.tessiture==="alto"){
        alto.push({
          candidat:exist_choriste[i]._id,
          tessiture:exist_choriste[i].tessiture,
        })
      }}
const rep= new Repetition({
  heureDebut:req.body.heureDebut,
  heureFin:req.body.heureFin,
  date :req.body.date,
  lieu:req.body.lieu,
  urlQR:req.body.urlQR,
  concert:req.params.id,
  choriste:[]
})
if (ten==undefined &&  al==undefined && bas==undefined && sop==undefined ){
  for(let i=0;i<exist_choriste.length;i++){
   rep.choriste.push(exist_choriste[i]._id)
  }
}else {
  if(al != undefined){
 const tabalto= alto.sort(() => Math.random()).slice(0, al);
 for(let i=0;i<tabalto.length;i++){
  rep.choriste.push(tabalto[i].candidat)
    }}
    if(sop != undefined){
 const tabsop= soprano.sort(() => Math.random()).slice(0, sop);
 for(let i=0;i<tabsop.length;i++){
  rep.choriste.push(tabsop[i].candidat)
    }}
    if(ten != undefined){
 const tabtenor= tenor.sort(() => Math.random()).slice(0, ten);
 for(let i=0;i<tabtenor.length;i++){
  rep.choriste.push(tabtenor[i].candidat)
    }}
    if(bas != undefined){
 const tabase= basse.sort(() => Math.random()).slice(0, bas);
 for(let i=0;i<tabase.length;i++){
  rep.choriste.push(tabase[i].candidat)
    }}
}
    let response = await rep.save()
    res.status(400).json({message:"success repetition", response})
  } catch (error) {
    console.log(error)
  }
}

