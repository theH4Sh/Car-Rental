const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = async (req, res, next) => {
    const { identifier, password } = req.body

    try {
        const user = await User.login(identifier, password)

        const role = user.role
        const username = user.username

        const token = createToken(user._id)

        res.status(200).json({ username, token, role })
    } catch (error) {
        next(error)
    }
}

const signUpUser = async (req, res, next) => {
    const { username, email, password } = req.body

    try {
        const user = await User.signup(username, email, password)

        const token = createToken(user._id)

        res.status(201).json({
            username,
            email,
            token,
            role: user.role,
            message: `${username} registered successfully`,
        })
    } catch (error) {
        next(error)
    }
}

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    const { username } = req.params

    try {
        const user = await User.findOne({
            username: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        }).select('-password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const { username, email } = req.body
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' })
        }

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email' })
        }

        const taken = await User.findOne({
            _id: { $ne: user._id },
            $or: [{ username }, { email }],
        })

        if (taken) {
            if (taken.email === email) {
                return res.status(409).json({ error: 'Email already in use' })
            }
            if (taken.username === username) {
                return res.status(409).json({ error: 'Username already taken' })
            }
        }

        user.username = username
        user.email = email
        await user.save()

        const safeUser = await User.findById(user._id).select('-password')
        res.json(safeUser)
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' })
        }

        const match = await bcrypt.compare(currentPassword, user.password)
        if (!match) {
            return res.status(400).json({ error: 'Current password is incorrect' })
        }

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({
                error: 'New password is not strong enough. Use 8+ chars with upper, lower, number, and symbol.',
            })
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ error: 'New password must be different from the current one' })
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        res.json({ message: 'Password updated successfully' })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    loginUser,
    signUpUser,
    getUser,
    getMe,
    updateProfile,
    changePassword,
}
