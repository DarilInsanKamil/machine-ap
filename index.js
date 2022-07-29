const express = require('express')
const app = express()
const port = 4000
const productRoutes = require('./src/routes/products')
const authRoutes = require('./src/routes/auth')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyparser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))


app.use((req, res, next) => {
    res.setHeader('Access-control-Allow-Origin', '*')
    res.setHeader('Access-control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTINS, DELETE')
    res.setHeader('Access-control-Allow-Headers', 'Content-type, Authorization')
    next()
})

app.use('/v1/product', productRoutes)
app.use('/v1/auth', authRoutes)

app.use((error, req, res, next) => {
    const status = error.errorStatus
    const message = error.message
    const data = error.data
    res.status(status).json({ message: message, data: data })
    next()
})

mongoose.connect('mongodb+srv://darilkamil:1HN75Yr9YOjY9VsV@mern-api.0dnkz.mongodb.net/product?retryWrites=true&w=majority')
    .then(() => {
        app.listen(port, () => console.log('Connection success'))
    })
    .catch(err => console.log(err))

//mongodb+srv://darilkamil:1HN75Yr9YOjY9VsV@mern-api.0dnkz.mongodb.net/?retryWrites=true&w=majority