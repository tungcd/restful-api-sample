const mongoose = require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/products');

exports.get_all_order = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET_ALL",
                            url: "http://localhost:3000/orders" + doc._id
                        }
                    }
                }),

            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.post_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Not Found!'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Post Success",
                createOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.get_order_by_id = (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: "GET_ID",
                    url: "http://localhost:3000/orders" + order._id
                }
            })
        })
        .catch(err => res.status(500).json({ error: err }))
};

exports.patch_order = (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Order.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Update Success",
                request: {
                    type: 'PATCH',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order delete success',
                request: {
                    type: "DELETE",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })
        })
        .catch(err => res.status(500).json({ error: err }))
};