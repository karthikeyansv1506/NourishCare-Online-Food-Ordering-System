const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, preparing, out_for_delivery, delivered
    },
    paymentMode: {
        type: DataTypes.STRING,
        defaultValue: 'Cash on Delivery'
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estimatedDeliveryTime: {
        type: DataTypes.DATE
    }
});

module.exports = Order;
