const express = require('express')
const  { getReviews, createReview } = require('../controllers/reviewController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

router.post('/:carId', requireAuth, createReview)
router.get('/:carId', getReviews)

module.exports = router