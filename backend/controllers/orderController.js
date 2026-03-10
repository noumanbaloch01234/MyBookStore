import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { userId, address, paymentType } = req.body;
    
    console.log('\n📦 CREATE ORDER');
    console.log('User:', userId);
    console.log('Payment Type:', paymentType);
    
    // Get user's cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Calculate total amount (subtotal + tax)
    const subtotal = cart.totalPrice;
    const taxRate = 0.02;
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + tax;
    
    // Create order items from cart items
    const orderItems = cart.items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image && item.image[0] ? item.image[0] : null
    }));
    
    // Create new order
    const newOrder = new Order({
      userId,
      items: orderItems,
      address,
      amount: totalAmount,
      paymentType,
      isPaid: paymentType === 'Online',
      status: 'Processing'
    });
    
    await newOrder.save();
    
    // Clear cart after order is placed
    cart.items = [];
    cart.calculateTotals();
    await cart.save();
    
    // Display order details
    newOrder.displayOrder();
    
    console.log('✅ Order created successfully');
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
    
  } catch (error) {
    console.error('❌ CREATE ORDER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('\n📋 GET USER ORDERS');
    console.log('User:', userId);
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders`);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
    
  } catch (error) {
    console.error('❌ GET ORDERS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log('\n🔍 GET ORDER BY ID');
    console.log('Order ID:', orderId);
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.displayOrder();
    
    res.status(200).json({
      success: true,
      data: order
    });
    
  } catch (error) {
    console.error('❌ GET ORDER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    console.log('\n🔄 UPDATE ORDER STATUS');
    console.log('Order ID:', orderId);
    console.log('New Status:', status);
    
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.status = status;
    await order.save();
    
    console.log('✅ Order status updated');
    order.displayOrder();
    
    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order
    });
    
  } catch (error) {
    console.error('❌ UPDATE ORDER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    console.log('\n📋 GET ALL ORDERS (ADMIN)');
    
    const orders = await Order.find().sort({ createdAt: -1 });
    
    console.log(`Total orders: ${orders.length}`);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
    
  } catch (error) {
    console.error('❌ GET ALL ORDERS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log('\n❌ CANCEL ORDER');
    console.log('Order ID:', orderId);
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    if (order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered order'
      });
    }
    
    order.status = 'Cancelled';
    await order.save();
    
    console.log('✅ Order cancelled');
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled',
      data: order
    });
    
  } catch (error) {
    console.error('❌ CANCEL ORDER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};