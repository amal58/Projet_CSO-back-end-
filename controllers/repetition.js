const Choriste=require("../models/choriste")
const Audition=require("../models/audition")
const audition=require("../models/candidatAudition")
const Repetition=require("../models/repetition")
const Personne=require("../models/personne")

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



exports.deleteRepetition = async (req, res) => {
  try {
    const repetitionId = req.params.id;
    const existingRepetition = await Repetition.findById(repetitionId);
    if (!existingRepetition) {
      return res.status(404).json({ message: "Répétition non trouvée" });
    }
    await Repetition.findByIdAndDelete(repetitionId);

    res.status(200).json({ message: "Répétition supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de la répétition" });
  }
};



exports.updateRepetition = async (req, res) => {
  try {
    const repetitionId = req.params.id;
    const existingRepetition = await Repetition.findById(repetitionId);
    if (!existingRepetition) {
      return res.status(404).json({ message: "Répétition non trouvée" });
    }
    existingRepetition.heureDebut = req.body.heureDebut || existingRepetition.heureDebut;
    existingRepetition.heureFin = req.body.heureFin || existingRepetition.heureFin;
    existingRepetition.date = req.body.date || existingRepetition.date;
    existingRepetition.lieu = req.body.lieu || existingRepetition.lieu;
    existingRepetition.urlQR = req.body.urlQR || existingRepetition.urlQR;
    const updatedRepetition = await existingRepetition.save();

    res.status(200).json({ message: "Répétition mise à jour avec succès", repetition: updatedRepetition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de la répétition" });
  }
};



exports.getAllRepetitions = async (req, res) => {
  try {
    const allRepetitions = await Repetition.find();
    res.status(200).json({ repetitions: allRepetitions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des répétitions" });
  }
};



exports.getRepetitionById = async (req, res) => {
  try {
    const repetitionId = req.params.id;

    const foundRepetition = await Repetition.findById(repetitionId);

    if (!foundRepetition) {
      return res.status(404).json({ message: "Répétition non trouvée" });
    }

    res.status(200).json({ repetition: foundRepetition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération de la répétition par ID" });
  }
};
