const { sequelize, User, Order, OrderItem } = require('./models');
async function test() {
  try {
     const newOrder = await Order.create({
        userId: 1, // Using admin user just to test if Order creation works
        totalAmount: 690,
        deliveryAddress: "karthi 3/9 tnhb",
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000),
        status: 'pending'
     });

     const items = [
      { menuItemId: 9, price: 80, quantity: 1 },
      { menuItemId: 6, price: 130, quantity: 1 },
      { menuItemId: 8, price: 160, quantity: 3 }
     ];

     const orderItemsData = items.map(item => ({
         orderId: newOrder.id,
         menuItemId: item.menuItemId,
         quantity: item.quantity,
         price: item.price
     }));

     await OrderItem.bulkCreate(orderItemsData);
     require('fs').writeFileSync('test_output.txt', 'SUCCESS');
  } catch (err) {
     require('fs').writeFileSync('test_output.txt', err.stack);
  }
}
test();
