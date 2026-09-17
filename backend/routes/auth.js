const express = require('express');
const router = express.Router();
const { User } = require('../models');

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, address, medicalCondition } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        const newUser = await User.create({ name, email, password, address, medicalCondition });
        res.status(201).json({ message: 'User registered successfully!', user: { id: newUser.id, name: newUser.name, email: newUser.email, address: newUser.address, medicalCondition: newUser.medicalCondition } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user.' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isValid = await user.isValidPassword(password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        res.json({ message: 'Login successful!', user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address, medicalCondition: user.medicalCondition } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login.' });
    }
});

module.exports = router;
