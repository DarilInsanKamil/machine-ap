// [POST] ==> v1/product/post
const { validationResult } = require('express-validator')
const ProductPost = require('../model/product')

exports.createProduct = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = new Error('Invalid value')
        err.errorStatus = 400
        err.data = errors.array()
        throw err
    }

    if(!req.file) {
        const err = new Error('Image harus diupload')
        err.errorStatus = 422
        err.data = errors.array()
        throw err
    }

    const title = req.body.title
    const image = req.file.path
    const deskripsi = req.body.deskripsi

    const PostData = new ProductPost({
        title: title,
        deskripsi: deskripsi,
        image: image,
        author: { uid: 1, name: 'komangg' }
    })

    PostData.save()
        .then(result => {
            res.status(201).json({
                message: 'Create Data Sucsses',
                data: result
            })
        })
        .catch(err => {
            console.log('err', err)
        })
}


// [GET] ==> v1/product/products
exports.getAllProducts = (req, res, next) => {
    const result = {
        message: 'Create Data Sucsses',
        data: {
            id: +new Date(),
            title: 'molding machine',
            deskripsi: 'molding machine euro 4',
            created_at: new Date().toLocaleDateString(),
            author: {
                uid: 1,
                name: "komangg"
            }
        }
    }
    res.status(200).json(result)
    next()
}