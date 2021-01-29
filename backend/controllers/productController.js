const Product = require('../models/product')

const getProducts = async (req, res) => {

    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        res.json({ msg: "Error retreiving products" })
    }

}

const getProductbyId = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id)
        res.json(product)
    } catch (error) {
        res.json({ msg: "Error retreiving product by id" })
    }

}


const deleteProductById = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id)

        if (product) {
            await product.remove()
            res.json({ msg: "Product Removed" })
        }

    } catch (error) {
        res.json({ msg: "Error deleting product" })
    }

}

const createProduct = async (req, res) => {

    try {
        const product = new Product({
            name: 'Sample Name',
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Sample Brand',
            category: 'Sample Category',
            countInStock: 0,
            numReviews: 0,
            description: "Sample Desc"
        })

        const createdProduct = await product.save()
        res.status(201).json(createdProduct)

    } catch (error) {
        res.json({ msg: "Error creating product" })
    }

}

const updateProduct = async (req, res) => {
    try {

        const { name, price, description, image, brand, category, countInStock } = req.body
        const product = await Product.findById(req.params.id)

        if (product) {
            product.name = name
            product.price = price
            product.description = description
            product.image = image
            product.brand = brand
            product.category = category
            product.countInStock = countInStock
        }

        const updatedProduct = await product.save()

        res.status(201).json(updatedProduct)

    } catch (error) {
        res.json({ msg: "Product not found" })
    }

}

const createProductReview = async (req, res) => {

    try {

        const { rating, comment } = req.body
        const product = await Product.findById(req.params.id)

        if (product) {
            const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

            if (alreadyReviewed) {
                return res.status(400).json({ msg: "Product already reviewed" })
            }
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }


        product.reviews.push(review) //add reivew to reviews array

        product.numReviews = product.reviews.length // update number of reviews

        product.rating = product.reviews.reduce((acc, r) => r.rating + acc, 0) / product.reviews.length

        const updatedProduct = await product.save()

        res.status(201).json({ updatedProduct, msg: "Review Added" })

    } catch (error) {
        res.json({ msg: "Product not found", error })
    }

}

module.exports = { getProducts, getProductbyId, deleteProductById, createProduct, updateProduct, createProductReview }