const express=require("express")

const router =express.Router()

const concertController=require("../controllers/concert")

router.get("/",concertController.fetchConcert)
  
router.get("/:id",concertController.getConcertById)
router.post("/",concertController.addConcert)

router.post("/excel/:filePath",concertController.addProgramExcel)
   
router.patch("/:id",concertController.UpdateConcert)
router.delete("/:id",concertController.DeleteConcert)

module.exports=router