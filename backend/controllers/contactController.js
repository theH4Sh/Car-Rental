const validator = require('validator')
const ContactMessage = require('../models/ContactMessage')

const createMessage = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const trimmed = {
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            subject: String(subject).trim(),
            message: String(message).trim(),
        }

        if (trimmed.name.length < 2) {
            return res.status(400).json({ error: 'Please enter your name' })
        }

        if (!validator.isEmail(trimmed.email)) {
            return res.status(400).json({ error: 'Please enter a valid email' })
        }

        if (trimmed.subject.length < 3) {
            return res.status(400).json({ error: 'Subject is too short' })
        }

        if (trimmed.message.length < 10) {
            return res.status(400).json({ error: 'Message should be at least 10 characters' })
        }

        const saved = await ContactMessage.create(trimmed)
        res.status(201).json({
            message: 'Message sent successfully',
            id: saved._id,
        })
    } catch (error) {
        next(error)
    }
}

const getMessages = async (req, res, next) => {
    try {
        const { status } = req.query
        const filter = {}
        if (status && ['new', 'read', 'archived'].includes(status)) {
            filter.status = status
        }

        const messages = await ContactMessage.find(filter).sort({ createdAt: -1 })
        const unreadCount = await ContactMessage.countDocuments({ status: 'new' })

        res.json({ messages, unreadCount })
    } catch (error) {
        next(error)
    }
}

const updateMessageStatus = async (req, res, next) => {
    try {
        const { status } = req.body

        if (!['new', 'read', 'archived'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const updated = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ error: 'Message not found' })
        }

        res.json(updated)
    } catch (error) {
        next(error)
    }
}

const deleteMessage = async (req, res, next) => {
    try {
        const deleted = await ContactMessage.findByIdAndDelete(req.params.id)

        if (!deleted) {
            return res.status(404).json({ error: 'Message not found' })
        }

        res.json({ message: 'Message deleted', deleted })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createMessage,
    getMessages,
    updateMessageStatus,
    deleteMessage,
}
