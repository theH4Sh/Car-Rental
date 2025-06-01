const mongoose = require('mongoose')
const Review = require('../models/Review') 
const { findOneAndDelete } = require('../models/Car')

const createReview = async (req, res, next) => {
    const { rating, comment } = req.body
    const { carId } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({ error: 'Invalid car ID' })
    }

    if (!Number.isInteger(rating)) {
        return res.status(400).json({ error: "Rating must be an integer between 1 and 5"})
    }

    try {
        const review = new Review({
            user: userId,
            car: carId,
            comment,
            rating
        })

        await review.save()
        res.status(201).json(review)
    } catch (error) {
        next(error)
    }
}

const updateReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndUpdate({
            _id: req.params.id,
            user: req.user._id
        }, 
        { $set: { rating: req.body.rating, comment:req.body.comment }},
        { new: true }
        ).populate('user', 'username')

        res.json(review)
    } catch (error) {
        next(error)
    }
}

const getReviews = async (req, res, next) => {
    const { carId } = req.params

    if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({ error: 'Invalid car ID'})
    }

    try {
        const reviews = await Review.find({ car: carId })
            .populate('user', 'username')
            .sort({ createdAt: -1 })

        if (reviews.length == 0) {
            return res.status(404).json({ error: 'No reviews'})
        }

        res.status(200).json({reviews})
    } catch (error) {
        next(error)
    }
}

const deleteReview = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id

    try {
        const review = await Review.findOneAndDelete({
            _id: id,
            user: userId
        })

        if (!review) {
            return res.status(404).json({ error: "Review not found", userID: userId})
        }

        res.status(200).json(review)
    } catch (error) {
        next(error)
    }
}
module.exports = { createReview, updateReview, getReviews, deleteReview }