const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['product', 'shop'],
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    url: String,
    caption: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
reviewSchema.index({ user: 1 });
reviewSchema.index({ product: 1 });
reviewSchema.index({ shop: 1 });
reviewSchema.index({ type: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Method to add like
reviewSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to remove like
reviewSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => id.toString() !== userId.toString());
  return this.save();
};

// Method to mark as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count += 1;
  }
  return this.save();
};

// Method to unmark as helpful
reviewSchema.methods.unmarkHelpful = function(userId) {
  this.helpful.users = this.helpful.users.filter(
    id => id.toString() !== userId.toString()
  );
  this.helpful.count = this.helpful.users.length;
  return this.save();
};

// Method to get review summary
reviewSchema.methods.getSummary = function() {
  return {
    rating: this.rating,
    title: this.title,
    likes: this.likes.length,
    helpful: this.helpful.count,
    isVerified: this.isVerified,
    createdAt: this.createdAt
  };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 