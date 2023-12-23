const CandA =require("../models/candidatAudition")
const Audition =require("../models/audition")
const choriste =require("../models/choriste")
const nodemailer =require("nodemailer")
const path = require('path');
const secretKey = 'your-secret-key';
const jwt = require("jsonwebtoken");
var generator = require('generate-password');
const bcrypt=require('bcryptjs')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: "lajiliamal218@gmail.com",
      pass: "iwpe xeyj wutw sbpt"
  },
  tls: {
    rejectUnauthorized: false,
  },
});

var passwords = generator.generate({
	length: 10,
	numbers: true
});

const fetchCandAs =(req,res)=>{
    CandA.find()
    .populate("audition")    
      .then((candAs) =>
        res.status(200).json({
          model: candAs,
          message: "success",
        })
      )
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "probleme d'extraction",
        });
      });
    }


  
  //   const getCandAById= async(req,res)=>{
  //   await CandA.findById({_id:req.params.id})
  //   .populate("audition")    
  //   .then((candAs) => {
  //     if(!candAs){
  //       res.status(404).json({
  //         message:"task non trouve"
  //       })
  //       return
  //     }
  
  //    res.status(200).json({
  //     model: candAs,
  //     message:"objet trouve"
  //    })
  //  })
  //  .catch((error) => {
   
  //    res.status(400).json({
  //      error:error.message,
  //      message:"probleme ",
  //    });
  //  });
  // }
  
 
 
  const addCandA= (req, res) => {
    const candA = new CandA(req.body);
    candA
      .save()
      .then(() =>
        res.status(201).json({
          model: candA,
          message: "Created!",
        })
      )
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "Données invalides",
        });
      });
  }



// //modifier
// const UpdateCandA=async(req, res) => {
//     await CandA.findByIdAndUpdate({ _id: req.params.id }, {...req.body}, { new: true })
//       .then((candA) => {
//         if (!candA) {
//           res.status(404).json({
//             message: "candidat audition not found ",
//           });
//           return;
//         }
//         res.status(200).json({
//           model: candA,
//           message: "candidat audition updated",
//         });
//       })
//       .catch((error) =>
//         res.status(400).json({
//           error: error.message,
//           message: "candidat audition not correct",
//         })
//       );
//   }


// const DeleteCandA=async(req, res) => {
//    await CandA.findByIdAndDelete({ _id: req.params.id })
//       .then(() => 
//       res.status(200).json({ message: "candidat audition deleted" }))
      
