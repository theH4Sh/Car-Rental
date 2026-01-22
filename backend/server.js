
const express = require('express')
const mongoose = require('mongoose')
const carRoutes = require('./routes/carRoutes')
const morgan = require('morgan')
require('dotenv').config()

const userRoutes = require('./routes/userRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const contactRoutes = require('./routes/contactRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()
const cors = require('cors')

app.use('/images', express.static('images'))

//Middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

//API Routes — mount specific paths before any broad /api routers
app.use('/api/reviews', reviewRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', carRoutes)
app.use('/api', userRoutes)

//Error Handling
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    })
})

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${process.env.PORT}`)
})