const User = require('../models/userModel')
const Car = require('../models/Car')
const Booking = require('../models/Booking')
const Review = require('../models/Review')

const getStats = async (req, res, next) => {
    try {
        const [users, cars, bookings, reviews, pending, confirmed, canceled] = await Promise.all([
            User.countDocuments(),
            Car.countDocuments(),
            Booking.countDocuments(),
            Review.countDocuments(),
            Booking.countDocuments({ status: 'pending' }),
            Booking.countDocuments({ status: 'confirmed' }),
            Booking.countDocuments({ status: 'canceled' }),
        ])

        const recentBookings = await Booking.find()
            .populate('user', 'username email')
            .populate('car', 'name brand pricePerDay image')
            .sort({ createdAt: -1 })
            .limit(5)

        res.json({
            users,
            cars,
            bookings,
            reviews,
            bookingStatus: { pending, confirmed, canceled },
            recentBookings,
        })
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 })
        res.json(users)
    } catch (error) {
        next(error)
    }
}

const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Role must be user or admin' })
        }

        if (req.params.id === req.user._id.toString() && role !== 'admin') {
            return res.status(400).json({ error: 'You cannot demote yourself' })
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        next(error)
    }
}

const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'username email')
            .populate('car', 'name brand pricePerDay image')
            .sort({ createdAt: -1 })
        res.json(bookings)
    } catch (error) {
        next(error)
    }
}

const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body

        if (!['pending', 'confirmed', 'canceled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const booking = await Booking.findById(req.params.id)

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' })
        }

        if (status === 'confirmed') {
            const conflict = await Booking.findOne({
                _id: { $ne: booking._id },
                car: booking.car,
                status: 'confirmed',
                $and: [
                    { startDate: { $lt: booking.endDate } },
                    { endDate: { $gt: booking.startDate } },
                ],
            })

            if (conflict) {
                return res.status(409).json({ error: 'Car already has a confirmed booking in this date range' })
            }
        }

        booking.status = status
        await booking.save()

        const populated = await Booking.findById(booking._id)
            .populate('user', 'username email')
            .populate('car', 'name brand pricePerDay image')

        res.json(populated)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getStats,
    getAllUsers,
    updateUserRole,
    getAllBookings,
    updateBookingStatus,
}
