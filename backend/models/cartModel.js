import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: [{
    type: String
  }],
  category: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals method
cartSchema.methods.calculateTotals = function() {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Custom toString for better console display
cartSchema.methods.displayCart = function() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                     SHOPPING CART                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`User ID: ${this.userId}`);
  console.log('─'.repeat(60));
  
  if (this.items.length === 0) {
    console.log('Cart is empty!');
  } else {
    this.items.forEach((item, index) => {
      console.log(`\n${index + 1}. Product Details:`);
      console.log(`   Name:       ${item.name}`);
      console.log(`   Category:   ${item.category || 'N/A'}`);
      console.log(`   Price:      Rs ${item.price}`);
      console.log(`   Quantity:   ${item.quantity}`);
      console.log(`   Subtotal:   Rs ${(item.price * item.quantity).toFixed(2)}`);
      console.log(`   Item ID:    ${item._id}`);
      console.log('   ' + '─'.repeat(56));
    });
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log(`TOTAL ITEMS:  ${this.totalItems}`);
  console.log(`TOTAL PRICE:  Rs ${this.totalPrice.toFixed(2)}`);
  console.log('═'.repeat(60) + '\n');
};

// Override toJSON to include formatted display in API responses
cartSchema.methods.toJSON = function() {
  const obj = this.toObject();
  
  // Add formatted items for better readability
  obj.itemsDetails = this.items.map((item, index) => ({
    itemNumber: index + 1,
    productName: item.name,
    category: item.category,
    pricePerUnit: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
    itemId: item._id
  }));
  
  return obj;
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;