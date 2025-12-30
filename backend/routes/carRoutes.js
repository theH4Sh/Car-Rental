const express = require('express');
const { createCar, getAllCars, getCarById, updateCar, deleteCar } = require('../controllers/carController')
const upload = require('../middleware/upload')
const requireAuth = require('../middleware/requireAuth')
const requireAdmin = require('../middleware/requireAdmin')

const router = express.Router();

router.get('/car', getAllCars);
router.get('/car/:id', getCarById);
router.post('/car', requireAuth, requireAdmin, upload.array('carImages', 10), createCar);
router.put('/car/:id', requireAuth, requireAdmin, upload.array('carImages', 10), updateCar);
router.delete('/car/:id', requireAuth, requireAdmin, deleteCar);

module.exports = router
