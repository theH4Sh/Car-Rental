const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true},
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" }
}, { timestamps: true })

module.exports = mongoose.model("Booking", bookingSchema)