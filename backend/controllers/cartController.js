import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Get user cart with detailed display
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('\n🛒 FETCHING CART FOR USER:', userId);
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      console.log('Cart not found, creating new cart');
      cart = await Cart.create({ userId, items: [] });
    }
    
    // Display cart in console
    cart.displayCart();
    
    res.status(200).json({
      success: true,
      data: cart
    });
    
  } catch (error) {
    console.error('❌ GET CART ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;
    
    console.log('\n➕ ADDING TO CART');
    console.log('User:', userId);
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
      console.log(`✅ Updated existing item: ${product.name}`);
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.offerPrice || product.price,
        image: product.image,
        category: product.category,
        quantity: parseInt(quantity)
      });
      console.log(`✅ Added new item: ${product.name}`);
    }
    
    cart.calculateTotals();
    await cart.save();
    
    // Display updated cart
    cart.displayCart();
    
    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: cart
    });
    
  } catch (error) {
    console.error('❌ ADD TO CART ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;
    
    console.log('\n🔄 UPDATING CART ITEM');
    console.log('User:', userId);
    console.log('Item ID:', itemId);
    console.log('New Quantity:', quantity);
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const item = cart.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    console.log(`Updating: ${item.name} (${item.quantity} → ${quantity})`);
    item.quantity = parseInt(quantity);
    cart.calculateTotals();
    await cart.save();
    
    // Display updated cart
    cart.displayCart();
    
    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
    
  } catch (error) {
    console.error('❌ UPDATE CART ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    console.log('\n🗑️ REMOVING FROM CART');
    console.log('User:', userId);
    console.log('Item ID:', itemId);
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const itemToRemove = cart.items.id(itemId);
    if (itemToRemove) {
      console.log(`Removing: ${itemToRemove.name}`);
    }
    
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    cart.calculateTotals();
    await cart.save();
    
    // Display updated cart
    cart.displayCart();
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
    
  } catch (error) {
    console.error('❌ REMOVE FROM CART ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('\n🧹 CLEARING CART');
    console.log('User:', userId);
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    cart.calculateTotals();
    await cart.save();
    
    console.log('✅ Cart cleared successfully');
    cart.displayCart();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
    
  } catch (error) {
    console.error('❌ CLEAR CART ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};