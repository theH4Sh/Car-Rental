const multer = require('multer')
const path = require('path')

// set storage destination and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now()
        const ext = path.extname(file.originalname)
        cb(null, file.originalname + '-' + uniqueName + ext)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png']
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only png & jpg images are allowed'))
    }
}

const upload = multer({
    storage,
    fileFilter,
    limit: { fileSize: 5 * 1024 * 1024 } //5MB Limit
})

module.exports = upload;