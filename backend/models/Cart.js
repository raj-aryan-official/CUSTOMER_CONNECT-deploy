const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    notes: {
      type: String
    }
  }],
  totalAmount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
cartSchema.index({ user: 1 });

// Method to calculate total amount
cartSchema.methods.calculateTotal = function() {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  this.lastUpdated = Date.now();
};

// Pre-save middleware to calculate total
cartSchema.pre('save', function(next) {
  this.calculateTotal();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function(productId, quantity, price, notes = '') {
  const existingItem = this.items.find(item => item.product.toString() === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = price;
    if (notes) existingItem.notes = notes;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price,
      notes
    });
  }
  
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId);
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = function(productId, quantity) {
  const item = this.items.find(item => item.product.toString() === productId);
  if (item) {
    item.quantity = quantity;
    return this.save();
  }
  return Promise.reject(new Error('Item not found in cart'));
};

// Method to clear cart
cartSchema.methods.clear = function() {
  this.items = [];
  this.totalAmount = 0;
  return this.save();
};

// Method to get cart summary
cartSchema.methods.getSummary = function() {
  return {
    itemCount: this.items.length,
    totalAmount: this.totalAmount,
    lastUpdated: this.lastUpdated
  };
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 