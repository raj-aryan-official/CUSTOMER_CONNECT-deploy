const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  preferences: {
    preferredPaymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi'],
      default: 'cash'
    },
    preferredPickupTime: {
      type: String
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  favoriteProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orderHistory: [{
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  savedAddresses: [{
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  recentSearches: [{
    query: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
customerSchema.index({ user: 1 });
customerSchema.index({ 'preferences.preferredPaymentMethod': 1 });
customerSchema.index({ loyaltyPoints: -1 });

// Method to add loyalty points
customerSchema.methods.addLoyaltyPoints = function(points) {
  this.loyaltyPoints += points;
  return this.save();
};

// Method to add to order history
customerSchema.methods.addToOrderHistory = function(orderId) {
  this.orderHistory.push({
    order: orderId,
    date: Date.now()
  });
  return this.save();
};

// Method to add favorite product
customerSchema.methods.addFavoriteProduct = function(productId) {
  if (!this.favoriteProducts.includes(productId)) {
    this.favoriteProducts.push(productId);
  }
  return this.save();
};

// Method to remove favorite product
customerSchema.methods.removeFavoriteProduct = function(productId) {
  this.favoriteProducts = this.favoriteProducts.filter(
    id => id.toString() !== productId.toString()
  );
  return this.save();
};

// Method to add recent search
customerSchema.methods.addRecentSearch = function(query) {
  this.recentSearches.push({
    query,
    date: Date.now()
  });
  // Keep only last 10 searches
  if (this.recentSearches.length > 10) {
    this.recentSearches = this.recentSearches.slice(-10);
  }
  return this.save();
};

// Method to get customer summary
customerSchema.methods.getSummary = function() {
  return {
    loyaltyPoints: this.loyaltyPoints,
    orderCount: this.orderHistory.length,
    favoriteProductsCount: this.favoriteProducts.length,
    lastActive: this.lastActive
  };
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 