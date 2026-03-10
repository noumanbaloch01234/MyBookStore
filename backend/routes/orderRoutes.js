import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post('/', createOrder);

// Get all orders for a user
router.get('/user/:userId', getUserOrders);

// Get single order by ID
router.get('/:orderId', getOrderById);

// Update order status
router.patch('/:orderId/status', updateOrderStatus);

// Cancel order
router.patch('/:orderId/cancel', cancelOrder);

// Get all orders (admin)
router.get('/', getAllOrders);

export default router;