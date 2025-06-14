const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'authorization required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token, process.env.SECRET)
        req.user = await User.findById(_id).select('_id username')
        next()
    } catch (error) {
        res.status(401).json({ error: 'not authorized'})
    }
}

module.exports = requireAuth