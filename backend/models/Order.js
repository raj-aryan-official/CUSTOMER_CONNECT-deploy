const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopOwner: {
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
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'unavailable', 'packed'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'ready_for_pickup', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi'],
    default: 'cash'
  },
  pickupTime: {
    type: Date
  },
  notes: {
    type: String
  },
  customerNotes: {
    type: String
  },
  shopNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ shopOwner: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Method to calculate total amount
orderSchema.methods.calculateTotal = function() {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Pre-save middleware to calculate total
orderSchema.pre('save', function(next) {
  this.calculateTotal();
  next();
});

// Method to get order summary
orderSchema.methods.getSummary = function() {
  return {
    orderId: this._id,
    status: this.status,
    totalAmount: this.totalAmount,
    itemCount: this.items.length,
    createdAt: this.createdAt,
    pickupTime: this.pickupTime
  };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 