const { validationResult } = require('express-validator')
const ProductPost = require('../model/product')
const path = require('path')
const fs = require('fs')

// [POST] ==> v1/product/post
exports.createProduct = (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = new Error('Invalid value')
        err.errorStatus = 400
        err.data = errors.array()
        throw err
    }

    if (!req.file) {
        const err = new Error('Image harus diupload')
        err.errorStatus = 422
        err.data = errors.array()
        throw err
    }

    const title = req.body.title
    const image = req.file.path
    const deskripsi = req.body.deskripsi
    const kategori = req.body.kategori
    // console.log('imagespek', imagespek)

    const PostData = new ProductPost({
        title: title,
        deskripsi: deskripsi,
        image: image,
        kategori: kategori,
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
    console.log('title', title)
    console.log('deskripsi', deskripsi)
    console.log('kategori', kategori)
    console.log('image', image)
}

// [GET] ==> v1/product/products
exports.getAllProducts = (req, res, next) => {
    ProductPost.find()
        .then(result => {
            res.status(200).json({
                message: 'Succsess get all data',
                data: result
            })
        })
        .catch(err => {
            next(err)
        })
}

// [GETbyID] ==> v1/product/products/:postId
exports.getProductById = (req, res, next) => {
    const postId = req.params.postId
    ProductPost.findById(postId)
        .then(result => {
            if (!result) {
                const error = new Error('Data tidak ditemukan')
                error.errorStatus = 404
                throw error
            }
            res.status(200).json({
                message: 'Data berhasil dipanggil',
                data: result
            })
        })
        .catch(err => {
            next(err)
        })
}

// [PUT/UPDATE] ==> v1/product/products/:postId
exports.updateProductById = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = new Error('Invalid value')
        err.errorStatus = 400
        err.data = errors.array()
        throw err
    }

    if (!req.file) {
        const err = new Error('Image harus diupload')
        err.errorStatus = 422
        err.data = errors.array()
        throw err
    }

    const title = req.body.title
    const image = req.file.path
    const deskripsi = req.body.deskripsi
    const kategori = req.body.kategori
    const postId = req.params.postId

    ProductPost.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Data tidak ditemukan')
                error.errorStatus = 404
                throw error
            }
            post.title = title
            post.deskripsi = deskripsi
            post.kategori = kategori
            post.image = image

            return post.save()
        })
        .then(result => {
            res.status(200).json({
                message: 'Update Sukses',
                data: result
            })
        })
        .catch(err => {
            next(err)
        })
}


const removeImage = (filePath) => {
    filePath = path.join(__dirname, '../..', filePath)
    fs.unlink(filePath, err => console.log(err))
}

// [DELETE] ==> v1/product/products/:postId
exports.deleteProductById = (req, res, next) => {
    const postId = req.params.postId

    ProductPost.findById(postId)
        .then(post => {
            if (!post) {
                const err = new Error('Invalid value')
                err.errorStatus = 400
                err.data = errors.array()
                throw err
            }
            removeImage(post.image)
            return ProductPost.findByIdAndRemove(postId)
        })
        .then(result => {
            res.status(200).json({
                message: 'Berhasil dihapus',
                data: result
            })
        })
        .catch(err => {
            next(err)
        })
}
