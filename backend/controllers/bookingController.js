const Booking = require('../models/Booking')

const createBooking = async (req, res, next) => {
    const { carId, startDate, endDate } = req.body
    const userId = req.user._id

    try {
        const conflictBooking = await Booking.findOne({
        car: carId,
            status: 'confirmed',
            $not: {
                $or: [
                { endDate: { $lte: new Date(startDate) } }, // No overlap if existing ends before new starts
                { startDate: { $gte: new Date(endDate) } }  // No overlap if existing starts after new ends
                ]
            }
        })

        if (conflictBooking) {
            return res.status(409).json({ 
                error: 'Car already booked between dates',
                conflictBooking
            })
        }

        const booking = new Booking({
            user: userId,
            car: car,
            startDate: startDate, 
            endDate: endDate
        })

        await booking.save()
        res.status(201).json({ booking })
    } catch (error) {
        next(error)
    }
}

const getUserBooking = async (req, res, next) => {}

const cancelBooking = async (req, res, next) => {}

module.exports = { createBooking, getUserBooking, cancelBooking }