const express = require('express')
const  { getReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

router.post('/:carId', requireAuth, createReview)
router.get('/:carId', getReviews)
router.put('/:id', requireAuth, updateReview)
router.delete('/:id', requireAuth, deleteReview)

module.exports = router