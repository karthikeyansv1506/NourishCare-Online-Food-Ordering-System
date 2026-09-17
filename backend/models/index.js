const sequelize = require('../database');
const User = require('./User');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations (OOSE Relationships)

// A User can have many Orders (One-to-Many)
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// An Order can have many OrderItems (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// An OrderItem belongs to a specific MenuItem (One-to-One / Many-to-One)
OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });
MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId' });

// Seed data function to populate menu initially
const seedDatabase = async () => {
    await sequelize.sync(); // Gracefully update tables with new columns
    
    // Check if already seeded to prevent duplicate seeding
    const existingItems = await MenuItem.count();
    if (existingItems > 0) return;
    // Create initial admin user
    await User.create({
        name: 'Admin',
        email: 'admin@foodsys.com',
        password: 'password123',
        role: 'admin'
    });

    // Seed menu items
    await MenuItem.bulkCreate([
        {
            name: 'Quinoa Masala Dosa',
            description: 'A crispy, healthy alternative to the classic dosa, packed with protein-rich quinoa and spiced potato filling.',
            price: 120, // INR
            category: 'South Indian',
            imageUrl: '/images/quinoa_dosa.png',
            dietaryTags: 'Diabetic-Friendly, Low-GI'
        },
        {
            name: 'Palak Paneer with Brown Rice',
            description: 'Rich, creamy spinach gravy with soft cottage cheese cubes, served alongside nutritious brown rice.',
            price: 250, // INR
            category: 'North Indian',
            imageUrl: '/images/palak_paneer.png',
            dietaryTags: 'High-Protein, Hypertension-Friendly'
        },
        {
            name: 'Millet Roti Thali',
            description: 'Wholesome assorted millet flatbreads served with a side of protein-packed dal makhani and fresh green salad.',
            price: 180, // INR
            category: 'Thali',
            imageUrl: '/images/millet_roti.png',
            dietaryTags: 'Diabetic-Friendly, Fiber-Rich'
        },
        {
            name: 'Sprouted Moong Salad',
            description: 'Fresh, crunchy moong dal sprouts tossed with zesty lemon, cucumber, tomatoes, and Indian spices.',
            price: 90, // INR
            category: 'Salads',
            imageUrl: '/images/moong_salad.png',
            dietaryTags: 'Weight-Loss, Diabetic-Friendly, Hypertension-Friendly'
        },
        {
            name: 'Oats Idli',
            description: 'Soft, steamed savory cakes made from roasted oats and carrots. Served with coconut chutney.',
            price: 110, // INR
            category: 'South Indian',
            imageUrl: '/images/oats_idli.png',
            dietaryTags: 'Heart-Healthy, Hypertension-Friendly'
        },
        {
            name: 'Ragi Chilla',
            description: 'Nutritious savory pancakes made from finger millet (ragi), packed with calcium and dietary fiber.',
            price: 130, // INR
            category: 'Snacks',
            imageUrl: '/images/ragi_chilla.png',
            dietaryTags: 'Calcium-Rich, Diabetic-Friendly'
        },
        {
            name: 'ABC Detox Juice',
            description: 'Freshly cold-pressed Apple, Beetroot, and Carrot juice. Rich in antioxidants and vitamins.',
            price: 140, // INR
            category: 'Juices',
            imageUrl: '/images/abc_juice.png',
            dietaryTags: 'Heart-Healthy, Hypertension-Friendly'
        },
        {
            name: 'Sugar-Free Badam Milk',
            description: 'Warm, comforting almond milk sweetened with stevia and infused with real saffron threads.',
            price: 160,
            category: 'Beverages',
            imageUrl: '/images/badam_milk.png',
            dietaryTags: 'Diabetic-Friendly, Keto'
        },
        {
            name: 'Ragi Jaggery Laddu',
            description: 'A guilt-free dessert ball made from iron-rich ragi flour and natural jaggery. Perfect sweet treat.',
            price: 80,
            category: 'Desserts',
            imageUrl: '/images/ragi_laddu.png',
            dietaryTags: 'Iron-Rich, Heart-Healthy'
        },
        {
            name: 'Fresh Mixed Fruit Bowl',
            description: 'A seasonal mix of fresh, low-GI fruits including papaya, apples, and berries.',
            price: 150,
            category: 'Salads',
            imageUrl: '/images/fruit_bowl.png',
            dietaryTags: 'Diabetic-Friendly, Weight-Loss'
        }
    ]);
    console.log('Database seeded automatically with NourishCare Menu.');
};

module.exports = {
    sequelize,
    User,
    MenuItem,
    Order,
    OrderItem,
    seedDatabase
};
