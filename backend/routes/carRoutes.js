const express = require('express');
const { createCar, getAllCars, getCarById, deleteCar } = require('../controllers/carController')
const upload = require('../middleware/upload')

const router = express.Router();

router.post('/car', upload.single('carImage'), createCar);
router.get('/car', getAllCars);
router.get('/car/:id', getCarById);
router.delete('/car/:id', deleteCar);

module.exports = router