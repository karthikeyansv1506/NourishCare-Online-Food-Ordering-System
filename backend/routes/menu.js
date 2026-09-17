const express = require('express');
const router = express.Router();
const { MenuItem } = require('../models');

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items.' });
    }
});

// Get recommended items based on condition
router.get('/recommended/:condition', async (req, res) => {
    try {
        const { condition } = req.params;
        const allItems = await MenuItem.findAll();
        
        let recommended = [];
        if (!condition || condition === 'None') {
            // suggest most popular or just random 3 items
            recommended = allItems.slice(0, 3);
        } else {
            recommended = allItems.filter(item => item.dietaryTags && item.dietaryTags.toLowerCase().includes(condition.toLowerCase()));
        }
        res.json(recommended);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations.' });
    }
});

module.exports = router;
