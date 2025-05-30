const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');
const notificationRoutes = require('./notifications');
const customerRoutes = require('./customers');
const shopRoutes = require('./shops');
const reviewRoutes = require('./reviews');
const analyticsRoutes = require('./analytics');
const searchRoutes = require('./search');

// Apply routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/notifications', notificationRoutes);
router.use('/customers', customerRoutes);
router.use('/shops', shopRoutes);
router.use('/reviews', reviewRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/search', searchRoutes);

module.exports = router; 