//       .catch((error) => {
//         res.status(400).json({
//           error: error.message,
//           message: "Id candidat audition not correct ",
//         });
//       });
//   }





 //méthode ajouter tache2
 const confirmation = async (req, res) =>{
  try{
  const token = req.params.token
  const verify = jwt.verify(token, secretKey)
  console.log(verify.audition)
  const exitaudition = await CandA.findOne({audition:verify.audition}).populate({ 
    path: 'audition',
    populate: {
      path: 'candidat',
    } 
 })
  console.log(exitaudition._id)

  if(exitaudition){
    const updatet = {ConfirmedEmail:"confirmer" }
    const updateaudition= await CandA.findOneAndUpdate({audition:verify.audition}, {ConfirmedEmail:"confirmer"},{new:true})
    const existUser= exitaudition.audition.candidat._id

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(passwords, salt);
    const User= new choriste ({
      role:"choriste",
      candidatId:existUser,
      historiqueStatut:[
      {saison:new Date(),statut:"junior"}
      ],
      password:hashed,
    })
    transporter.sendMail({
      from: "amal ",
      to: exitaudition.audition.candidat.email,
      subject: "[ Second STEP DONE -  ]",
      html: `<br><br>Cher <strong>${exitaudition.audition.candidat.nom} ${exitaudition.audition.candidat.prenom}</strong>,<br><br>
      Après avoir étudié votre candidature, nous avons le plaisir de vous informer que vous avez réussi la première étape du processus de recrutement.<br><br>
      Votre email est: ${exitaudition.audition.candidat.email} et votre Password est: ${passwords}`,
    }, (err, info) => {
      if (err) {
          console.log(err);
          return res.status(400).json({
              message: {
                  error: err
              }
          });
      }
      console.log(info);
  });
  const response=await User.save()
  return res.status(200).json({res:response,message:"choriste crée avec succes"})
  }
console.log(response)
  }
  catch(e){
    console.log(e);
   return res.status(400).json(e)

  }
}


 const getCandidaR= async(req,res)=>{
    try {
   const spo=req.body.sop
   const alt=req.body.alt
   const ten=req.body.ten
   const bas=req.body.bas
    let tab=[]
        const Soprano=await CandA.find({
          tessiture:"seprano",
          decision:"retenu"
        })
        .populate({ 
          path: 'audition',
          populate: {
            path: 'candidat',
          } 
       })
        const Alto=await CandA.find({
          tessiture:"alto",
          decision:"retenu"
              })
              .populate({ 
                path: 'audition',
                populate: {
                  path: 'candidat',
                } 
             })
           
              const Tenor=await CandA.find({
                tessiture:"ténor",
                decision:"retenu"
              })
             
                    .populate({ 
                      path: 'audition',
                      populate: {
                        path: 'candidat',
                      } 
                   })
                   
                    const Basse=await CandA.find({
                      tessiture:"base",
                      decision:"retenu"
                          })
                          .populate({ 
                            path: 'audition',
                            populate: {
                              path: 'candidat',
                            } 
                         })
                         
    for(let i=0;i<spo;i++){
      tab.push(Soprano[i])
    }
    for(let i=0;i<alt;i++){
      tab.push(Alto[i])
    }
    for(let i=0;i<ten;i++){
      tab.push(Tenor[i])
    }
    for(let i=0;i<bas;i++){
      tab.push(Basse[i])
    }
    
    tab.map(elem=>{
      const confirmationToken = jwt.sign({ audition: elem.audition }, secretKey, { expiresIn: '1d' });
    console.log(confirmationToken);
    
      transporter.sendMail({
        from: "amal ",
        to: elem.audition.candidat.email,
        subject: "[ FIRST STEP DONE - Acceptation Candidature Carthage Symphony Orchestra ]",
        attachments: [
          {
            filename: 'ocs.jpg',
            path: path.join(__dirname, '../documents/ocs.png'),
            encoding: 'base64', 
            contentType: 'image/jpg',
            cid: 'unique@ocs.com',
          },
          {
            filename: 'Chart.pdf',
            path: path.join(__dirname, '../documents/Charte.pdf'),
            encoding: 'base64', 
            contentType: 'application/pdf',
          },
          
        ],
        html: ` <img src="cid:unique@ocs.com" width="400"> <br><br>Cher <strong>${elem.audition.candidat.nom} ${elem.audition.candidat.prenom}</strong>,<br><br>
        Après avoir étudié votre candidature, nous avons le plaisir de vous informer que vous avez réussi la première étape du processus de recrutement.<br><br>
        Afin de procéder à la prochaine étape du processus, veuillez prendre un moment pour lire attentivement la charte de l'entreprise, jointe à ce courriel. Une fois que vous l'avez examinée en détail, nous vous prions de bien vouloir signer le document en bas de la page pour indiquer votre accord.<br><br>
        De plus, confirmez votre intégration en cliquant sur le lien d'acceptation indiquant votre accord.<br><br>
        Félicitations encore pour cette réussite, et nous attendons avec impatience de collaborer avec vous.<br><br>
        <a href="http://localhost:3000/${confirmationToken}">Cliquez ici pour confirmer votre e-mail</a>
        Cordialement,`,
      }, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                message: {
                    error: err
                }
            });
        }
        console.log(info);
    });
    })


  res.status(200).json(tab)
    } catch (error) {
      console.log(error);
    }
  }

 module.exports={
    fetchCandAs:fetchCandAs,
    addCandA:addCandA,
    getCandidaR:getCandidaR,
    confirmation:confirmation
   
 }



 


   





 
  
  















































  

 

        