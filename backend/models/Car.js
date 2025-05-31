const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
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

module.exports = mongoose.model('Car', carSchema);