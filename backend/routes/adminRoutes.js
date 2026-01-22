const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const requireAdmin = require('../middleware/requireAdmin')
const {
    getStats,
    getAllUsers,
    updateUserRole,
    getAllBookings,
    updateBookingStatus,
} = require('../controllers/adminController')
const {
    getMessages,
    updateMessageStatus,
    deleteMessage,
} = require('../controllers/contactController')

const router = express.Router()

router.use(requireAuth, requireAdmin)

router.get('/stats', getStats)
router.get('/users', getAllUsers)
router.patch('/users/:id/role', updateUserRole)
router.get('/bookings', getAllBookings)
router.patch('/bookings/:id', updateBookingStatus)
router.get('/messages', getMessages)
router.patch('/messages/:id', updateMessageStatus)
router.delete('/messages/:id', deleteMessage)

module.exports = router
