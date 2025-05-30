const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  businessHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    open: String,
    close: String,
    isClosed: {
      type: Boolean,
      default: false
    }
  }],
  categories: [{
    type: String,
    trim: true
  }],
  settings: {
    orderConfirmationRequired: {
      type: Boolean,
      default: true
    },
    autoConfirmOrders: {
      type: Boolean,
      default: false
    },
    minimumOrderAmount: {
      type: Number,
      default: 0
    },
    deliveryAvailable: {
      type: Boolean,
      default: false
    },
    deliveryRadius: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    }
  },
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    customerCount: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['logo', 'banner', 'gallery']
    }
  }],
  paymentMethods: [{
    type: String,
    enum: ['cash', 'card', 'upi']
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
shopSchema.index({ owner: 1 });
shopSchema.index({ name: 'text', description: 'text' });
shopSchema.index({ 'address.city': 1 });
shopSchema.index({ categories: 1 });
shopSchema.index({ isActive: 1 });

// Method to update business hours
shopSchema.methods.updateBusinessHours = function(day, open, close, isClosed) {
  const dayIndex = this.businessHours.findIndex(h => h.day === day);
  if (dayIndex > -1) {
    this.businessHours[dayIndex] = { day, open, close, isClosed };
  } else {
    this.businessHours.push({ day, open, close, isClosed });
  }
  return this.save();
};

// Method to update stats
shopSchema.methods.updateStats = function(orderAmount) {
  this.stats.totalOrders += 1;
  this.stats.totalRevenue += orderAmount;
  this.stats.averageOrderValue = this.stats.totalRevenue / this.stats.totalOrders;
  return this.save();
};

// Method to update rating
shopSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Method to get shop summary
shopSchema.methods.getSummary = function() {
  return {
    name: this.name,
    rating: this.rating,
    isActive: this.isActive,
    totalOrders: this.stats.totalOrders,
    averageOrderValue: this.stats.averageOrderValue
  };
};

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop; 