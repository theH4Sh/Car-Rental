const Booking = require('../models/Booking')

const createBooking = async (req, res, next) => {
    const { carId, startDate, endDate } = req.body;
    const userId = req.user._id;

    try {
        // 💣 Validate input presence
        if (!carId || !startDate || !endDate) {
            return res.status(400).json({ error: "Missing required fields: carId, startDate, or endDate" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        // 📅 Validate date order
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        if (start >= end) {
            return res.status(400).json({ error: "End date must be after start date" });
        }

        // ⏱️ Optional: Prevent past bookings
        if (start < now) {
            return res.status(400).json({ error: "Start date cannot be in the past" });
        }

        // 🔍 Check for conflicts
        const conflictBooking = await Booking.findOne({
            car: carId,
            status: 'confirmed',
            $and: [
                { startDate: { $lt: end } },
                { endDate: { $gt: start } }
            ]
        });

        if (conflictBooking) {
            return res.status(409).json({
                error: 'Car already booked between selected dates',
                conflictBooking
            });
        }

        // ✅ Create booking
        const booking = new Booking({
            user: userId,
            car: carId,
            startDate: start,
            endDate: end,
            status: 'confirmed'
        });

        await booking.save();
        res.status(201).json({ booking });

    } catch (error) {
        next(error);
    }
}

const getUserBooking = async (req, res, next) => {}

const cancelBooking = async (req, res, next) => {}

module.exports = { createBooking, getUserBooking, cancelBooking }