import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId/add', addToCart);
router.put('/:userId/item/:itemId', updateCartItem);
router.delete('/:userId/item/:itemId', removeFromCart);
router.delete('/:userId/clear', clearCart);

export default router;