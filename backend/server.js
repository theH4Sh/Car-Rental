
const express = require('express')
const mongoose = require('mongoose')
const carRoutes = require('./routes/carRoutes')
const morgan = require('morgan')
require('dotenv').config()

const userRoutes = require('./routes/userRoutes')

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

//API Routes
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