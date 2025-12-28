const mongoose = require('mongoose')

const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid']

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    seats: { type: Number, required: true, min: 1, max: 20 },
    location: { type: String, required: true },
    fuelType: {
        type: String,
        required: true,
        enum: FUEL_TYPES,
        lowercase: true,
    },
})

carSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'car',
    options: {
        sort: { createdAt: -1 }
    }
})

carSchema.set('toJSON', { virtuals: true })
carSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Car', carSchema)
module.exports.FUEL_TYPES = FUEL_TYPES
