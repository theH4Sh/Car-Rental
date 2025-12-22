const express = require('express')
const { createBooking, getUserBooking, cancelBooking } = require('../controllers/bookingController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.post('/', requireAuth, createBooking)
router.get('/', requireAuth, getUserBooking)
router.delete('/:id', requireAuth, cancelBooking)

module.exports = router
