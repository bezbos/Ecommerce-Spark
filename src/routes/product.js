const express = require('express')
const router = express.Router()

// Including Product model
const { Product } = require('../models/models');

// Including Product validation
const { productValidation } = require('../validation/validation');

/**
 * @route POST /api/products/
 * @desc Adding product
 * @access Private
 */
router.post('/', async (req, res) => {
    const { error } = productValidation(req.body);
    if (error) {
        res.status(404).json({ error: error.details[0].message, code: 3 });
    }
    else {
        let product = new Product(req.body);
        product = await product.save();
        res.status(200).json({ product, msg: 'Product successfully registered.' });
    }
})

/**
 * @route GET /api/products/
 * @desc Showing all products
 * @access Public
 */
router.get('/', async (req, res) => {
    Product.find((err, products) => {
        if (err) {
            res.status(400).json({ error: err, code: 1 });
        }
        else if (products.length > 0) {
            res.status(200).json(products);
        }
        else {
            res.status(400).json({ error: "There is no products.", code: 2 });
        }
    });
})

/**
 * @route GET /api/products/:id
 * @desc Showing product info
 * @access Public
 */
router.get('/:id', async (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if (err) {
            res.status(400).json({ error: err, code: 1 });
        }
        else {
            res.status(200).json(product);
        }
    });
})

/**
 * @route PUT /api/products/:id
 * @desc Updating product info
 * @access Private
 */
router.put('/:id', (req, res) => {
    const { error } = productValidation(req.body);
    if (error) {
        return res.status(404).json({ error: error.details[0], code: 3 });
    }
    Product.findByIdAndUpdate(req.params.id, req.body, (err, product) => {
        if (err) {
            res.status(404).json({ error: 'Product not found.', code: 1 });
        }
        else {
            res.status(200).json({ product, msg: 'Product successfully updated.' });
        }
    })
})

/**
 * @route DELETE /api/products/:id
 * @desc Deleting product from Database
 * @access Private
 */
router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, product) => {
        if (err) {
            res.status(404).json({ error: 'Product not found.', code: 1 });
        }
        else {
            res.status(200).json({ product, msg: 'Product successfully deleted.' });
        }
    })
})

module.exports = router;