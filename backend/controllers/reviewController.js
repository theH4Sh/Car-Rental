const mongoose = require('mongoose')
const Review = require('../models/Review')

const createReview = async (req, res, next) => {
    const { comment } = req.body
    const rating = Number(req.body.rating)
    const { carId } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({ error: 'Invalid car ID' })
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' })
    }

    if (!comment || !comment.trim()) {
        return res.status(400).json({ error: 'Comment is required' })
    }

    try {
        const existing = await Review.findOne({ user: userId, car: carId })
        if (existing) {
            return res.status(409).json({ error: 'You have already reviewed this car' })
        }

        const review = new Review({
            user: userId,
            car: carId,
            comment: comment.trim(),
            rating,
        })

        await review.save()
        await review.populate('user', 'username')
        res.status(201).json(review)
    } catch (error) {
        next(error)
    }
}

const updateReview = async (req, res, next) => {
    try {
        const updates = {}
        if (req.body.rating !== undefined) {
            const rating = Number(req.body.rating)
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' })
            }
            updates.rating = rating
        }
        if (req.body.comment !== undefined) {
            updates.comment = req.body.comment
        }

        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: updates },
            { new: true }
        ).populate('user', 'username')

        if (!review) {
            return res.status(404).json({ error: 'Review not found' })
        }

        res.json(review)
    } catch (error) {
        next(error)
    }
}

const getReviews = async (req, res, next) => {
    const { carId } = req.params

    if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({ error: 'Invalid car ID' })
    }

    try {
        const reviews = await Review.find({ car: carId })
            .populate('user', 'username')
            .sort({ createdAt: -1 })

        res.status(200).json({ reviews })
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
            user: userId,
        })

        if (!review) {
            return res.status(404).json({ error: 'Review not found' })
        }

        res.status(200).json(review)
    } catch (error) {
        next(error)
    }
}

module.exports = { createReview, updateReview, getReviews, deleteReview }
