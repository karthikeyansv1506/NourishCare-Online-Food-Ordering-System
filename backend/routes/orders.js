const express = require('express');
const router = express.Router();
const { Order, OrderItem, MenuItem, User } = require('../models');

// Place a new order
router.post('/', async (req, res) => {
    try {
        const { userId, items, totalAmount, deliveryAddress, paymentMode } = req.body;
        // items should be an array of { menuItemId, quantity, price }

        // ETA is 15 seconds from now (for project demonstration)
        const estimatedDeliveryTime = new Date(Date.now() + 15 * 1000);

        const newOrder = await Order.create({
            userId,
            totalAmount,
            deliveryAddress: deliveryAddress || 'Store Pickup',
            paymentMode: paymentMode || 'Cash on Delivery',
            estimatedDeliveryTime,
            status: 'preparing' // Changed to preparing for the tracking map animation
        });

        // Create all OrderItems associated with this order
        const orderItemsData = items.map(item => ({
            orderId: newOrder.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItemsData);

        res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder.id });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to place order.' });
    }
});

// Get ALL orders (for Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['name', 'email', 'address'] },
                { model: OrderItem, include: [MenuItem] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ error: 'Failed to fetch all orders.' });
    }
});

// Get orders for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.params.userId },
            include: [{
                model: OrderItem,
                include: [MenuItem] // Include item details like name and image
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

// Update order status (used when user confirms delivery)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        
        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        if (status === 'out_for_delivery') {
            const estimatedDeliveryTime = new Date(Date.now() + 15 * 1000);
            await order.update({ status, estimatedDeliveryTime });
        } else {
            await order.update({ status });
        }
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update order status.' });
    }
});

module.exports = router;
