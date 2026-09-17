const express = require('express');
const cors = require('cors');
const { sequelize, seedDatabase } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Online Food Ordering System API is running!' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));

const PORT = 5000;

seedDatabase().then(() => {
    console.log('Database synced and seeded successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});
