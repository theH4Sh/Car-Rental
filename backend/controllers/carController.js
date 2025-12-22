const Car = require('../models/Car')
const fs = require('fs')
const path = require('path')

exports.createCar = async (req, res, next) => {
    try {
        const { name, brand, pricePerDay, description } = req.body

        if (!req.file) {
            return res.status(400).json({ error: 'Car image is required' })
        }

        if (!name || !brand || !pricePerDay || !description) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const newCar = new Car({
            name,
            brand,
            pricePerDay,
            description,
            image: req.file.filename
        })
        await newCar.save()
        res.status(201).json(newCar)
    } catch (error) {
        next(error)
    }
}

exports.getAllCars = async (req, res, next) => {
    try {
        const cars = await Car.find().sort({ _id: -1 })
        res.json(cars)
    } catch (error) {
        next(error)
    }
}

exports.getCarById = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id)
            .populate({
                path: 'reviews',
                options: { limit: 5 },
                populate: { path: 'user', select: 'username' }
            })

        if (!car) {
            const error = new Error('Car not found')
            error.status = 404
            return next(error)
        }

        res.json(car)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.updateCar = async (req, res, next) => {
    try {
        const { name, brand, pricePerDay, description } = req.body
        const car = await Car.findById(req.params.id)

        if (!car) {
            return res.status(404).json({ error: 'Car not found' })
        }

        if (name) car.name = name
        if (brand) car.brand = brand
        if (pricePerDay) car.pricePerDay = pricePerDay
        if (description) car.description = description

        if (req.file) {
            const oldImage = path.join('images', car.image)
            if (fs.existsSync(oldImage)) {
                fs.unlinkSync(oldImage)
            }
            car.image = req.file.filename
        }

        await car.save()
        res.json(car)
    } catch (error) {
        next(error)
    }
}

exports.deleteCar = async (req, res, next) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id)

        if (!deletedCar) {
            return res.status(404).json({ error: 'Car not found' })
        }

        const imagePath = path.join('images', deletedCar.image)
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }

        res.json({ message: 'Car deleted successfully', deletedCar })
    } catch (error) {
        next(error)
    }
}
