const express = require('express')
const {
    loginUser,
    signUpUser,
    getUser,
    getMe,
    updateProfile,
    changePassword,
} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.post('/login', loginUser)
router.post('/signup', signUpUser)
router.get('/users/me', requireAuth, getMe)
router.patch('/users/me', requireAuth, updateProfile)
router.patch('/users/me/password', requireAuth, changePassword)
router.get('/users/:username', getUser)

module.exports = router
