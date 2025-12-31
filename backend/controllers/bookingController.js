const Booking = require('../models/Booking')

const createBooking = async (req, res, next) => {
    const { carId, startDate, endDate } = req.body
    const userId = req.user._id

    try {
        if (!carId || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required fields: carId, startDate, or endDate' })
        }

        const start = new Date(startDate)
        const end = new Date(endDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ error: 'Invalid date format' })
        }

        if (start > end) {
            return res.status(400).json({ error: 'End date must be after start date' })
        }

        if (start < today) {
            return res.status(400).json({ error: 'Start date cannot be in the past' })
        }

        // Inclusive ranges so same-day bookings (start === end) still conflict correctly
        const conflictBooking = await Booking.findOne({
            car: carId,
            status: 'confirmed',
            startDate: { $lte: end },
            endDate: { $gte: start },
        })

        if (conflictBooking) {
            return res.status(409).json({
                error: 'Car already booked between selected dates',
                conflictBooking
            })
        }

        const booking = new Booking({
            user: userId,
            car: carId,
            startDate: start,
            endDate: end,
            status: 'confirmed',
        })

        await booking.save()
        res.status(201).json({ booking })
    } catch (error) {
        next(error)
    }
}

const getUserBooking = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('car', 'name brand pricePerDay image images location')
            .sort({ createdAt: -1 })
        res.json(bookings)
    } catch (error) {
        next(error)
    }
}

const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' })
        }

        const isOwner = booking.user.toString() === req.user._id.toString()
        const isAdmin = req.user.role === 'admin'

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to cancel this booking' })
        }

        booking.status = 'canceled'
        await booking.save()
        res.json({ message: 'Booking canceled', booking })
    } catch (error) {
        next(error)
    }
}

module.exports = { createBooking, getUserBooking, cancelBooking }
