const mongoose = require('mongoose');
const Product = require('../models/products');

exports.get_all_product = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET_ALL_PRODUCT',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            if (docs.length > 0) {
                res.status(200).json({ response });
            } else {
                res.status(404).json({ message: 'No entries found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        });
};

exports.post_product = (req, res, next) => {
    console.log("a");

    console.log(req.file);

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {

            res.status(201).json({
                message: "Post Success",
                postResult: {
                    id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    url: {
                        type: 'POST',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log("a");
            res.status(500).json({ error: err })
        })
};

exports.get_product_by_id = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            res.status(200).json({
                message: "Get By Id Success",
                product: doc,
                request: {
                    type: 'GET_ID',
                    url: 'http://localhost:3000/products/' + doc._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Delete Success",
                request: {
                    type: 'DELETE',
                    url: 'http://localhost:3000/products/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.patch_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Update Success",
                request: {
                    type: 'PATCH',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};