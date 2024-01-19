const { Repetition, repetitionValidationSchema } = require('../models/repetition');

exports.createRepetition = async (req, res) => {
    const { error } = repetitionValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
      
        const urlQR = generateRandomURL();

        
        const { heureDebut, heureFin, date, lieu, programme, concert } = req.body;

        
        const nouvelleRepetition = new Repetition({
            heureDebut,
            heureFin,
            date,
            lieu,
            programme,
            concert,
            urlQR,
        });

        
        const repetitionEnregistree = await nouvelleRepetition.save();

        res.status(201).json({
            repetition: repetitionEnregistree,
            message: "Répétition créée avec succès !",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


function generateRandomURL() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomURL = 'https:';

    for (let i = 0; i < 10; i++) {
        randomURL += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    randomURL += '.com'; 
   

    return randomURL;
}
