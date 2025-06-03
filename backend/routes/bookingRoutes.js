 const express = require('express')
 const { createBooking, getUserBooking, cancelBooking } = require('../controllers/bookingController')
const requireAuth = require('../middleware/requireAuth')

 const router = express.Router()

 router.post('/', requireAuth, createBooking)
 router.get('/', getUserBooking)
 router.delete('/:id', cancelBooking)

 module.exports = router