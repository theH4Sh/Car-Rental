const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
})

module.exports = mongoose.model('Car', carSchema);