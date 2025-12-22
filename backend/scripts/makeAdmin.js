/**
 * Promote a user to admin.
 * Usage: node scripts/makeAdmin.js <username>
 */
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/userModel')

const username = process.argv[2]

if (!username) {
    console.error('Usage: node scripts/makeAdmin.js <username>')
    process.exit(1)
}

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const user = await User.findOneAndUpdate(
            { username },
            { role: 'admin' },
            { new: true }
        ).select('-password')

        if (!user) {
            console.error(`User "${username}" not found`)
            process.exit(1)
        }

        console.log(`✓ ${user.username} is now an admin`)
        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
