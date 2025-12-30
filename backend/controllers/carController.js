const Car = require('../models/Car')
const { FUEL_TYPES } = require('../models/Car')
const fs = require('fs')
const path = require('path')

const parseSeats = (value) => {
    const seats = Number(value)
    return Number.isInteger(seats) ? seats : NaN
}

const deleteImageFile = (filename) => {
    if (!filename) return
    const imagePath = path.join('images', filename)
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
    }
}

const normalizeImages = (car) => {
    if (car.images?.length) return car.images
    if (car.image) return [car.image]
    return []
}

const uploadedFilenames = (req) => {
    if (req.files?.length) return req.files.map((f) => f.filename)
    if (req.file) return [req.file.filename]
    return []
}

const parseRemovedImages = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return String(value)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
    }
}

exports.createCar = async (req, res, next) => {
    try {
        const { name, brand, pricePerDay, description, location, fuelType } = req.body
        const seats = parseSeats(req.body.seats)
        const filenames = uploadedFilenames(req)

        if (!filenames.length) {
            return res.status(400).json({ error: 'At least one car image is required' })
        }

        if (!name || !brand || !pricePerDay || !description || !location || !fuelType) {
            filenames.forEach(deleteImageFile)
            return res.status(400).json({ error: 'All fields are required' })
        }

        if (!Number.isInteger(seats) || seats < 1 || seats > 20) {
            filenames.forEach(deleteImageFile)
            return res.status(400).json({ error: 'Seats must be a number between 1 and 20' })
        }

        if (!FUEL_TYPES.includes(String(fuelType).toLowerCase())) {
            filenames.forEach(deleteImageFile)
            return res.status(400).json({
                error: `Fuel type must be one of: ${FUEL_TYPES.join(', ')}`,
            })
        }

        const newCar = new Car({
            name,
            brand,
            pricePerDay,
            description,
            seats,
            location,
            fuelType: String(fuelType).toLowerCase(),
            images: filenames,
            image: filenames[0],
        })
        await newCar.save()
        res.status(201).json(newCar)
    } catch (error) {
        uploadedFilenames(req).forEach(deleteImageFile)
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
    const newFiles = uploadedFilenames(req)

    try {
        const { name, brand, pricePerDay, description, location, fuelType } = req.body
        const car = await Car.findById(req.params.id)

        if (!car) {
            newFiles.forEach(deleteImageFile)
            return res.status(404).json({ error: 'Car not found' })
        }

        if (name) car.name = name
        if (brand) car.brand = brand
        if (pricePerDay) car.pricePerDay = pricePerDay
        if (description) car.description = description
        if (location) car.location = location

        if (req.body.seats !== undefined && req.body.seats !== '') {
            const seats = parseSeats(req.body.seats)
            if (!Number.isInteger(seats) || seats < 1 || seats > 20) {
                newFiles.forEach(deleteImageFile)
                return res.status(400).json({ error: 'Seats must be a number between 1 and 20' })
            }
            car.seats = seats
        }

        if (fuelType) {
            if (!FUEL_TYPES.includes(String(fuelType).toLowerCase())) {
                newFiles.forEach(deleteImageFile)
                return res.status(400).json({
                    error: `Fuel type must be one of: ${FUEL_TYPES.join(', ')}`,
                })
            }
            car.fuelType = String(fuelType).toLowerCase()
        }

        let images = normalizeImages(car)
        const removed = parseRemovedImages(req.body.removedImages)

        if (removed.length) {
            images = images.filter((img) => !removed.includes(img))
            removed.forEach(deleteImageFile)
        }

        if (newFiles.length) {
            images = [...images, ...newFiles]
        }

        if (!images.length) {
            newFiles.forEach(deleteImageFile)
            return res.status(400).json({ error: 'At least one car image is required' })
        }

        car.images = images
        car.image = images[0]

        await car.save()
        res.json(car)
    } catch (error) {
        newFiles.forEach(deleteImageFile)
        next(error)
    }
}

exports.deleteCar = async (req, res, next) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id)

        if (!deletedCar) {
            return res.status(404).json({ error: 'Car not found' })
        }

        normalizeImages(deletedCar).forEach(deleteImageFile)

        res.json({ message: 'Car deleted successfully', deletedCar })
    } catch (error) {
        next(error)
    }
}
