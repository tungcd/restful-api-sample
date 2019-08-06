const express = require('express');
const route = express.Router();
const OrderController = require('../controllers/order.controller');

route.get('/', OrderController.get_all_order);

route.post('/', OrderController.post_order);

route.get('/:orderId', OrderController.get_order_by_id);

route.delete('/:orderId', OrderController.delete_order);

route.patch('/:orderId', OrderController.patch_order);

module.exports = route;