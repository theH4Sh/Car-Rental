 const express = require('express')
 const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController')

 const router = express.Router()

 router.post('/', createBooking)
 router.get('/', getUserBookings)
 router.delete('/:id', cancelBooking)

 module.exports = router