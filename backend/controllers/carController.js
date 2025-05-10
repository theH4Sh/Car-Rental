const Car = require('../models/Car')

exports.createCar = async (req, res, next) => {
    try {
        const { name, brand , pricePerDay, description } = req.body

        // Check if file is uploaded
        if(!req.file) {
            return res.status(400).json({error: 'Car image is required'})
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
        const cars = await Car.find();
        res.json(cars)
    } catch (error) {
        next(error)
    }
}

exports.getCarById = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        
        if (!car) {
            const error = new Error('Car not found')
            error.status = 404
            return next(error)
        }

        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.deleteCar = async (req, res, next) => {
    try {
        const carId = req.params.id;
        const deletedCar = await Car.findByIdAndDelete(carId);

        if(!deletedCar) {
            const error = 'Car not found'
            error.status(404)
            next(error)
        }

        res.json({ message:'Car deleted successfully', deletedCar })
    } catch (error) {
        next(error)
    }
}